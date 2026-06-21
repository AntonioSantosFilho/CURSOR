import { Modal, Pressable, Text, View } from 'react-native';

import BotaoPrimario from '@/components/BotaoPrimario';
import { colors } from '@/constants';

interface FeedbackModalProps {
  visible: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  explanation: string;
  onClose: () => void;
  actionLabel?: string;
}

export default function FeedbackModal({
  visible,
  type,
  title,
  message,
  explanation,
  onClose,
  actionLabel = 'Continuar',
}: FeedbackModalProps) {
  const accentColor = type === 'success' ? colors.success : colors.error;
  const surfaceColor = type === 'success' ? colors.successLight : colors.errorLight;

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-primary/20 px-lg">
        <Pressable className="absolute inset-0" onPress={onClose} />
        <View
          className="w-full rounded-3xl border p-lg"
          style={{ backgroundColor: colors.card, borderColor: accentColor }}>
          <View
            className="self-start rounded-full px-md py-xs"
            style={{ backgroundColor: accentColor }}>
            <Text className="font-arial text-xs font-bold" style={{ color: colors.textOnFeedback }}>
              {type === 'success' ? 'Acerto' : 'Dica de revisão'}
            </Text>
          </View>

          <Text className="mt-md font-arial text-2xl font-bold text-primary">{title}</Text>
          <Text className="mt-sm font-arial text-md leading-6 text-text">{message}</Text>

          <View className="mt-md rounded-2xl p-md" style={{ backgroundColor: surfaceColor }}>
            <Text className="font-arial text-sm font-bold text-primary">Explicação</Text>
            <Text className="mt-xs font-arial text-sm leading-5 text-text">{explanation}</Text>
          </View>

          <View className="mt-lg">
            <BotaoPrimario label={actionLabel} onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
