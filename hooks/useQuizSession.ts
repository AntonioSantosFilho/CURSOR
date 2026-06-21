import { useEffect, useMemo, useRef, useState } from 'react';

import questoesData from '@/data/questoes.json';
import type { DificuldadeJogo, FeedbackJogo } from '@/hooks/useFlashcardSession';
import { progressoService } from '@/services/progressoService';

export type DificuldadeFiltro = DificuldadeJogo | 'todas';
export type TipoQuestao = 'multipla_escolha' | 'calculo';
export type ModoQuiz = 'quiz' | 'desafio';

export interface AlternativaQuestaoData {
  letra: string;
  texto: string;
}

export interface QuestaoData {
  id: string;
  tipo: TipoQuestao;
  enunciado: string;
  alternativas: AlternativaQuestaoData[];
  resposta_correta: string;
  explicacao: string;
  dificuldade: DificuldadeJogo;
  fonte: string;
}

export interface ModuloQuestoes {
  id: string;
  titulo: string;
  descricao: string;
  questoes: QuestaoData[];
}

type QuestoesJson =
  | { modulos: ModuloQuestoes[] }
  | { modulo: string; questoes: QuestaoData[] };

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeQuestoesData(): ModuloQuestoes[] {
  const data = questoesData as QuestoesJson;

  if ('modulos' in data) {
    return data.modulos;
  }

  return [
    {
      id: slugify(data.modulo),
      titulo: data.modulo,
      descricao: `Questões de ${data.modulo}`,
      questoes: data.questoes,
    },
  ];
}

const modulosQuestoes = normalizeQuestoesData();

export function getQuizModules() {
  return modulosQuestoes.map((modulo) => ({
    ...modulo,
    dificuldades: Array.from(new Set(modulo.questoes.map((questao) => questao.dificuldade))),
    tipos: Array.from(new Set(modulo.questoes.map((questao) => questao.tipo))),
  }));
}

export function getQuestoesByModuleAndDifficulty(
  moduloId: string,
  dificuldade: DificuldadeFiltro
) {
  const modulo = modulosQuestoes.find((item) => item.id === moduloId);

  if (!modulo) {
    return [];
  }

  if (dificuldade === 'todas') {
    return modulo.questoes;
  }

  return modulo.questoes.filter((questao) => questao.dificuldade === dificuldade);
}

export function getQuizModuleById(moduloId: string) {
  return modulosQuestoes.find((modulo) => modulo.id === moduloId);
}

export function useQuizSession(
  moduloId: string,
  dificuldade: DificuldadeFiltro,
  modo: ModoQuiz = 'quiz'
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackJogo | null>(null);
  const savedRef = useRef(false);

  const questoes = useMemo(
    () => getQuestoesByModuleAndDifficulty(moduloId, dificuldade),
    [dificuldade, moduloId]
  );
  const modulo = getQuizModuleById(moduloId);
  const currentQuestion = questoes[currentIndex];
  const answeredCount = acertos + erros;
  const isComplete = questoes.length > 0 && answeredCount >= questoes.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isComplete || savedRef.current) {
      return;
    }

    savedRef.current = true;
    void progressoService.salvarRegistro({
      tipo: modo,
      modulo: modulo?.titulo ?? moduloId,
      dificuldade,
      acertos,
      erros,
      tempoGastoSegundos: elapsedSeconds,
      totalItens: questoes.length,
    });
  }, [acertos, dificuldade, elapsedSeconds, erros, isComplete, modo, modulo?.titulo, moduloId, questoes.length]);

  function answerQuestion(letra: string) {
    if (!currentQuestion || feedback || isComplete) {
      return;
    }

    const isCorrect = letra === currentQuestion.resposta_correta;
    setSelectedAnswer(letra);

    if (isCorrect) {
      setAcertos((total) => total + 1);
      setFeedback({
        type: 'success',
        title: 'Resposta correta!',
        message:
          currentQuestion.tipo === 'calculo'
            ? 'Seu cálculo chegou à alternativa correta.'
            : 'Você identificou o conceito correto.',
        explanation: currentQuestion.explicacao,
      });
      return;
    }

    setErros((total) => total + 1);
    setFeedback({
      type: 'error',
      title: 'Resposta incorreta',
      message:
        currentQuestion.tipo === 'calculo'
          ? 'Revise os dados, unidades e a fórmula antes de tentar questões parecidas.'
          : 'Observe a justificativa para diferenciar melhor os conceitos.',
      explanation: `${currentQuestion.explicacao}\n\nAlternativa correta: ${currentQuestion.resposta_correta}\nFonte: ${currentQuestion.fonte}`,
    });
  }

  function nextQuestion() {
    setFeedback(null);
    setSelectedAnswer(null);
    setCurrentIndex((index) => Math.min(index + 1, questoes.length));
  }

  function resetSession() {
    savedRef.current = false;
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAcertos(0);
    setErros(0);
    setElapsedSeconds(0);
    setFeedback(null);
  }

  return {
    modulo,
    questoes,
    currentQuestion,
    currentIndex,
    total: questoes.length,
    selectedAnswer,
    acertos,
    erros,
    elapsedSeconds,
    feedback,
    isComplete,
    answerQuestion,
    nextQuestion,
    resetSession,
  };
}
