import { useMemo } from 'react';

import teoriaData from '@/data/teoria.json';

export type DificuldadeConteudo = 'facil' | 'medio' | 'dificil';

export interface VariavelFormula {
  simbolo: string;
  significado: string;
}

export interface ExercicioResolvidoData {
  enunciado: string;
  passo_a_passo: string;
  resolucao_legivel: string;
  resolucao_latex: string;
  resposta_final: string;
}

export interface ConteudoTeoricoSchema {
  tema: string;
  topico: string;
  conceito: string;
  formula_legivel: string;
  formula_latex: string;
  variaveis: VariavelFormula[];
  nota_pedagogica: string;
  exercicio_resolvido: ExercicioResolvidoData;
  fonte_externa_necessaria: boolean;
  fonte: string;
}

export interface ConteudoTeoricoItem extends ConteudoTeoricoSchema {
  id: string;
  dificuldade: DificuldadeConteudo;
}

interface TeoriaJson {
  conteudos: ConteudoTeoricoSchema[];
}

const dificuldadeLabels: Record<DificuldadeConteudo, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
};

const ordemDificuldade: DificuldadeConteudo[] = ['facil', 'medio', 'dificil'];

function criarIdConteudo(conteudo: ConteudoTeoricoSchema) {
  return `${conteudo.tema}-${conteudo.topico}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function definirDificuldade(index: number, total: number): DificuldadeConteudo {
  const tamanhoGrupo = Math.ceil(total / ordemDificuldade.length);
  const grupo = Math.min(Math.floor(index / tamanhoGrupo), ordemDificuldade.length - 1);

  return ordemDificuldade[grupo];
}

export function useConteudoTeorico(dificuldade?: DificuldadeConteudo) {
  return useMemo(() => {
    const conteudosJson = (teoriaData as TeoriaJson).conteudos;
    const conteudos = conteudosJson.map<ConteudoTeoricoItem>((conteudo, index) => ({
      ...conteudo,
      id: criarIdConteudo(conteudo),
      dificuldade: definirDificuldade(index, conteudosJson.length),
    }));

    const conteudosFiltrados = dificuldade
      ? conteudos.filter((conteudo) => conteudo.dificuldade === dificuldade)
      : conteudos;

    const agrupadosPorDificuldade = ordemDificuldade.map((nivel) => ({
      dificuldade: nivel,
      titulo: dificuldadeLabels[nivel],
      conteudos: conteudos.filter((conteudo) => conteudo.dificuldade === nivel),
    }));

    return {
      conteudos: conteudosFiltrados,
      todosConteudos: conteudos,
      agrupadosPorDificuldade,
      dificuldadeLabels,
      getConteudoById: (id: string) => conteudos.find((conteudo) => conteudo.id === id),
      getConteudosPorDificuldade: (nivel: DificuldadeConteudo) =>
        conteudos.filter((conteudo) => conteudo.dificuldade === nivel),
    };
  }, [dificuldade]);
}
