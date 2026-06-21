import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import BotaoPrimario from '@/components/BotaoPrimario';
import BotaoReiniciar from '@/components/BotaoReiniciar';
import BotaoSecundario from '@/components/BotaoSecundario';
import FeedbackModal from '@/components/FeedbackModal';
import FlashCard from '@/components/FlashCard';
import Header from '@/components/Header';
import HelpButton from '@/components/HelpButton';
import { colors } from '@/constants';
import {
  type DificuldadeJogo,
  useFlashcardSession,
} from '@/hooks/useFlashcardSession';

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

export default function FlashcardSessionScreen() {
  const { modulo, dificuldade } = useLocalSearchParams<{
    modulo?: string;
    dificuldade?: string;
  }>();
  const moduleName = modulo ?? 'Magnetismo';
  const selectedDifficulty = normalizeDificuldade(dificuldade);
  const session = useFlashcardSession(moduleName, selectedDifficulty);

  return (
    <View className="flex-1 bg-background">
      <Header showBackButton title="Flashcards" />

      <ScrollView contentContainerClassName="gap-lg px-lg pb-3xl pt-xl">
        <View className="items-end">
          <HelpButton compact />
        </View>

        <View className="rounded-3xl border border-border bg-surface-alt p-lg">
          <Text className="font-arial text-sm font-bold uppercase tracking-widest text-secondary">
            {moduleName}
          </Text>
          <Text className="mt-sm font-arial text-2xl font-bold text-primary">
            Sequência de revisão
          </Text>
          <Text className="mt-sm font-arial text-md leading-6 text-text">
            Cartão {Math.min(session.currentIndex + 1, session.total)} de {session.total} · Tempo{' '}
            {formatTime(session.elapsedSeconds)}
          </Text>
        </View>

        <View className="flex-row gap-md">
          <View className="flex-1 rounded-2xl bg-primary-light p-md">
            <Text className="font-arial text-sm font-bold text-primary">Acertos</Text>
            <Text className="mt-xs font-arial text-2xl font-bold text-text">{session.acertos}</Text>
          </View>
          <View className="flex-1 rounded-2xl bg-secondary-light p-md">
            <Text className="font-arial text-sm font-bold text-primary">Revisões</Text>
            <Text className="mt-xs font-arial text-2xl font-bold text-text">{session.erros}</Text>
          </View>
        </View>

        {session.isComplete && !session.feedback ? (
          <View className="gap-md rounded-3xl border border-border bg-card p-lg">
            <Text className="font-arial text-2xl font-bold text-primary">Sessão concluída</Text>
            <Text className="font-arial text-md leading-6 text-text">
              Seu progresso foi salvo com {session.acertos} acertos em{' '}
              {formatTime(session.elapsedSeconds)}.
            </Text>
            <BotaoReiniciar onPress={session.resetSession} />
            <BotaoSecundario label="Voltar para seleção" onPress={() => router.back()} />
          </View>
        ) : session.currentFlashcard ? (
          <>
            <FlashCard
              frente={session.currentFlashcard.frente}
              isFlipped={session.isFlipped}
              onFlip={() => session.setIsFlipped(!session.isFlipped)}
              tipo={session.currentFlashcard.tipo}
              verso={session.currentFlashcard.verso}
            />

            {session.currentFlashcard.formula_latex ? (
              <View className="rounded-2xl border border-border bg-card p-md">
                <Text className="font-arial text-sm font-bold text-primary">Fórmula em LaTeX</Text>
                <Text className="mt-xs font-arial text-sm leading-5 text-text-muted">
                  {session.currentFlashcard.formula_latex}
                </Text>
              </View>
            ) : null}

            <View className="gap-md">
              <BotaoPrimario label="Lembrei corretamente" onPress={() => session.answerCard(true)} />
              <BotaoSecundario label="Preciso revisar" onPress={() => session.answerCard(false)} />
              <BotaoReiniciar onPress={session.resetSession} />
            </View>
          </>
        ) : (
          <View className="rounded-3xl border border-border bg-card p-lg">
            <Text className="font-arial text-xl font-bold text-primary">
              Nenhum flashcard encontrado
            </Text>
            <Text className="mt-sm font-arial text-md leading-6 text-text-muted">
              Escolha outra dificuldade para continuar.
            </Text>
          </View>
        )}
      </ScrollView>

      <FeedbackModal
        actionLabel={session.isComplete ? 'Ver resultado' : 'Próximo cartão'}
        explanation={session.feedback?.explanation ?? ''}
        message={session.feedback?.message ?? ''}
        onClose={session.nextCard}
        title={session.feedback?.title ?? ''}
        type={session.feedback?.type ?? 'success'}
        visible={Boolean(session.feedback)}
      />
    </View>
  );
}
