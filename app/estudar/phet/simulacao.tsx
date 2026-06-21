import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { colors } from '@/constants';

export default function PhetSimulationScreen() {
  const { url, title } = useLocalSearchParams<{ url?: string; title?: string }>();
  const [hasError, setHasError] = useState(false);
  const simulationUrl = Array.isArray(url) ? url[0] : url;
  const simulationTitle = Array.isArray(title) ? title[0] : title;

  return (
    <View className="flex-1 bg-background">
      <View className="absolute left-lg right-lg top-lg z-10 flex-row items-center gap-sm">
        <Pressable
          accessibilityLabel="Voltar"
          accessibilityRole="button"
          className="h-12 w-12 items-center justify-center rounded-full border"
          onPress={() => router.back()}
          style={({ pressed }) => ({
            backgroundColor: pressed ? colors.secondaryLight : colors.primaryLight,
            borderColor: colors.primary,
          })}>
          <FontAwesome name="chevron-left" size={20} color={colors.primary} />
        </Pressable>

        {simulationTitle ? (
          <View className="flex-1 rounded-full border border-border bg-primary-light px-md py-sm">
            <Text className="font-arial text-sm font-bold text-primary" numberOfLines={1}>
              {simulationTitle}
            </Text>
          </View>
        ) : null}
      </View>

      {!simulationUrl || hasError ? (
        <View className="flex-1 items-center justify-center px-lg">
          <Text className="text-center font-arial text-xl font-bold text-primary">
            Não foi possível carregar a simulação
          </Text>
          <Text className="mt-sm text-center font-arial text-md leading-6 text-text-muted">
            Verifique sua conexão e tente abrir a simulação novamente.
          </Text>
        </View>
      ) : (
        <WebView
          source={{ uri: simulationUrl }}
          startInLoadingState
          onError={() => setHasError(true)}
          renderLoading={() => (
            <View className="absolute inset-0 items-center justify-center bg-background">
              <ActivityIndicator color={colors.primary} size="large" />
              <Text className="mt-md font-arial text-md font-bold text-primary">
                Carregando PhET...
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
