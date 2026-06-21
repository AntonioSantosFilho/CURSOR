import type FontAwesome from '@expo/vector-icons/FontAwesome';
import type { Href } from 'expo-router';
import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import { ScrollView, Text, View } from 'react-native';

import Header from '@/components/Header';
import HelpButton from '@/components/HelpButton';
import ModuloCard from '@/components/ModuloCard';
import { colors } from '@/constants';

interface HomeModule {
  id: string;
  title: string;
  description: string;
  iconName: ComponentProps<typeof FontAwesome>['name'];
  route: Href;
}

const homeModules: HomeModule[] = [
  {
    id: 'conteudos-teoricos',
    title: 'Teoria',
    description: 'Conceitos, fórmulas e exemplos guiados para revisar antes da prática.',
    iconName: 'book',
    route: './estudar?module=conteudos-teoricos',
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Cartões rápidos para memorizar definições, unidades e relações.',
    iconName: 'clone',
    route: '/jogos/flashcards' as Href,
  },
  {
    id: 'questoes',
    title: 'Quiz',
    description: 'Questões objetivas com feedback imediato e resultado final.',
    iconName: 'check-square-o',
    route: '/jogos/quiz' as Href,
  },
  {
    id: 'desafio',
    title: 'Desafio',
    description: 'Sequência de questões sem voltar, para testar domínio do conteúdo.',
    iconName: 'bolt',
    route: '/jogos/desafio/magnetismo?dificuldade=todas' as Href,
  },
  {
    id: 'lacunas',
    title: 'Lacunas',
    description: 'Complete frases e fórmulas com validação textual inteligente.',
    iconName: 'pencil',
    route: '/jogos/lacunas/magnetismo?dificuldade=todas' as Href,
  },
  {
    id: 'memoria',
    title: 'Memória',
    description: 'Jogo de associação entre conceitos físicos e suas definições.',
    iconName: 'gamepad',
    route: '/jogos/memoria' as Href,
  },
  {
    id: 'simulacoes-phet',
    title: 'Simulações',
    description: 'Experimentos PhET para explorar fenômenos físicos de forma visual.',
    iconName: 'rocket',
    route: '/estudar/phet' as Href,
  },
  {
    id: 'progresso',
    title: 'Progresso',
    description: 'Indicadores de acertos, tempo de estudo e evolução por área.',
    iconName: 'line-chart',
    route: './progresso',
  },
  {
    id: 'ajuda-ia',
    title: 'Ajuda IA',
    description: 'Assistente para dúvidas, explicações e revisão de respostas.',
    iconName: 'comments',
    route: './ia',
  },
];

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <Header title="FisicAI" />

      <ScrollView contentContainerClassName="px-lg pb-3xl pt-xl">
        <View className="mb-xl rounded-3xl border border-border bg-surface-alt p-lg">
          <View className="mb-md flex-row items-start justify-between gap-md">
            <View className="flex-1">
              <Text className="font-arial text-sm font-bold uppercase tracking-widest text-secondary">
                Física com identidade UNIVASF
              </Text>
              <Text className="mt-sm font-arial text-2xl font-bold leading-9 text-primary">
                Aprenda física com prática guiada
              </Text>
            </View>
            <HelpButton compact />
          </View>

          <Text className="font-arial text-md leading-6 text-text">
            Escolha um módulo para estudar conceitos, praticar exercícios, usar simulações e
            acompanhar sua evolução.
          </Text>
        </View>

        <View className="mb-lg flex-row items-center justify-between gap-md">
          <View className="flex-1">
            <Text className="font-arial text-xl font-bold text-primary">Módulos principais</Text>
            <Text className="mt-xs font-arial text-sm leading-5 text-text-muted">
              Acesso rápido aos conteúdos do FisicAI.
            </Text>
          </View>

          <View className="rounded-full bg-secondary px-md py-xs">
            <Text className="font-arial text-xs font-bold" style={{ color: colors.textOnSecondary }}>
              RNF01
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-md">
          {homeModules.map((module) => (
            <ModuloCard
              key={module.id}
              accessibilityHint={`Abre o módulo ${module.title}`}
              description={module.description}
              iconName={module.iconName}
              onPress={() => router.push(module.route)}
              title={module.title}
            />
          ))}
        </View>

        <View className="mt-xl">
          <HelpButton label="Como usar o FisicAI" />
        </View>
      </ScrollView>
    </View>
  );
}
