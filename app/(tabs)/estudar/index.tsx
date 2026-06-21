import { router, useLocalSearchParams, type Href } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import BotaoPrimario from '@/components/BotaoPrimario';
import BotaoSecundario from '@/components/BotaoSecundario';
import ConteudoCard from '@/components/ConteudoCard';
import Header from '@/components/Header';
import HelpButton from '@/components/HelpButton';
import { colors } from '@/constants';
import { useConteudoTeorico } from '@/hooks/useConteudoTeorico';

export default function StudyScreen() {
  const { module } = useLocalSearchParams<{ module?: string }>();
  const { agrupadosPorDificuldade } = useConteudoTeorico();

  return (
    <View className="flex-1 bg-background">
      <Header title="Estudar" />

      <ScrollView contentContainerClassName="px-lg pb-3xl pt-xl">
        <View className="mb-lg flex-row items-start justify-between gap-md">
          <View className="flex-1">
            <Text className="font-arial text-sm font-bold uppercase tracking-widest text-secondary">
              Conteúdo teórico
            </Text>
            <Text className="mt-sm font-arial text-2xl font-bold text-primary">
              Fórmulas e conceitos para consulta rápida
            </Text>
            <Text className="mt-sm font-arial text-md leading-6 text-text">
              Estude por dificuldade, revise variáveis das fórmulas e pratique com exercícios
              resolvidos.
            </Text>
          </View>
          <HelpButton compact />
        </View>

        {module === 'simulacoes-phet' && (
          <View
            className="mb-lg rounded-3xl border p-lg"
            style={{ backgroundColor: colors.secondaryLight, borderColor: colors.secondary }}>
            <Text className="font-arial text-sm font-bold uppercase tracking-widest text-primary">
              Simulações selecionadas
            </Text>
            <Text className="mt-sm font-arial text-md leading-6 text-text">
              Acesse a área PhET para explorar experimentos embarcados no app.
            </Text>
          </View>
        )}

        <View className="mb-xl gap-md">
          <BotaoPrimario
            accessibilityHint="Abre a preparação da sessão de quiz"
            label="Responder quiz"
            onPress={() => router.push('/jogos/quiz' as Href)}
          />
          <BotaoPrimario
            accessibilityHint="Inicia desafio sequencial de Magnetismo"
            label="Iniciar desafio sequencial"
            onPress={() => router.push('/jogos/desafio/magnetismo?dificuldade=todas' as Href)}
          />
          <BotaoPrimario
            accessibilityHint="Inicia jogo de completar lacunas de Magnetismo"
            label="Completar lacunas"
            onPress={() => router.push('/jogos/lacunas/magnetismo?dificuldade=todas' as Href)}
          />
          <BotaoPrimario
            accessibilityHint="Abre a seleção de flashcards"
            label="Praticar com flashcards"
            onPress={() => router.push('/jogos/flashcards' as Href)}
          />
          <BotaoPrimario
            accessibilityHint="Abre a seleção do jogo da memória"
            label="Jogar memória"
            onPress={() => router.push('/jogos/memoria' as Href)}
          />
          <BotaoSecundario
            accessibilityHint="Abre a lista de simulações PhET"
            label="Explorar simulações PhET"
            onPress={() => router.push('/estudar/phet' as Href)}
          />
        </View>

        <View className="gap-xl">
          {agrupadosPorDificuldade.map((grupo) => (
            <View key={grupo.dificuldade} className="gap-md">
              <View className="flex-row items-center justify-between gap-md">
                <Text className="font-arial text-xl font-bold text-primary">{grupo.titulo}</Text>
                <View className="rounded-full bg-secondary px-md py-xs">
                  <Text
                    className="font-arial text-xs font-bold"
                    style={{ color: colors.textOnSecondary }}>
                    {grupo.conteudos.length} tópicos
                  </Text>
                </View>
              </View>

              {grupo.conteudos.map((conteudo) => (
                <ConteudoCard
                  key={conteudo.id}
                  conceito={conteudo.conceito}
                  dificuldade={conteudo.dificuldade}
                  onPress={() =>
                    router.push(`/estudar/${encodeURIComponent(conteudo.id)}` as Href)
                  }
                  tema={conteudo.tema}
                  topico={conteudo.topico}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
