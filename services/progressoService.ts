import AsyncStorage from '@react-native-async-storage/async-storage';

export type TipoAtividadeProgresso = 'flashcards' | 'memoria' | 'quiz' | 'desafio' | 'lacunas';

export interface RegistroProgresso {
  id: string;
  tipo: TipoAtividadeProgresso;
  modulo: string;
  dificuldade: string;
  acertos: number;
  erros: number;
  tempoGastoSegundos: number;
  totalItens: number;
  criadoEm: string;
}

export interface ResumoModuloProgresso {
  modulo: string;
  totalSessoes: number;
  totalAcertos: number;
  totalErros: number;
  totalItens: number;
  tempoTotalSegundos: number;
  mediaAcertosPercentual: number;
}

export interface ResumoProgresso {
  totalSessoes: number;
  totalAcertos: number;
  totalErros: number;
  totalItens: number;
  tempoTotalSegundos: number;
  mediaAcertosPercentual: number;
  porModulo: ResumoModuloProgresso[];
  ultimasSessoes: RegistroProgresso[];
}

const STORAGE_KEY = '@fisicai:progresso-jogos';

async function lerRegistros(): Promise<RegistroProgresso[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as RegistroProgresso[];
  } catch {
    return [];
  }
}

function calcularMediaAcertos(acertos: number, totalItens: number) {
  if (totalItens <= 0) {
    return 0;
  }

  return Math.round((acertos / totalItens) * 100);
}

function ordenarPorDataDecrescente(registros: RegistroProgresso[]) {
  return [...registros].sort(
    (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
  );
}

function agregarResumo(registros: RegistroProgresso[]): ResumoProgresso {
  const registrosOrdenados = ordenarPorDataDecrescente(registros);
  const totais = registros.reduce(
    (acc, registro) => ({
      totalAcertos: acc.totalAcertos + registro.acertos,
      totalErros: acc.totalErros + registro.erros,
      totalItens: acc.totalItens + registro.totalItens,
      tempoTotalSegundos: acc.tempoTotalSegundos + registro.tempoGastoSegundos,
    }),
    {
      totalAcertos: 0,
      totalErros: 0,
      totalItens: 0,
      tempoTotalSegundos: 0,
    }
  );
  const agrupados = registros.reduce<Record<string, ResumoModuloProgresso>>((acc, registro) => {
    const atual = acc[registro.modulo] ?? {
      modulo: registro.modulo,
      totalSessoes: 0,
      totalAcertos: 0,
      totalErros: 0,
      totalItens: 0,
      tempoTotalSegundos: 0,
      mediaAcertosPercentual: 0,
    };

    atual.totalSessoes += 1;
    atual.totalAcertos += registro.acertos;
    atual.totalErros += registro.erros;
    atual.totalItens += registro.totalItens;
    atual.tempoTotalSegundos += registro.tempoGastoSegundos;
    atual.mediaAcertosPercentual = calcularMediaAcertos(atual.totalAcertos, atual.totalItens);
    acc[registro.modulo] = atual;

    return acc;
  }, {});

  return {
    totalSessoes: registros.length,
    ...totais,
    mediaAcertosPercentual: calcularMediaAcertos(totais.totalAcertos, totais.totalItens),
    porModulo: Object.values(agrupados).sort((a, b) => b.totalSessoes - a.totalSessoes),
    ultimasSessoes: registrosOrdenados.slice(0, 5),
  };
}

export const progressoService = {
  async listarRegistros() {
    return ordenarPorDataDecrescente(await lerRegistros());
  },

  async salvarRegistro(registro: Omit<RegistroProgresso, 'id' | 'criadoEm'>) {
    const registros = await lerRegistros();
    const novoRegistro: RegistroProgresso = {
      ...registro,
      id: `${registro.tipo}-${registro.modulo}-${Date.now()}`,
      criadoEm: new Date().toISOString(),
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([novoRegistro, ...registros]));

    return novoRegistro;
  },

  async obterResumo() {
    return agregarResumo(await lerRegistros());
  },

  async limparRegistros() {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
};
