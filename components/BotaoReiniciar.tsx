import BotaoSecundario from '@/components/BotaoSecundario';

interface BotaoReiniciarProps {
  onPress: () => void;
  label?: string;
}

export default function BotaoReiniciar({ onPress, label = 'Reiniciar' }: BotaoReiniciarProps) {
  return (
    <BotaoSecundario
      accessibilityHint="Reinicia a atividade atual do começo"
      label={label}
      onPress={onPress}
    />
  );
}
