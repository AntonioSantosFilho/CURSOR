import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import BadgeDificuldade from '@/components/BadgeDificuldade';
import BotaoSecundario from '@/components/BotaoSecundario';
import ExercicioResolvido from '@/components/ExercicioResolvido';
import FormulaBox from '@/components/FormulaBox';
import Header from '@/components/Header';
import { colors } from '@/constants';
import { useConteudoTeorico } from '@/hooks/useConteudoTeorico';

export default function TheoryContentScreen() {
  const { modulo } = useLocalSearchParams<{ modulo?: string }>();
  const { getConteudoById } = useConteudoTeorico();
  const conteudo = modulo ? getConteudoById(modulo) : undefined;

  if (!conteudo) {
    return (
      <View className="flex-1 bg-background">
        <Header showBackButton title="Conteúdo" />
        <View className="flex-1 justify-center px-lg">
          <Text className="text-center font-arial text-xl font-bold text-primary">
            Conteúdo não encontrado
          </Text>
          <Text className="mt-sm text-center font-arial text-md leading-6 text-text-muted">
            Volte para a lista de estudos e escolha outro tópico.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Header showBackButton title="Conteúdo" />

      <ScrollView contentContainerClassName="gap-lg px-lg pb-3xl pt-xl">
        <View className="rounded-3xl border border-border bg-card p-lg">
          <Text className="font-arial text-sm font-bold uppercase tracking-widest text-secondary">
            {conteudo.tema}
          </Text>
          <Text className="mt-sm font-arial text-2xl font-bold text-primary">
            {conteudo.topico}
          </Text>
          <View className="mt-md">
            <BadgeDificuldade dificuldade={conteudo.dificuldade} />
          </View>
          <Text className="mt-md font-arial text-md leading-6 text-text">
            {conteudo.conceito}
          </Text>
        </View>

        <FormulaBox
          formulaLatex={conteudo.formula_latex}
          formulaLegivel={conteudo.formula_legivel}
          notaPedagogica={conteudo.nota_pedagogica}
        />

        <View className="rounded-3xl border border-border bg-card p-lg">
          <Text className="font-arial text-xl font-bold text-primary">Variáveis</Text>
          <View className="mt-md gap-sm">
            {conteudo.variaveis.map((variavel) => (
              <View
                key={`${variavel.simbolo}-${variavel.significado}`}
                className="rounded-2xl bg-primary-light p-md">
                <Text className="font-arial text-lg font-bold text-primary">
                  {variavel.simbolo}
                </Text>
                <Text className="mt-xs font-arial text-sm leading-5 text-text">
                  {variavel.significado}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <ExercicioResolvido exercicio={conteudo.exercicio_resolvido} />

        <View className="rounded-3xl border border-border bg-card p-lg">
          <Text className="font-arial text-sm font-bold text-primary">Fonte</Text>
          <Text className="mt-xs font-arial text-sm leading-5 text-text-muted">
            {conteudo.fonte}
          </Text>
          <Text className="mt-sm font-arial text-xs leading-5 text-text-muted">
            Fonte externa necessária: {conteudo.fonte_externa_necessaria ? 'sim' : 'não'}
          </Text>
        </View>

        <BotaoSecundario label="Voltar para conteúdos" onPress={() => router.back()} />
      </ScrollView>
    </View>
  );
}
