import { router, useLocalSearchParams, type Href } from 'expo-router';
import { ScrollView, Text, TextInput, View } from 'react-native';

import BotaoPrimario from '@/components/BotaoPrimario';
import BotaoReiniciar from '@/components/BotaoReiniciar';
import EnunciadoCard from '@/components/EnunciadoCard';
import FeedbackModal from '@/components/FeedbackModal';
import Header from '@/components/Header';
import HelpButton from '@/components/HelpButton';
import ResultadoSessao from '@/components/ResultadoSessao';
import { colors } from '@/constants';
import type { DificuldadeJogo } from '@/hooks/useFlashcardSession';
import { type DificuldadeFiltro } from '@/hooks/useQuizSession';
import { getLacunasModules, useLacunasSession } from '@/hooks/useLacunasSession';

function normalizeDificuldade(value?: string): DificuldadeFiltro {
  if (value === 'facil' || value === 'medio' || value === 'dificil' || value === 'todas') {
    return value;
  }

  return 'todas';
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function LacunasSessionScreen() {
  const { modulo, dificuldade } = useLocalSearchParams<{ modulo?: string; dificuldade?: string }>();
  const moduloId = modulo ?? 'magnetismo';
  const selectedDifficulty = normalizeDificuldade(dificuldade);
  const session = useLacunasSession(moduloId, selectedDifficulty);
  const moduloInfo = getLacunasModules().find((item) => item.id === moduloId);

  return (
    <View className="flex-1 bg-background">
      <Header showBackButton title="Lacunas" />

      <ScrollView contentContainerClassName="gap-lg px-lg pb-3xl pt-xl">
        <View className="items-end">
          <HelpButton compact />
        </View>

        <View className="rounded-3xl border border-border bg-surface-alt p-lg">
          <Text className="font-arial text-sm font-bold uppercase tracking-widest text-secondary">
            {moduloInfo?.titulo ?? moduloId}
          </Text>
          <Text className="mt-sm font-arial text-2xl font-bold text-primary">
            Complete as lacunas
          </Text>
          <Text className="mt-sm font-arial text-md leading-6 text-text">
            Item {Math.min(session.currentIndex + 1, session.total)} de {session.total} · Tempo{' '}
            {formatTime(session.elapsedSeconds)}
          </Text>
        </View>

        {session.isComplete && !session.feedback ? (
          <ResultadoSessao
            acertos={session.acertos}
            erros={session.erros}
            onContinuar={() => router.push('/(tabs)/estudar' as Href)}
            onReiniciar={session.resetSession}
            tempoGastoSegundos={session.elapsedSeconds}
            titulo="Lacunas concluídas"
            total={session.total}
          />
        ) : session.currentLacuna ? (
          <>
            <EnunciadoCard
              dificuldade={session.currentLacuna.dificuldade as DificuldadeJogo}
              enunciado={session.currentLacuna.frase}
              progresso={`${session.acertos} acertos · ${session.erros} erros`}
              tipo="Completar lacuna"
              titulo="Frase"
            />

            <View className="rounded-3xl border border-border bg-card p-lg">
              <Text className="font-arial text-sm font-bold text-primary">Sua resposta</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                className="mt-sm min-h-12 rounded-2xl border border-border bg-surface px-md font-arial text-md text-text"
                onChangeText={session.setRespostaDigitada}
                placeholder="Digite o termo que completa a frase"
                placeholderTextColor={colors.textMuted}
                value={session.respostaDigitada}
              />
            </View>

            <View className="gap-md">
              <BotaoPrimario
                disabled={!session.respostaDigitada.trim()}
                label="Validar resposta"
                onPress={session.submitAnswer}
              />
              <BotaoReiniciar onPress={session.resetSession} />
            </View>
          </>
        ) : (
          <View className="rounded-3xl border border-border bg-card p-lg">
            <Text className="font-arial text-xl font-bold text-primary">
              Nenhuma lacuna encontrada
            </Text>
            <Text className="mt-sm font-arial text-md leading-6 text-text-muted">
              Use outro módulo ou dificuldade para continuar.
            </Text>
          </View>
        )}
      </ScrollView>

      <FeedbackModal
        actionLabel={session.isComplete ? 'Ver resultado' : 'Próxima lacuna'}
        explanation={session.feedback?.explanation ?? ''}
        message={session.feedback?.message ?? ''}
        onClose={session.nextLacuna}
        title={session.feedback?.title ?? ''}
        type={session.feedback?.type ?? 'success'}
        visible={Boolean(session.feedback)}
      />
    </View>
  );
}
