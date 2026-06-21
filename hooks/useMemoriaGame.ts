import { useEffect, useMemo, useRef, useState } from 'react';

import memoriaData from '@/data/memoria.json';
import type { DificuldadeJogo, FeedbackJogo } from '@/hooks/useFlashcardSession';
import { progressoService } from '@/services/progressoService';

type TipoParMemoria =
  | 'conceito_definicao'
  | 'conceito_formula'
  | 'termo_simbolo'
  | 'fenomeno_aplicacao';

export type TipoConteudoCarta = 'texto' | 'formula';

export interface ConteudoCartaMemoria {
  tipo_conteudo: TipoConteudoCarta;
  conteudo: string;
}

export interface ParMemoriaData {
  id: string;
  tipo_par: TipoParMemoria;
  carta_a: ConteudoCartaMemoria;
  carta_b: ConteudoCartaMemoria;
  explicacao_pos_acerto: string;
  dificuldade: DificuldadeJogo;
  fonte: string;
}

export interface CartaMemoriaData extends ConteudoCartaMemoria {
  id: string;
  pairId: string;
  explicacao: string;
  fonte: string;
}

interface MemoriaJson {
  modulos: Array<{
    id: string;
    titulo: string;
    descricao?: string;
    pares: ParMemoriaData[];
  }>;
}

const dadosMemoria = memoriaData as MemoriaJson;
const modulosMemoria = dadosMemoria.modulos ?? [];

function shuffleCards(cards: CartaMemoriaData[]) {
  const shuffled = [...cards];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function buildCards(pares: ParMemoriaData[]) {
  return pares.flatMap<CartaMemoriaData>((par, index) => {
    const pairId = `${par.id}-${index}`;

    return [
      {
        id: `${pairId}-a`,
        pairId,
        explicacao: par.explicacao_pos_acerto,
        fonte: par.fonte,
        ...par.carta_a,
      },
      {
        id: `${pairId}-b`,
        pairId,
        explicacao: par.explicacao_pos_acerto,
        fonte: par.fonte,
        ...par.carta_b,
      },
    ];
  });
}

export function getMemoriaModules() {
  return modulosMemoria.map((modulo) => ({
    id: modulo.id,
    modulo: modulo.titulo,
    descricao: modulo.descricao,
    dificuldades: Array.from(new Set(modulo.pares.map((par) => par.dificuldade))),
    total: modulo.pares.length,
  }));
}

export function getParesByModuleAndDifficulty(modulo: string, dificuldade: DificuldadeJogo) {
  const moduloEncontrado = modulosMemoria.find(
    (item) => item.titulo === modulo || item.id === modulo
  );

  if (!moduloEncontrado) {
    return [];
  }

  return moduloEncontrado.pares.filter((par) => par.dificuldade === dificuldade);
}

export function useMemoriaGame(modulo: string, dificuldade: DificuldadeJogo) {
  const pares = useMemo(
    () => getParesByModuleAndDifficulty(modulo, dificuldade),
    [dificuldade, modulo]
  );
  const [cards, setCards] = useState<CartaMemoriaData[]>(() => shuffleCards(buildCards(pares)));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [pendingMismatchIds, setPendingMismatchIds] = useState<string[]>([]);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackJogo | null>(null);
  const savedRef = useRef(false);

  const isComplete = pares.length > 0 && matchedPairIds.length === pares.length;

  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dificuldade, modulo]);

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
      tipo: 'memoria',
      modulo,
      dificuldade,
      acertos,
      erros,
      tempoGastoSegundos: elapsedSeconds,
      totalItens: pares.length,
    });
  }, [acertos, dificuldade, elapsedSeconds, erros, isComplete, modulo, pares.length]);

  function selectCard(cardId: string) {
    if (feedback || selectedIds.includes(cardId) || pendingMismatchIds.length > 0) {
      return;
    }

    const card = cards.find((item) => item.id === cardId);

    if (!card || matchedPairIds.includes(card.pairId)) {
      return;
    }

    if (selectedIds.length === 0) {
      setSelectedIds([cardId]);
      return;
    }

    const firstCard = cards.find((item) => item.id === selectedIds[0]);

    if (!firstCard) {
      setSelectedIds([cardId]);
      return;
    }

    if (firstCard.pairId === card.pairId) {
      setMatchedPairIds((ids) => [...ids, card.pairId]);
      setSelectedIds([]);
      setAcertos((total) => total + 1);
      setFeedback({
        type: 'success',
        title: 'Par correto!',
        message: 'Você associou os dois conteúdos.',
        explanation: card.explicacao,
      });
      return;
    }

    setErros((total) => total + 1);
    setPendingMismatchIds([firstCard.id, card.id]);
    setSelectedIds([]);
    setFeedback({
      type: 'error',
      title: 'Ainda não é esse par',
      message: 'Compare os significados e tente novamente.',
      explanation: `Dica: procure uma relação direta entre conceito, símbolo, fórmula ou aplicação. Releia as cartas antes da próxima tentativa.\n\nFontes: ${firstCard.fonte} | ${card.fonte}`,
    });
  }

  function closeFeedback() {
    setFeedback(null);
    setPendingMismatchIds([]);
  }

  function resetGame() {
    savedRef.current = false;
    setCards(shuffleCards(buildCards(pares)));
    setSelectedIds([]);
    setMatchedPairIds([]);
    setPendingMismatchIds([]);
    setAcertos(0);
    setErros(0);
    setElapsedSeconds(0);
    setFeedback(null);
  }

  return {
    cards,
    pares,
    selectedIds,
    matchedPairIds,
    pendingMismatchIds,
    acertos,
    erros,
    elapsedSeconds,
    feedback,
    isComplete,
    selectCard,
    closeFeedback,
    resetGame,
  };
}
