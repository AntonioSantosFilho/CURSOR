import { Pressable, Text, View } from 'react-native';

import { colors, typography } from '@/constants';
import type { TipoConteudoCarta } from '@/hooks/useMemoriaGame';

interface CartaMemoriaProps {
  conteudo: string;
  tipoConteudo: TipoConteudoCarta;
  isRevealed: boolean;
  isMatched: boolean;
  isMismatch: boolean;
  onPress: () => void;
}

export default function CartaMemoria({
  conteudo,
  tipoConteudo,
  isRevealed,
  isMatched,
  isMismatch,
  onPress,
}: CartaMemoriaProps) {
  const backgroundColor = isMatched
    ? colors.success
    : isMismatch
      ? colors.error
      : isRevealed
        ? colors.primaryLight
        : colors.secondary;
  const borderColor = isMatched
    ? colors.success
    : isMismatch
      ? colors.error
      : isRevealed
        ? colors.primary
        : colors.secondaryPressed;

  return (
    <Pressable
      accessibilityHint="Vira uma carta do jogo da memória"
      accessibilityLabel={isRevealed ? conteudo : 'Carta virada'}
      accessibilityRole="button"
      className="min-h-[118px] flex-1 basis-[45%] rounded-3xl border p-md"
      disabled={isMatched}
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor,
        borderColor,
        opacity: pressed ? 0.82 : 1,
      })}>
      {isRevealed || isMatched || isMismatch ? (
        <View className="flex-1 justify-center">
          <Text
            className="text-center font-arial font-bold"
            style={{
              color: colors.textOnFeedback,
              fontSize: tipoConteudo === 'formula' ? typography.sizes.lg : typography.sizes.sm,
            }}>
            {conteudo}
          </Text>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="font-arial text-2xl font-bold" style={{ color: colors.textOnSecondary }}>
            ?
          </Text>
          <Text className="mt-xs text-center font-arial text-xs font-bold text-text">
            Toque para revelar
          </Text>
        </View>
      )}
    </Pressable>
  );
}
