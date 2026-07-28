import { router } from 'expo-router';
import { useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { pedidoService } from '@/application/services/pedido.service';
import { PedidoForm } from '@/presentation/components/pedido-form';
import { ThemedText } from '@/presentation/components/themed-text';
import { ThemedView } from '@/presentation/components/themed-view';
import { NuevoPedido } from '@/domain/repositories/pedido-repository';

export function CreatePedidoScreen() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(pedido: NuevoPedido) {
    setSubmitting(true);
    setError(null);
    try {
      await pedidoService.createPedido(pedido);
      router.back();
    } catch {
      setError('No se pudo guardar el pedido.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1">
      <ThemedView className="flex-1">
        <Animated.View entering={FadeInDown.duration(300)}>
          <ThemedText type="title" className="px-6 pt-6">
            Nuevo pedido
          </ThemedText>
          {error && (
            <ThemedText type="small" className="px-6 pt-2 text-red-600">
              {error}
            </ThemedText>
          )}
        </Animated.View>
        <PedidoForm submitLabel="Guardar pedido" submitting={submitting} onSubmit={handleSubmit} />
      </ThemedView>
    </SafeAreaView>
  );
}
