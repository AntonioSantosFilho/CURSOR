import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';

import BotaoPrimario from '@/components/BotaoPrimario';
import BubbleChat from '@/components/BubbleChat';
import Header from '@/components/Header';
import HelpButton from '@/components/HelpButton';
import { colors } from '@/constants';
import { useChat } from '@/hooks/useChat';

export default function AiHelpScreen() {
  const [input, setInput] = useState('');
  const chat = useChat();

  function handleSend() {
    const text = input.trim();

    if (!text) {
      return;
    }

    setInput('');
    void chat.enviarMensagem(text);
  }

  return (
    <View className="flex-1 bg-background">
      <Header title="Ajuda IA" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView contentContainerClassName="gap-md px-lg pb-xl pt-xl">
          <View className="mb-sm flex-row items-start justify-between gap-md">
            <View className="flex-1">
              <Text className="font-arial text-sm font-bold uppercase tracking-widest text-secondary">
                Assistente
              </Text>
              <Text className="mt-sm font-arial text-2xl font-bold text-primary">
                Tire dúvidas de física
              </Text>
              <Text className="mt-sm font-arial text-md leading-6 text-text">
                O histórico é mantido apenas nesta sessão.
              </Text>
            </View>
            <HelpButton compact />
          </View>

          {chat.mensagens.map((mensagem) => (
            <BubbleChat key={mensagem.id} mensagem={mensagem} />
          ))}

          {chat.isTyping ? (
            <Text className="font-arial text-sm font-bold text-primary">digitando...</Text>
          ) : null}
        </ScrollView>

        <View className="gap-md border-t border-border bg-surface px-lg py-md">
          <TextInput
            className="min-h-12 rounded-2xl border border-border bg-surface-alt px-md font-arial text-md text-text"
            multiline
            onChangeText={setInput}
            placeholder="Digite sua dúvida de física"
            placeholderTextColor={colors.textMuted}
            value={input}
          />
          <BotaoPrimario
            disabled={!input.trim() || !chat.podeEnviar}
            label={chat.isTyping ? 'Aguardando resposta' : 'Enviar'}
            onPress={handleSend}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
