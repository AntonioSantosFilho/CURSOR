import { Pressable, Text, View } from 'react-native';

import { colors } from '@/constants';

export type AlternativaEstado = 'neutro' | 'correto' | 'incorreto';

interface AlternativaButtonProps {
  letra: string;
  texto: string;
  estado?: AlternativaEstado;
  disabled?: boolean;
  onPress: () => void;
}

export default function AlternativaButton({
  letra,
  texto,
  estado = 'neutro',
  disabled = false,
  onPress,
}: AlternativaButtonProps) {
  const backgroundColor =
    estado === 'correto' ? colors.success : estado === 'incorreto' ? colors.error : colors.surface;
  const borderColor =
    estado === 'correto' ? colors.success : estado === 'incorreto' ? colors.error : colors.border;

  return (
    <Pressable
      accessibilityHint={`Seleciona alternativa ${letra}`}
      accessibilityLabel={`Alternativa ${letra}: ${texto}`}
      accessibilityRole="button"
      className="rounded-2xl border p-md"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed && estado === 'neutro' ? colors.primaryLight : backgroundColor,
        borderColor,
        opacity: disabled && estado === 'neutro' ? 0.72 : 1,
      })}>
      <View className="flex-row items-start gap-md">
        <View className="h-9 w-9 items-center justify-center rounded-full bg-secondary">
          <Text className="font-arial text-sm font-bold" style={{ color: colors.textOnSecondary }}>
            {letra}
          </Text>
        </View>
        <Text className="flex-1 font-arial text-md leading-6 text-text">{texto}</Text>
      </View>
    </Pressable>
  );
}
