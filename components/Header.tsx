import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';

import { colors } from '@/constants';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function Header({ title, showBackButton = false, onBackPress }: HeaderProps) {
  function handleBackPress() {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (router.canGoBack()) {
      router.back();
    }
  }

  return (
    <View className="bg-primary-light pt-lg">
      <View className="min-h-[68px] justify-center px-lg">
        <View className="z-10 flex-row items-center">
          {showBackButton && (
            <Pressable
              accessibilityLabel="Voltar"
              accessibilityRole="button"
              className="mr-sm h-11 w-11 items-center justify-center rounded-full"
              onPress={handleBackPress}
              style={({ pressed }) => ({
                backgroundColor: pressed ? colors.secondaryLight : colors.primaryLight,
              })}>
              <FontAwesome name="chevron-left" size={20} color={colors.primary} />
            </Pressable>
          )}

          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={require('../assets/images/logo-univasf.png')}
            style={{ width: 156, height: 30 }}
          />
        </View>

        <View className="absolute inset-x-lg items-center">
          <Text
            className="max-w-[48%] text-center font-arial text-lg font-bold"
            numberOfLines={1}
            style={{ color: colors.primary }}>
            {title}
          </Text>
        </View>
      </View>

      <View className="h-1.5 bg-secondary" />
    </View>
  );
}
