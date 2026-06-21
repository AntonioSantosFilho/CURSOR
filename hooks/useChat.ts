import { useMemo, useState } from 'react';

import { gerarRespostaGemini } from '@/services/iaService';
import type { MensagemIA } from '@/types';

function criarMensagem(papel: MensagemIA['papel'], conteudo: string): MensagemIA {
  return {
    id: `${papel}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    papel,
    conteudo,
    criadaEm: new Date().toISOString(),
    status: 'enviada',
  };
}

export function useChat() {
  const [mensagens, setMensagens] = useState<MensagemIA[]>([
    criarMensagem(
      'assistente',
      'Olá! Sou o assistente do FisicAI. Envie sua dúvida de física para eu explicar de forma objetiva.'
    ),
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const podeEnviar = useMemo(() => !isTyping, [isTyping]);

  async function enviarMensagem(conteudo: string) {
    const texto = conteudo.trim();

    if (!texto || isTyping) {
      return;
    }

    const mensagemUsuario = criarMensagem('usuario', texto);
    const historicoAtualizado = [...mensagens, mensagemUsuario];
    setMensagens(historicoAtualizado);
    setIsTyping(true);

    const resposta = await gerarRespostaGemini(historicoAtualizado);
    setMensagens((atuais) => [...atuais, criarMensagem('assistente', resposta)]);
    setIsTyping(false);
  }

  return {
    mensagens,
    isTyping,
    podeEnviar,
    enviarMensagem,
  };
}
