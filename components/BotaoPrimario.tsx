import { ActivityIndicator, Pressable, Text } from 'react-native';

import { colors } from '@/constants';

interface BotaoPrimarioProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  accessibilityHint?: string;
}

export default function BotaoPrimario({
  label,
  onPress,
  disabled = false,
  loading = false,
  accessibilityHint,
}: BotaoPrimarioProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={label}
      accessibilityRole="button"
      className="min-h-12 flex-row items-center justify-center rounded-2xl px-lg py-md"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: isDisabled
          ? colors.primaryDisabled
          : pressed
            ? colors.primaryPressed
            : colors.primary,
        opacity: isDisabled ? 0.9 : 1,
      })}>
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Text
          className="font-arial text-md font-bold"
          style={{ color: isDisabled ? colors.primary : colors.textOnPrimary }}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
