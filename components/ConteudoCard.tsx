import { Pressable, Text, View } from 'react-native';

import BadgeDificuldade from '@/components/BadgeDificuldade';
import { colors } from '@/constants';
import type { DificuldadeConteudo } from '@/hooks/useConteudoTeorico';

interface ConteudoCardProps {
  tema: string;
  topico: string;
  conceito: string;
  dificuldade: DificuldadeConteudo;
  onPress: () => void;
}

export default function ConteudoCard({
  tema,
  topico,
  conceito,
  dificuldade,
  onPress,
}: ConteudoCardProps) {
  return (
    <Pressable
      accessibilityHint={`Abre o conteúdo ${topico}`}
      accessibilityLabel={topico}
      accessibilityRole="button"
      className="overflow-hidden rounded-3xl border"
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.primaryLight : colors.card,
        borderColor: pressed ? colors.primary : colors.border,
      })}>
      <View className="bg-primary px-lg py-md">
        <Text className="font-arial text-xs font-bold uppercase tracking-widest text-secondary">
          {tema}
        </Text>
        <Text
          className="mt-xs font-arial text-lg font-bold"
          numberOfLines={2}
          style={{ color: colors.textOnPrimary }}>
          {topico}
        </Text>
      </View>

      <View className="gap-md p-lg">
        <BadgeDificuldade dificuldade={dificuldade} />
        <Text className="font-arial text-sm leading-5 text-text-muted" numberOfLines={3}>
          {conceito}
        </Text>
      </View>
    </Pressable>
  );
}
