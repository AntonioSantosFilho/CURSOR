import { Text, View } from 'react-native';

import BadgeDificuldade from '@/components/BadgeDificuldade';
import { colors, typography } from '@/constants';
import type { DificuldadeJogo } from '@/hooks/useFlashcardSession';

interface EnunciadoCardProps {
  titulo: string;
  enunciado: string;
  dificuldade?: DificuldadeJogo;
  tipo?: string;
  progresso?: string;
}

export default function EnunciadoCard({
  titulo,
  enunciado,
  dificuldade,
  tipo,
  progresso,
}: EnunciadoCardProps) {
  return (
    <View className="rounded-3xl border border-border bg-card p-lg">
      <View className="mb-md flex-row items-center justify-between gap-md">
        <View className="flex-1">
          <Text className="font-arial text-sm font-bold uppercase tracking-widest text-secondary">
            {titulo}
          </Text>
          {progresso ? (
            <Text className="mt-xs font-arial text-sm text-text-muted">{progresso}</Text>
          ) : null}
        </View>
        {dificuldade ? <BadgeDificuldade dificuldade={dificuldade} /> : null}
      </View>

      {tipo ? (
        <View className="mb-md self-start rounded-full bg-primary-light px-md py-xs">
          <Text className="font-arial text-xs font-bold text-primary">{tipo}</Text>
        </View>
      ) : null}

      <Text
        className="font-arial font-bold leading-8 text-primary"
        style={{ fontSize: typography.sizes.lg }}>
        {enunciado}
      </Text>
    </View>
  );
}
