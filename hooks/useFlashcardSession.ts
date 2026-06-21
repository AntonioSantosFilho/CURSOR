import { useEffect, useMemo, useRef, useState } from 'react';

import flashcardsData from '@/data/flashcards.json';
import { progressoService } from '@/services/progressoService';

export type DificuldadeJogo = 'facil' | 'medio' | 'dificil';
export type TipoFlashcard = 'conceito' | 'formula' | 'aplicacao';

export interface FlashcardData {
  id: string;
  frente: string;
  verso: string;
  formula_latex?: string;
  tipo: TipoFlashcard;
  dificuldade: DificuldadeJogo;
  fonte: string;
}

interface FlashcardsJson {
  modulos: Array<{
    id: string;
    titulo: string;
    descricao?: string;
    flashcards: FlashcardData[];
  }>;
}

export interface FeedbackJogo {
  type: 'success' | 'error';
  title: string;
  message: string;
  explanation: string;
}

const dadosFlashcards = flashcardsData as FlashcardsJson;
const modulosFlashcards = dadosFlashcards.modulos ?? [];

export function getFlashcardModules() {
  return modulosFlashcards.map((modulo) => ({
    id: modulo.id,
    modulo: modulo.titulo,
    descricao: modulo.descricao,
    dificuldades: Array.from(
      new Set(modulo.flashcards.map((flashcard) => flashcard.dificuldade))
    ),
    total: modulo.flashcards.length,
  }));
}

export function getFlashcardsByModuleAndDifficulty(
  modulo: string,
  dificuldade: DificuldadeJogo
) {
  const moduloEncontrado = modulosFlashcards.find(
    (item) => item.titulo === modulo || item.id === modulo
  );

  if (!moduloEncontrado) {
    return [];
  }

  return moduloEncontrado.flashcards.filter(
    (flashcard) => flashcard.dificuldade === dificuldade
  );
}

export function useFlashcardSession(modulo: string, dificuldade: DificuldadeJogo) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackJogo | null>(null);
  const savedRef = useRef(false);

  const flashcards = useMemo(
    () => getFlashcardsByModuleAndDifficulty(modulo, dificuldade),
    [dificuldade, modulo]
  );
  const currentFlashcard = flashcards[currentIndex];
  const answeredCount = acertos + erros;
  const isComplete = flashcards.length > 0 && answeredCount >= flashcards.length;

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
      tipo: 'flashcards',
      modulo,
      dificuldade,
      acertos,
      erros,
      tempoGastoSegundos: elapsedSeconds,
      totalItens: flashcards.length,
    });
  }, [acertos, dificuldade, elapsedSeconds, erros, flashcards.length, isComplete, modulo]);

  function answerCard(known: boolean) {
    if (!currentFlashcard || isComplete) {
      return;
    }

    if (known) {
      setAcertos((total) => total + 1);
      setFeedback({
        type: 'success',
        title: 'Boa revisão!',
        message: 'Você lembrou a resposta do cartão.',
        explanation: currentFlashcard.verso,
      });
    } else {
      setErros((total) => total + 1);
      setFeedback({
        type: 'error',
        title: 'Revise este ponto',
        message: 'Use a explicação para reforçar o conceito antes de avançar.',
        explanation: `${currentFlashcard.verso}\n\nFonte: ${currentFlashcard.fonte}`,
      });
    }
  }

  function nextCard() {
    setFeedback(null);
    setIsFlipped(false);
    setCurrentIndex((index) => Math.min(index + 1, flashcards.length));
  }

  function resetSession() {
    savedRef.current = false;
    setCurrentIndex(0);
    setIsFlipped(false);
    setAcertos(0);
    setErros(0);
    setElapsedSeconds(0);
    setFeedback(null);
  }

  return {
    flashcards,
    currentFlashcard,
    currentIndex,
    total: flashcards.length,
    isFlipped,
    setIsFlipped,
    acertos,
    erros,
    elapsedSeconds,
    feedback,
    isComplete,
    answerCard,
    nextCard,
    resetSession,
  };
}
