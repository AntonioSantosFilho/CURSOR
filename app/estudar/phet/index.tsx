import { router, type Href } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import Header from '@/components/Header';
import SimulacaoCard from '@/components/SimulacaoCard';
import { colors } from '@/constants';
import { useSimulacoes } from '@/hooks/useSimulacoes';

export default function PhetListScreen() {
  const { agrupadasPorTema } = useSimulacoes();

  return (
    <View className="flex-1 bg-background">
      <Header showBackButton title="PhET" />

      <ScrollView contentContainerClassName="px-lg pb-3xl pt-xl">
        <View className="mb-xl rounded-3xl border border-border bg-surface-alt p-lg">
          <Text className="font-arial text-sm font-bold uppercase tracking-widest text-secondary">
            Simulações embarcadas
          </Text>
          <Text className="mt-sm font-arial text-2xl font-bold text-primary">
            Experimentos PhET
          </Text>
          <Text className="mt-sm font-arial text-md leading-6 text-text">
            Escolha uma simulação para revisar objetivos, tópicos e iniciar o experimento dentro
            do app.
          </Text>
        </View>

        <View className="gap-xl">
          {agrupadasPorTema.map((grupo) => (
            <View key={grupo.tema} className="gap-md">
              <View className="flex-row items-center justify-between gap-md">
                <Text className="font-arial text-xl font-bold text-primary">{grupo.titulo}</Text>
                <View className="rounded-full bg-secondary px-md py-xs">
                  <Text
                    className="font-arial text-xs font-bold"
                    style={{ color: colors.textOnSecondary }}>
                    {grupo.simulacoes.length} sims
                  </Text>
                </View>
              </View>

              {grupo.simulacoes.map((simulacao) => (
                <SimulacaoCard
                  key={simulacao.id}
                  descricao={simulacao.descricao}
                  nome={simulacao.nome}
                  onPress={() =>
                    router.push(`/estudar/phet/${encodeURIComponent(simulacao.id)}` as Href)
                  }
                  tema={simulacao.tema}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
