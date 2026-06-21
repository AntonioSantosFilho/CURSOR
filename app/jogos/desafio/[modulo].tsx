import { router, useLocalSearchParams, type Href } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import AlternativaButton, { type AlternativaEstado } from '@/components/AlternativaButton';
import BotaoReiniciar from '@/components/BotaoReiniciar';
import EnunciadoCard from '@/components/EnunciadoCard';
import FeedbackModal from '@/components/FeedbackModal';
import Header from '@/components/Header';
import HelpButton from '@/components/HelpButton';
import ResultadoSessao from '@/components/ResultadoSessao';
import type { DificuldadeJogo } from '@/hooks/useFlashcardSession';
import { type DificuldadeFiltro, useQuizSession } from '@/hooks/useQuizSession';

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

function getAlternativaEstado(
  letra: string,
  selectedAnswer: string | null,
  respostaCorreta?: string
): AlternativaEstado {
  if (!selectedAnswer || !respostaCorreta) {
    return 'neutro';
  }

  if (letra === respostaCorreta) {
    return 'correto';
  }

  if (letra === selectedAnswer) {
    return 'incorreto';
  }

  return 'neutro';
}

export default function ChallengeSessionScreen() {
  const { modulo, dificuldade } = useLocalSearchParams<{ modulo?: string; dificuldade?: string }>();
  const moduloId = modulo ?? 'magnetismo';
  const selectedDifficulty = normalizeDificuldade(dificuldade);
  const session = useQuizSession(moduloId, selectedDifficulty, 'desafio');

  return (
    <View className="flex-1 bg-background">
      <Header title="Desafio" />

      <ScrollView contentContainerClassName="gap-lg px-lg pb-3xl pt-xl">
        <View className="items-end">
          <HelpButton compact />
        </View>

        <View className="rounded-3xl border border-border bg-surface-alt p-lg">
          <Text className="font-arial text-sm font-bold uppercase tracking-widest text-secondary">
            {session.modulo?.titulo ?? moduloId}
          </Text>
          <Text className="mt-sm font-arial text-2xl font-bold text-primary">
            Desafio sequencial
          </Text>
          <Text className="mt-sm font-arial text-md leading-6 text-text">
            Avance questão por questão, sem voltar · Tempo {formatTime(session.elapsedSeconds)}
          </Text>
        </View>

        {session.isComplete && !session.feedback ? (
          <ResultadoSessao
            acertos={session.acertos}
            erros={session.erros}
            onContinuar={() => router.push('/jogos/quiz' as Href)}
            onReiniciar={session.resetSession}
            tempoGastoSegundos={session.elapsedSeconds}
            titulo="Desafio concluído"
            total={session.total}
          />
        ) : session.currentQuestion ? (
          <>
            <EnunciadoCard
              dificuldade={session.currentQuestion.dificuldade as DificuldadeJogo}
              enunciado={session.currentQuestion.enunciado}
              progresso={`${Math.min(session.currentIndex + 1, session.total)} de ${session.total}`}
              tipo={session.currentQuestion.tipo === 'calculo' ? 'Cálculo' : 'Múltipla escolha'}
              titulo="Desafio"
            />

            <View className="gap-md">
              {session.currentQuestion.alternativas.map((alternativa) => (
                <AlternativaButton
                  key={alternativa.letra}
                  disabled={Boolean(session.selectedAnswer)}
                  estado={getAlternativaEstado(
                    alternativa.letra,
                    session.selectedAnswer,
                    session.currentQuestion?.resposta_correta
                  )}
                  letra={alternativa.letra}
                  onPress={() => session.answerQuestion(alternativa.letra)}
                  texto={alternativa.texto}
                />
              ))}
            </View>

            <BotaoReiniciar onPress={session.resetSession} />
          </>
        ) : (
          <View className="rounded-3xl border border-border bg-card p-lg">
            <Text className="font-arial text-xl font-bold text-primary">
              Nenhuma questão encontrada
            </Text>
            <Text className="mt-sm font-arial text-md leading-6 text-text-muted">
              Volte para o quiz e escolha outra dificuldade.
            </Text>
          </View>
        )}
      </ScrollView>

      <FeedbackModal
        actionLabel={session.isComplete ? 'Ver resultado' : 'Continuar desafio'}
        explanation={session.feedback?.explanation ?? ''}
        message={session.feedback?.message ?? ''}
        onClose={session.nextQuestion}
        title={session.feedback?.title ?? ''}
        type={session.feedback?.type ?? 'success'}
        visible={Boolean(session.feedback)}
      />
    </View>
  );
}
