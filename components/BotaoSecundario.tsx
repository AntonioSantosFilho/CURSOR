import { Pressable, Text } from 'react-native';

import { colors } from '@/constants';

interface BotaoSecundarioProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityHint?: string;
}

export default function BotaoSecundario({
  label,
  onPress,
  disabled = false,
  accessibilityHint,
}: BotaoSecundarioProps) {
  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={label}
      accessibilityRole="button"
      className="min-h-12 items-center justify-center rounded-2xl border px-lg py-md"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.secondaryLight : colors.primaryLight,
        borderColor: colors.primary,
        opacity: disabled ? 0.55 : 1,
      })}>
      <Text className="font-arial text-md font-bold" style={{ color: colors.primary }}>
        {label}
      </Text>
    </Pressable>
  );
}
