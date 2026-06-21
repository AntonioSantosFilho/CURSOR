import { Text, View } from 'react-native';

import BotaoPrimario from '@/components/BotaoPrimario';
import BotaoReiniciar from '@/components/BotaoReiniciar';
import { colors } from '@/constants';

interface ResultadoSessaoProps {
  titulo: string;
  acertos: number;
  erros: number;
  tempoGastoSegundos: number;
  total: number;
  onContinuar: () => void;
  onReiniciar?: () => void;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function ResultadoSessao({
  titulo,
  acertos,
  erros,
  tempoGastoSegundos,
  total,
  onContinuar,
  onReiniciar,
}: ResultadoSessaoProps) {
  const pontuacao = total > 0 ? Math.round((acertos / total) * 100) : 0;

  return (
    <View className="gap-lg rounded-3xl border border-border bg-card p-lg">
      <View className="rounded-3xl bg-secondary p-lg">
        <Text
          className="text-center font-arial text-sm font-bold uppercase tracking-widest"
          style={{ color: colors.textOnSecondary }}>
          Resultado final
        </Text>
        <Text
          className="mt-sm text-center font-arial text-2xl font-bold"
          style={{ color: colors.textOnSecondary }}>
          {pontuacao} pontos
        </Text>
      </View>

      <View>
        <Text className="font-arial text-xl font-bold text-primary">{titulo}</Text>
        <Text className="mt-sm font-arial text-md leading-6 text-text-muted">
          Você concluiu a sessão com {acertos} acertos, {erros} erros e tempo total de{' '}
          {formatTime(tempoGastoSegundos)}.
        </Text>
      </View>

      <View className="flex-row gap-md">
        <View className="flex-1 rounded-2xl bg-primary-light p-md">
          <Text className="font-arial text-sm font-bold text-primary">Acertos</Text>
          <Text className="mt-xs font-arial text-2xl font-bold text-text">{acertos}</Text>
        </View>
        <View className="flex-1 rounded-2xl bg-secondary-light p-md">
          <Text className="font-arial text-sm font-bold text-primary">Erros</Text>
          <Text className="mt-xs font-arial text-2xl font-bold text-text">{erros}</Text>
        </View>
      </View>

      <BotaoPrimario label="Continuar" onPress={onContinuar} />
      {onReiniciar ? <BotaoReiniciar label="Reiniciar sessão" onPress={onReiniciar} /> : null}
    </View>
  );
}
