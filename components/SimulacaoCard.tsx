import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/constants';
import type { TemaSimulacao } from '@/hooks/useSimulacoes';

interface SimulacaoCardProps {
  nome: string;
  tema: TemaSimulacao;
  descricao: string;
  onPress: () => void;
}

const temaLabels: Record<TemaSimulacao, string> = {
  eletromagnetismo: 'Eletromagnetismo',
  eletrostatica: 'Eletrostática',
  circuitos: 'Circuitos',
};

export default function SimulacaoCard({ nome, tema, descricao, onPress }: SimulacaoCardProps) {
  return (
    <Pressable
      accessibilityHint={`Abre detalhes da simulação ${nome}`}
      accessibilityLabel={nome}
      accessibilityRole="button"
      className="overflow-hidden rounded-3xl border"
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.primaryLight : colors.card,
        borderColor: pressed ? colors.primary : colors.border,
      })}>
      <View className="flex-row items-center gap-md bg-primary px-lg py-md">
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
          <FontAwesome name="flask" size={20} color={colors.textOnSecondary} />
        </View>
        <View className="flex-1">
          <Text className="font-arial text-xs font-bold uppercase tracking-widest text-secondary">
            {temaLabels[tema]}
          </Text>
          <Text
            className="mt-xs font-arial text-lg font-bold"
            numberOfLines={2}
            style={{ color: colors.textOnPrimary }}>
            {nome}
          </Text>
        </View>
      </View>

      <View className="p-lg">
        <Text className="font-arial text-sm leading-5 text-text-muted" numberOfLines={3}>
          {descricao}
        </Text>
      </View>
    </Pressable>
  );
}
