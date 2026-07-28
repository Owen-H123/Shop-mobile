import Constants from 'expo-constants';
import { ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InfoRow } from '@/presentation/components/info-row';
import { SectionCard } from '@/presentation/components/section-card';
import { ThemedText } from '@/presentation/components/themed-text';

const INTEGRANTES = ['Integrante 1 (pendiente)', 'Integrante 2 (pendiente)', 'Integrante 3 (pendiente)'];

export function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ gap: 24, padding: 24 }}>
        <Animated.View entering={FadeInUp.duration(350)}>
          <ThemedText type="title" className="pb-2">
            Perfil
          </ThemedText>
        </Animated.View>

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
      </ScrollView>
    </SafeAreaView>
  );
}
