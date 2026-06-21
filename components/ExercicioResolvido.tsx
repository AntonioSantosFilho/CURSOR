import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors, typography } from '@/constants';
import type { ExercicioResolvidoData } from '@/hooks/useConteudoTeorico';

interface ExercicioResolvidoProps {
  exercicio: ExercicioResolvidoData;
}

export default function ExercicioResolvido({ exercicio }: ExercicioResolvidoProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="overflow-hidden rounded-3xl border border-border bg-card">
      <Pressable
        accessibilityHint="Expande ou recolhe o exercício resolvido"
        accessibilityLabel="Exercício resolvido"
        accessibilityRole="button"
        className="bg-secondary px-lg py-md"
        onPress={() => setExpanded((current) => !current)}>
        <Text
          className="font-arial font-bold"
          style={{ color: colors.textOnSecondary, fontSize: typography.sizes.lg }}>
          Exercício resolvido {expanded ? '▲' : '▼'}
        </Text>
      </Pressable>

      <View className="gap-md p-lg">
        <View>
          <Text className="font-arial text-sm font-bold text-primary">Enunciado</Text>
          <Text className="mt-xs font-arial text-sm leading-5 text-text">
            {exercicio.enunciado}
          </Text>
        </View>

        {expanded && (
          <>
            <View>
              <Text className="font-arial text-sm font-bold text-primary">Passo a passo</Text>
              <Text className="mt-xs font-arial text-sm leading-5 text-text">
                {exercicio.passo_a_passo}
              </Text>
            </View>

            <View className="rounded-2xl bg-primary-light p-md">
              <Text className="font-arial text-sm font-bold text-primary">Resolução</Text>
              <Text className="mt-xs font-arial text-sm leading-5 text-text">
                {exercicio.resolucao_legivel}
              </Text>
              <Text className="mt-xs font-arial text-xs leading-5 text-text-muted">
                LaTeX: {exercicio.resolucao_latex}
              </Text>
            </View>

            <View className="rounded-2xl bg-secondary p-md">
              <Text
                className="font-arial text-sm font-bold"
                style={{ color: colors.textOnSecondary }}>
                Resposta final
              </Text>
              <Text
                className="mt-xs font-arial text-lg font-bold"
                style={{ color: colors.textOnSecondary }}>
                {exercicio.resposta_final}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
