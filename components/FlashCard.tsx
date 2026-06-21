import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { colors, typography } from '@/constants';

interface FlashCardProps {
  frente: string;
  verso: string;
  tipo: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function FlashCard({ frente, verso, tipo, isFlipped, onFlip }: FlashCardProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFlipped ? 1 : 0,
      duration: 320,
      useNativeDriver: true,
    }).start();
  }, [animatedValue, isFlipped]);

  const frontRotation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <Pressable
      accessibilityHint="Vira o flashcard para mostrar frente ou verso"
      accessibilityLabel="Flashcard"
      accessibilityRole="button"
      className="min-h-[320px]"
      onPress={onFlip}>
      <Animated.View
        className="absolute inset-0 rounded-3xl border border-border bg-card p-xl"
        style={{
          backfaceVisibility: 'hidden',
          transform: [{ rotateY: frontRotation }],
        }}>
        <View className="self-start rounded-full bg-secondary px-md py-xs">
          <Text className="font-arial text-xs font-bold" style={{ color: colors.textOnSecondary }}>
            {tipo}
          </Text>
        </View>
        <View className="flex-1 justify-center">
          <Text
            className="text-center font-arial font-bold text-primary"
            style={{ fontSize: typography.sizes.xl }}>
            {frente}
          </Text>
        </View>
        <Text className="text-center font-arial text-sm text-text-muted">
          Toque para ver a resposta
        </Text>
      </Animated.View>

      <Animated.View
        className="absolute inset-0 rounded-3xl border p-xl"
        style={{
          backfaceVisibility: 'hidden',
          backgroundColor: colors.primaryLight,
          borderColor: colors.primary,
          transform: [{ rotateY: backRotation }],
        }}>
        <View className="self-start rounded-full bg-secondary px-md py-xs">
          <Text className="font-arial text-xs font-bold" style={{ color: colors.textOnSecondary }}>
            resposta
          </Text>
        </View>
        <View className="flex-1 justify-center">
          <Text className="text-center font-arial text-md leading-6 text-text">{verso}</Text>
        </View>
        <Text className="text-center font-arial text-sm text-text-muted">
          Toque para voltar à pergunta
        </Text>
      </Animated.View>
    </Pressable>
  );
}
