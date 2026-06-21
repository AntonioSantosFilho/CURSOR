import type { MensagemIA } from '@/types';

declare const process: {
  env: {
    EXPO_PUBLIC_GEMINI_API_KEY?: string;
    EXPO_PUBLIC_GEMINI_MODEL?: string;
  };
};

const SYSTEM_PROMPT =
  'Você é um professor de física para alunos do ensino médio. Responda em português, de forma didática e objetiva.';
const DEFAULT_MODEL = 'gemini-2.5-flash-lite';
const REQUEST_TIMEOUT_MS = 20000;

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

function adaptarHistoricoParaGemini(historico: MensagemIA[]) {
  const primeiraMensagemUsuario = historico.findIndex((mensagem) => mensagem.papel === 'usuario');

  if (primeiraMensagemUsuario === -1) {
    return [];
  }

  return historico
    .slice(primeiraMensagemUsuario)
    .filter((mensagem) => mensagem.papel === 'usuario' || mensagem.papel === 'assistente')
    .map((mensagem) => ({
      role: mensagem.papel === 'usuario' ? 'user' : 'model',
      parts: [{ text: mensagem.conteudo }],
    }));
}

function mensagemErro(status?: number) {
  if (status === 400) {
    return 'Não consegui entender a solicitação enviada ao modelo. Tente reformular sua pergunta.';
  }

  if (status === 401 || status === 403) {
    return 'A chave da IA não está autorizada. Verifique a configuração da API antes de continuar.';
  }

  if (status === 429) {
    return 'O limite de uso da IA foi atingido no momento. Aguarde um pouco e tente novamente.';
  }

  if (status === 404) {
    return 'O modelo de IA configurado não está disponível. Verifique EXPO_PUBLIC_GEMINI_MODEL no arquivo .env.';
  }

  if (status && status >= 500) {
    return 'O modelo de IA está temporariamente indisponível. Tente novamente em instantes.';
  }

  return 'Não foi possível conectar à IA agora. Verifique sua internet e tente novamente.';
}

export async function gerarRespostaGemini(historico: MensagemIA[]) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const model = process.env.EXPO_PUBLIC_GEMINI_MODEL ?? DEFAULT_MODEL;

  if (!apiKey) {
    return 'A IA ainda não foi configurada. Defina EXPO_PUBLIC_GEMINI_API_KEY para ativar o assistente.';
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: adaptarHistoricoParaGemini(historico),
        }),
      }
    );

    if (!response.ok) {
      return mensagemErro(response.status);
    }

    const data = (await response.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join('\n')
      .trim();

    return text || 'A IA respondeu sem texto. Tente perguntar de outro jeito.';
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return 'A resposta demorou mais que o esperado. Tente novamente com uma pergunta mais curta.';
    }

    return mensagemErro();
  } finally {
    clearTimeout(timeout);
  }
}
