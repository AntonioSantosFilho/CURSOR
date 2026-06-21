import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import BotaoReiniciar from '@/components/BotaoReiniciar';
import BotaoSecundario from '@/components/BotaoSecundario';
import CartaMemoria from '@/components/CartaMemoria';
import FeedbackModal from '@/components/FeedbackModal';
import Header from '@/components/Header';
import HelpButton from '@/components/HelpButton';
import type { DificuldadeJogo } from '@/hooks/useFlashcardSession';
import { useMemoriaGame } from '@/hooks/useMemoriaGame';

function normalizeDificuldade(value?: string): DificuldadeJogo {
  if (value === 'medio' || value === 'dificil') {
    return value;
  }

  return 'facil';
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function MemoryGameScreen() {
  const { modulo, dificuldade } = useLocalSearchParams<{
    modulo?: string;
    dificuldade?: string;
  }>();
  const moduleName = modulo ?? 'Magnetismo';
  const selectedDifficulty = normalizeDificuldade(dificuldade);
  const game = useMemoriaGame(moduleName, selectedDifficulty);

  return (
    <View className="flex-1 bg-background">
      <Header showBackButton title="Memória" />

      <ScrollView contentContainerClassName="gap-lg px-lg pb-3xl pt-xl">
        <View className="items-end">
          <HelpButton compact />
        </View>

        <View className="rounded-3xl border border-border bg-surface-alt p-lg">
          <Text className="font-arial text-sm font-bold uppercase tracking-widest text-secondary">
            {moduleName}
          </Text>
          <Text className="mt-sm font-arial text-2xl font-bold text-primary">
            Jogo de associação
          </Text>
          <Text className="mt-sm font-arial text-md leading-6 text-text">
            Encontre {game.pares.length} pares · Tempo {formatTime(game.elapsedSeconds)}
          </Text>
        </View>

        <View className="flex-row gap-md">
          <View className="flex-1 rounded-2xl bg-primary-light p-md">
            <Text className="font-arial text-sm font-bold text-primary">Pares corretos</Text>
            <Text className="mt-xs font-arial text-2xl font-bold text-text">{game.acertos}</Text>
          </View>
          <View className="flex-1 rounded-2xl bg-secondary-light p-md">
            <Text className="font-arial text-sm font-bold text-primary">Tentativas extras</Text>
            <Text className="mt-xs font-arial text-2xl font-bold text-text">{game.erros}</Text>
          </View>
        </View>

        {game.isComplete ? (
          <View className="gap-md rounded-3xl border border-border bg-card p-lg">
            <Text className="font-arial text-2xl font-bold text-primary">Jogo concluído</Text>
            <Text className="font-arial text-md leading-6 text-text">
              Seu progresso foi salvo com {game.acertos} pares corretos em{' '}
              {formatTime(game.elapsedSeconds)}.
            </Text>
            <BotaoReiniciar onPress={game.resetGame} />
            <BotaoSecundario label="Voltar para seleção" onPress={() => router.back()} />
          </View>
        ) : null}

        {game.cards.length > 0 ? (
          <View className="flex-row flex-wrap gap-md">
            {game.cards.map((card) => {
              const isSelected = game.selectedIds.includes(card.id);
              const isMatched = game.matchedPairIds.includes(card.pairId);
              const isMismatch = game.pendingMismatchIds.includes(card.id);

              return (
                <CartaMemoria
                  key={card.id}
                  conteudo={card.conteudo}
                  isMatched={isMatched}
                  isMismatch={isMismatch}
                  isRevealed={isSelected || isMatched}
                  onPress={() => game.selectCard(card.id)}
                  tipoConteudo={card.tipo_conteudo}
                />
              );
            })}
          </View>
        ) : (
          <View className="rounded-3xl border border-border bg-card p-lg">
            <Text className="font-arial text-xl font-bold text-primary">Nenhum par encontrado</Text>
            <Text className="mt-sm font-arial text-md leading-6 text-text-muted">
              Escolha outra dificuldade para continuar.
            </Text>
          </View>
        )}

        {!game.isComplete ? <BotaoReiniciar onPress={game.resetGame} /> : null}
      </ScrollView>

      <FeedbackModal
        actionLabel="Continuar"
        explanation={game.feedback?.explanation ?? ''}
        message={game.feedback?.message ?? ''}
        onClose={game.closeFeedback}
        title={game.feedback?.title ?? ''}
        type={game.feedback?.type ?? 'success'}
        visible={Boolean(game.feedback)}
      />
    </View>
  );
}
