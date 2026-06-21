import { Text, View } from 'react-native';

import { colors } from '@/constants';

export type Dificuldade = 'facil' | 'medio' | 'dificil' | 'basico' | 'intermediario' | 'avancado';

interface BadgeDificuldadeProps {
  dificuldade: Dificuldade;
}

const badgeStyles: Record<Dificuldade, { label: string; backgroundColor: string; borderColor: string }> = {
  facil: {
    label: 'Fácil',
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  medio: {
    label: 'Médio',
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  dificil: {
    label: 'Difícil',
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  basico: {
    label: 'Fácil',
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  intermediario: {
    label: 'Médio',
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  avancado: {
    label: 'Difícil',
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
};

export default function BadgeDificuldade({ dificuldade }: BadgeDificuldadeProps) {
  const style = badgeStyles[dificuldade];

  return (
    <View
      className="self-start rounded-full border px-md py-xs"
      style={{ backgroundColor: style.backgroundColor, borderColor: style.borderColor }}>
      <Text className="font-arial text-xs font-bold" style={{ color: colors.textOnFeedback }}>
        {style.label}
      </Text>
    </View>
  );
}
