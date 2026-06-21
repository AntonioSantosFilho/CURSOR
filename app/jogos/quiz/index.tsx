import { router, type Href } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import BadgeDificuldade from '@/components/BadgeDificuldade';
import BotaoPrimario from '@/components/BotaoPrimario';
import BotaoSecundario from '@/components/BotaoSecundario';
import Header from '@/components/Header';
import HelpButton from '@/components/HelpButton';
import { colors } from '@/constants';
import type { DificuldadeJogo } from '@/hooks/useFlashcardSession';
import { getQuizModules, getQuestoesByModuleAndDifficulty, type DificuldadeFiltro } from '@/hooks/useQuizSession';

const dificuldades: DificuldadeFiltro[] = ['facil', 'medio', 'dificil', 'todas'];

function dificuldadeLabel(dificuldade: DificuldadeFiltro) {
  return dificuldade === 'todas' ? 'Todas' : dificuldade;
}

export default function QuizPreparationScreen() {
  const modules = getQuizModules();

  return (
    <View className="flex-1 bg-background">
      <Header showBackButton title="Quiz" />

      <ScrollView contentContainerClassName="gap-lg px-lg pb-3xl pt-xl">
        <View className="items-end">
          <HelpButton compact />
        </View>

        <View className="rounded-3xl border border-border bg-surface-alt p-lg">
          <Text className="font-arial text-sm font-bold uppercase tracking-widest text-secondary">
            Avaliação guiada
          </Text>
          <Text className="mt-sm font-arial text-2xl font-bold text-primary">
            Escolha módulo e dificuldade
          </Text>
          <Text className="mt-sm font-arial text-md leading-6 text-text">
            As perguntas aparecem somente dentro da sessão, seguindo a sequência definida pelo
            sistema.
          </Text>
        </View>

        {modules.map((module) => (
          <View key={module.id} className="gap-md rounded-3xl border border-border bg-card p-lg">
            <View className="flex-row items-center justify-between gap-md">
              <View className="flex-1">
                <Text className="font-arial text-xl font-bold text-primary">{module.titulo}</Text>
                <Text className="mt-xs font-arial text-sm leading-5 text-text-muted">
                  {module.descricao} · {module.questoes.length} questões
                </Text>
              </View>
              <View className="rounded-full bg-secondary px-md py-xs">
                <Text
                  className="font-arial text-xs font-bold"
                  style={{ color: colors.textOnSecondary }}>
                  RF03
                </Text>
              </View>
            </View>

            {dificuldades.map((dificuldade) => {
              const total = getQuestoesByModuleAndDifficulty(module.id, dificuldade).length;

              return (
                <View
                  key={dificuldade}
                  className="gap-sm rounded-2xl border border-border bg-primary-light p-md">
                  <View className="flex-row items-center justify-between gap-md">
                    {dificuldade === 'todas' ? (
                      <View className="rounded-full bg-secondary px-md py-xs">
                        <Text
                          className="font-arial text-xs font-bold"
                          style={{ color: colors.textOnSecondary }}>
                          Todas
                        </Text>
                      </View>
                    ) : (
                      <BadgeDificuldade dificuldade={dificuldade as DificuldadeJogo} />
                    )}
                    <Text className="font-arial text-sm font-bold text-primary">
                      {total} questões
                    </Text>
                  </View>

                  <View className="gap-sm">
                    <BotaoPrimario
                      disabled={total === 0}
                      label={`Iniciar quiz: ${dificuldadeLabel(dificuldade)}`}
                      onPress={() =>
                        router.push(
                          `/jogos/quiz/${encodeURIComponent(module.id)}?dificuldade=${dificuldade}` as Href
                        )
                      }
                    />
                    <BotaoSecundario
                      disabled={total === 0}
                      label="Iniciar desafio"
                      onPress={() =>
                        router.push(
                          `/jogos/desafio/${encodeURIComponent(module.id)}?dificuldade=${dificuldade}` as Href
                        )
                      }
                    />
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
