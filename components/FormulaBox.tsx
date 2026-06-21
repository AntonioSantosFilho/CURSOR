import { Text, View } from 'react-native';

import { colors, typography } from '@/constants';

interface FormulaBoxProps {
  formulaLegivel: string;
  formulaLatex?: string;
  notaPedagogica: string;
}

export default function FormulaBox({
  formulaLegivel,
  formulaLatex,
  notaPedagogica,
}: FormulaBoxProps) {
  return (
    <View
      className="rounded-3xl border p-lg"
      style={{ backgroundColor: colors.primaryLight, borderColor: colors.primary }}>
      <Text className="font-arial text-sm font-bold uppercase tracking-widest text-secondary">
        Fórmula
      </Text>
      <Text
        className="mt-sm rounded-2xl bg-secondary px-md py-md text-center font-arial font-bold"
        style={{ color: colors.textOnSecondary, fontSize: typography.sizes.xl }}>
        {formulaLegivel}
      </Text>

      {formulaLatex ? (
        <Text className="mt-sm font-arial text-xs leading-5 text-text-muted">
          LaTeX: {formulaLatex}
        </Text>
      ) : null}

      <View className="mt-md rounded-2xl border border-border bg-card p-md">
        <Text className="font-arial text-sm font-bold text-primary">Nota pedagógica</Text>
        <Text className="mt-xs font-arial text-sm leading-5 text-text">
          {notaPedagogica}
        </Text>
      </View>
    </View>
  );
}
