import { Image } from 'expo-image';
import { ActivityIndicator, View } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

import { ThemedText } from '@/presentation/components/themed-text';

export function AppLoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-6 bg-brand">
      <Animated.View
        entering={ZoomIn.springify().damping(12)}
        className="h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg">
        <Image
          source={require('@/assets/images/icono.jpg')}
          style={{ width: 108, height: 108 }}
          contentFit="cover"
        />
      </Animated.View>
      <Animated.View entering={FadeInUp.delay(150).duration(400)}>
        <ThemedText className="text-2xl font-bold text-white">Shop Mobile</ThemedText>
      </Animated.View>
      <Animated.View entering={FadeInUp.delay(300).duration(400)}>
        <ActivityIndicator color="#ffffff" />
      </Animated.View>
    </View>
  );
}
