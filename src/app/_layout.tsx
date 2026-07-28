import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/presentation/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Ingresar' }} />
        <Stack.Screen name="pedidos" options={{ headerShown: false }} />
        <Stack.Screen name="products" options={{ title: 'Catálogo' }} />
        <Stack.Screen name="profile" options={{ title: 'Perfil' }} />
      </Stack>
    </ThemeProvider>
  );
}
