import { router, type Href } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import BadgeDificuldade from '@/components/BadgeDificuldade';
import BotaoPrimario from '@/components/BotaoPrimario';
import Header from '@/components/Header';
import HelpButton from '@/components/HelpButton';
import { colors } from '@/constants';
import {
  getFlashcardModules,
  getFlashcardsByModuleAndDifficulty,
  type DificuldadeJogo,
} from '@/hooks/useFlashcardSession';

const dificuldades: DificuldadeJogo[] = ['facil', 'medio', 'dificil'];

export default function FlashcardSelectionScreen() {
  const modules = getFlashcardModules();

  return (
    <View className="flex-1 bg-background">
      <Header showBackButton title="Flashcards" />

      <ScrollView contentContainerClassName="gap-lg px-lg pb-3xl pt-xl">
        <View className="items-end">
          <HelpButton compact />
        </View>

        <View className="rounded-3xl border border-border bg-surface-alt p-lg">
          <Text className="font-arial text-sm font-bold uppercase tracking-widest text-secondary">
            Revisão rápida
          </Text>
          <Text className="mt-sm font-arial text-2xl font-bold text-primary">
            Escolha a dificuldade
          </Text>
          <Text className="mt-sm font-arial text-md leading-6 text-text">
            A sequência dos cartões é definida pelo sistema a partir do arquivo de dados.
          </Text>
        </View>

        {modules.map((module) => (
          <View key={module.modulo} className="gap-md rounded-3xl border border-border bg-card p-lg">
            <View className="flex-row items-center justify-between gap-md">
              <View className="flex-1">
                <Text className="font-arial text-xl font-bold text-primary">{module.modulo}</Text>
                <Text className="mt-xs font-arial text-sm text-text-muted">
                  {module.total} cartões disponíveis
                </Text>
              </View>
              <View className="rounded-full bg-secondary px-md py-xs">
                <Text
                  className="font-arial text-xs font-bold"
                  style={{ color: colors.textOnSecondary }}>
                  RF01
                </Text>
              </View>
            </View>

            {dificuldades.map((dificuldade) => {
              const total = getFlashcardsByModuleAndDifficulty(module.modulo, dificuldade).length;

              return (
                <View
                  key={dificuldade}
                  className="gap-sm rounded-2xl border border-border bg-primary-light p-md">
                  <View className="flex-row items-center justify-between gap-md">
                    <BadgeDificuldade dificuldade={dificuldade} />
                    <Text className="font-arial text-sm font-bold text-primary">
                      {total} cartões
                    </Text>
                  </View>
                  <BotaoPrimario
                    disabled={total === 0}
                    label="Iniciar sequência"
                    onPress={() =>
                      router.push(
                        `/jogos/flashcards/${encodeURIComponent(
                          module.modulo
                        )}?dificuldade=${dificuldade}` as Href
                      )
                    }
                  />
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
