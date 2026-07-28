import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppLoadingScreen } from '@/presentation/components/app-loading-screen';
import { ThemedText } from '@/presentation/components/themed-text';

const SPLASH_DURATION = 1200;

export function LoginScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowSplash(false), SPLASH_DURATION);
    return () => clearTimeout(timeout);
  }, []);

  function handleIngresar() {
    if (!usuario.trim() || !contrasena.trim()) {
      setError('Ingresa usuario y contraseña para continuar.');
      return;
    }

    setError(null);
    setSubmitting(true);

    // Login simulado: no valida contra un backend, solo confirma que se llenaron los campos.
    setTimeout(() => {
      setSubmitting(false);
      router.replace('/pedidos');
    }, 400);
  }

  if (showSplash) {
    return <AppLoadingScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-brand">
      <Animated.View entering={FadeInDown.duration(400)} className="flex-row items-center gap-2 px-6 pt-2">
        <View className="h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white">
          <Image
            source={require('@/assets/images/icono.jpg')}
            style={{ width: 32, height: 32 }}
            contentFit="cover"
          />
        </View>
        <ThemedText className="text-lg font-bold text-white">Shop Mobile</ThemedText>
      </Animated.View>

      <View className="items-center py-8">
        <Animated.View
          entering={ZoomIn.delay(150).duration(400)}
          className="h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg">
          <Image
            source={require('@/assets/images/icono.jpg')}
            style={{ width: 96, height: 96 }}
            contentFit="cover"
          />
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInUp.delay(200).duration(450)}
        className="flex-1 rounded-t-[40px] bg-white px-8 pb-8 pt-10">
        <View className="gap-1">
          <ThemedText className="text-center text-2xl font-bold text-black">Ingresar</ThemedText>
          <ThemedText className="text-center text-sm text-muted">
            Gestión de pedidos para tu emprendimiento
          </ThemedText>
        </View>

        <View className="gap-4 pt-8">
          <TextInput
            className="border-b border-surface-selected py-3 text-black"
            value={usuario}
            onChangeText={setUsuario}
            placeholder="Usuario"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
          />
          <TextInput
            className="border-b border-surface-selected py-3 text-black"
            value={contrasena}
            onChangeText={setContrasena}
            placeholder="Contraseña"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {error && <ThemedText className="pt-4 text-sm text-red-600">{error}</ThemedText>}

        <Pressable
          onPress={handleIngresar}
          disabled={submitting}
          className="mt-8 items-center self-center active:scale-95">
          <View className="min-w-32 items-center rounded-full bg-black px-8 py-3">
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <ThemedText className="font-semibold text-white">Ingresar</ThemedText>
            )}
          </View>
        </Pressable>

        <View className="flex-1 items-center justify-end pb-2">
          <View className="h-24 w-24 rounded-full bg-brand/10" />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
