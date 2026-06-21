import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import GraficoAcertos from '@/components/GraficoAcertos';
import Header from '@/components/Header';
import HelpButton from '@/components/HelpButton';
import ProgressoCard from '@/components/ProgressoCard';
import { colors } from '@/constants';
import { progressoService, type ResumoProgresso } from '@/services/progressoService';

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }

  return `${minutes}min`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function ProgressScreen() {
  const [resumo, setResumo] = useState<ResumoProgresso | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      void progressoService.obterResumo().then((data) => {
        if (active) {
          setResumo(data);
        }
      });

      return () => {
        active = false;
      };
    }, [])
  );

  const dadosGrafico =
    resumo?.porModulo.map((modulo) => ({
      label: modulo.modulo,
      valor: modulo.mediaAcertosPercentual,
    })) ?? [];

  return (
    <View className="flex-1 bg-background">
      <Header title="Progresso" />

      <ScrollView contentContainerClassName="px-lg pb-3xl pt-xl">
        <View className="mb-lg flex-row items-start justify-between gap-md">
          <View className="flex-1">
            <Text className="font-arial text-sm font-bold uppercase tracking-widest text-secondary">
              Evolução
            </Text>
            <Text className="mt-sm font-arial text-2xl font-bold text-primary">
              Desempenho do aluno
            </Text>
            <Text className="mt-sm font-arial text-md leading-6 text-text">
              Acompanhe sessões salvas localmente, média de acertos e tempo dedicado.
            </Text>
          </View>
          <HelpButton compact />
        </View>

        <View className="mb-lg rounded-3xl bg-secondary p-lg">
          <Text
            className="font-arial text-sm font-bold uppercase tracking-widest"
            style={{ color: colors.textOnSecondary }}>
            Resumo geral
          </Text>
          <Text
            className="mt-sm font-arial text-2xl font-bold"
            style={{ color: colors.textOnSecondary }}>
            {resumo?.mediaAcertosPercentual ?? 0}% de acertos
          </Text>
          <Text className="mt-xs font-arial text-md" style={{ color: colors.textOnSecondary }}>
            {resumo?.totalSessoes ?? 0} sessões · {formatTime(resumo?.tempoTotalSegundos ?? 0)}
          </Text>
        </View>

        <View className="gap-lg">
          <GraficoAcertos data={dadosGrafico} />

          {resumo?.porModulo.map((modulo) => (
            <ProgressoCard
              key={modulo.modulo}
              mediaAcertosPercentual={modulo.mediaAcertosPercentual}
              modulo={modulo.modulo}
              tempoTotal={formatTime(modulo.tempoTotalSegundos)}
              totalSessoes={modulo.totalSessoes}
            />
          ))}

          <View className="rounded-3xl border border-border bg-card p-lg">
            <Text className="font-arial text-xl font-bold text-primary">Últimas 5 sessões</Text>
            <View className="mt-md gap-sm">
              {resumo?.ultimasSessoes.length ? (
                resumo.ultimasSessoes.map((sessao) => (
                  <View key={sessao.id} className="rounded-2xl bg-primary-light p-md">
                    <Text className="font-arial text-sm font-bold text-primary">
                      {sessao.tipo} · {sessao.modulo}
                    </Text>
                    <Text className="mt-xs font-arial text-sm text-text">
                      {sessao.acertos}/{sessao.totalItens} acertos ·{' '}
                      {formatTime(sessao.tempoGastoSegundos)} · {formatDate(sessao.criadoEm)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="font-arial text-sm leading-5 text-text-muted">
                  Nenhuma sessão salva ainda. Complete um jogo para ver seu histórico.
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
