import { Text, View } from 'react-native';

import { colors } from '@/constants';
import type { MensagemIA } from '@/types';

interface BubbleChatProps {
  mensagem: MensagemIA;
}

export default function BubbleChat({ mensagem }: BubbleChatProps) {
  const isUser = mensagem.papel === 'usuario';

  return (
    <View className={`max-w-[84%] ${isUser ? 'self-end' : 'self-start'}`}>
      <View
        className={`rounded-3xl border px-lg py-md ${
          isUser ? 'bg-primary' : 'border-border bg-surface'
        }`}
        style={{ borderColor: isUser ? colors.primary : colors.border }}>
        <Text
          className="font-arial text-md leading-6"
          style={{ color: isUser ? colors.textInverse : colors.text }}>
          {mensagem.conteudo}
        </Text>
      </View>
    </View>
  );
}
