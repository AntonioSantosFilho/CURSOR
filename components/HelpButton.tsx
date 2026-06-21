import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Alert, Pressable, Text } from 'react-native';

import { colors } from '@/constants';

interface HelpButtonProps {
  compact?: boolean;
  label?: string;
  title?: string;
  instructions?: string;
}

const defaultInstructions =
  'Use a Home para acessar teoria, flashcards, questoes, memoria, simulacoes, progresso e Ajuda IA. Toque em um card para abrir a area desejada e acompanhe sua evolucao na aba Progresso.';

export default function HelpButton({
  compact = false,
  label = 'Ajuda',
  title = 'Como usar o FisicAI',
  instructions = defaultInstructions,
}: HelpButtonProps) {
  function handlePress() {
    Alert.alert(title, instructions);
  }

  return (
    <Pressable
      accessibilityHint="Mostra instrucoes basicas de uso do aplicativo"
      accessibilityLabel={label}
      accessibilityRole="button"
      className={`flex-row items-center justify-center rounded-full border ${
        compact ? 'h-11 w-11' : 'gap-2 px-4 py-3'
      }`}
      onPress={handlePress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.primaryPressed : colors.primary,
        borderColor: colors.primary,
        opacity: pressed ? 0.85 : 1,
      })}>
      <FontAwesome name="question-circle" size={compact ? 20 : 18} color={colors.textOnPrimary} />
      {!compact && (
        <Text className="font-arial font-bold" style={{ color: colors.textOnPrimary }}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
