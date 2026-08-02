import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InfoRow } from '@/presentation/components/info-row';
import { SectionCard } from '@/presentation/components/section-card';
import { ThemedText } from '@/presentation/components/themed-text';
import { useAuth } from '@/presentation/hooks/use-auth';

const INTEGRANTES = ['Integrante 1 (pendiente)', 'Integrante 2 (pendiente)', 'Integrante 3 (pendiente)'];

export function ProfileScreen() {
  const { usuarioActual, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  function handleLogout() {
    Alert.alert('Cerrar sesión', '¿Seguro que deseas salir de tu cuenta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          setSigningOut(true);
          await logout();
          setSigningOut(false);
          router.replace('/');
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ gap: 24, padding: 24 }}>
        <Animated.View entering={FadeInUp.duration(350)}>
          <ThemedText type="title" className="pb-2">
            Perfil
          </ThemedText>
        </Animated.View>

        <SectionCard title="Cuenta">
          <InfoRow label="Usuario" value={usuarioActual?.usuario ?? '—'} />
          <InfoRow label="Nombre" value={usuarioActual?.nombre ?? '—'} />
          <InfoRow label="Rol" value={usuarioActual?.rol ?? '—'} />
        </SectionCard>

        <SectionCard title="Sobre la app">
          <InfoRow label="Nombre" value={Constants.expoConfig?.name ?? 'shop-mobile'} />
          <InfoRow
            label="Descripción"
            value="Gestión de pedidos para un emprendimiento de productos artesanales."
          />
          <InfoRow label="Versión" value={Constants.expoConfig?.version ?? '1.0.0'} />
        </SectionCard>

        <SectionCard title="Equipo">
          {INTEGRANTES.map((integrante) => (
            <InfoRow key={integrante} label="Integrante" value={integrante} />
          ))}
        </SectionCard>

        <Pressable
          onPress={handleLogout}
          disabled={signingOut}
          className="items-center rounded-full bg-red-600 px-8 py-3 active:scale-95">
          {signingOut ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <ThemedText className="font-semibold text-white">Cerrar sesión</ThemedText>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}