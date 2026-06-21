import { useEffect, useMemo, useRef, useState } from 'react';

import lacunasData from '@/data/lacunas.json';
import type { DificuldadeJogo, FeedbackJogo } from '@/hooks/useFlashcardSession';
import type { DificuldadeFiltro } from '@/hooks/useQuizSession';
import { progressoService } from '@/services/progressoService';
import { compararResposta } from '@/utils/normalizarResposta';

export interface LacunaData {
  id: string;
  modulo_id: string;
  frase: string;
  resposta: string;
  respostas_aceitas: string[];
  explicacao: string;
  dificuldade: DificuldadeJogo;
  fonte: string;
}

interface LacunasJson {
  lacunas: LacunaData[];
}

const lacunas = (lacunasData as LacunasJson).lacunas;

function titleFromModuloId(moduloId: string) {
  return moduloId
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getLacunasModules() {
  const moduloIds = Array.from(new Set(lacunas.map((lacuna) => lacuna.modulo_id)));

  return moduloIds.map((moduloId) => {
    const itens = lacunas.filter((lacuna) => lacuna.modulo_id === moduloId);

    return {
      id: moduloId,
      titulo: titleFromModuloId(moduloId),
      total: itens.length,
      dificuldades: Array.from(new Set(itens.map((item) => item.dificuldade))),
    };
  });
}

export function getLacunasByModuleAndDifficulty(
  moduloId: string,
  dificuldade: DificuldadeFiltro
) {
  const itens = lacunas.filter((lacuna) => lacuna.modulo_id === moduloId);

  if (dificuldade === 'todas') {
    return itens;
  }

  return itens.filter((lacuna) => lacuna.dificuldade === dificuldade);
}

export function useLacunasSession(moduloId: string, dificuldade: DificuldadeFiltro) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respostaDigitada, setRespostaDigitada] = useState('');
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackJogo | null>(null);
  const savedRef = useRef(false);

  const itens = useMemo(
    () => getLacunasByModuleAndDifficulty(moduloId, dificuldade),
    [dificuldade, moduloId]
  );
  const currentLacuna = itens[currentIndex];
  const answeredCount = acertos + erros;
  const isComplete = itens.length > 0 && answeredCount >= itens.length;

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
      tipo: 'lacunas',
      modulo: moduloId,
      dificuldade,
      acertos,
      erros,
      tempoGastoSegundos: elapsedSeconds,
      totalItens: itens.length,
    });
  }, [acertos, dificuldade, elapsedSeconds, erros, isComplete, itens.length, moduloId]);

  function submitAnswer() {
    if (!currentLacuna || feedback || isComplete) {
      return;
    }

    const respostasAceitas = [currentLacuna.resposta, ...currentLacuna.respostas_aceitas];
    const isCorrect = compararResposta(respostaDigitada, respostasAceitas);

    if (isCorrect) {
      setAcertos((total) => total + 1);
      setFeedback({
        type: 'success',
        title: 'Lacuna correta!',
        message: 'Sua resposta foi aceita.',
        explanation: currentLacuna.explicacao,
      });
      return;
    }

    setErros((total) => total + 1);
    setFeedback({
      type: 'error',
      title: 'Resposta não aceita',
      message: 'Revise o termo esperado e tente reconhecer a ideia central da frase.',
      explanation: `${currentLacuna.explicacao}\n\nResposta esperada: ${currentLacuna.resposta}\nFonte: ${currentLacuna.fonte}`,
    });
  }

  function nextLacuna() {
    setFeedback(null);
    setRespostaDigitada('');
    setCurrentIndex((index) => Math.min(index + 1, itens.length));
  }

  function resetSession() {
    savedRef.current = false;
    setCurrentIndex(0);
    setRespostaDigitada('');
    setAcertos(0);
    setErros(0);
    setElapsedSeconds(0);
    setFeedback(null);
  }

  return {
    itens,
    currentLacuna,
    currentIndex,
    total: itens.length,
    respostaDigitada,
    setRespostaDigitada,
    acertos,
    erros,
    elapsedSeconds,
    feedback,
    isComplete,
    submitAnswer,
    nextLacuna,
    resetSession,
  };
}
