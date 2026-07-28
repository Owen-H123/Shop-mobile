import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { pedidoService } from '@/application/services/pedido.service';
import { PedidoForm } from '@/presentation/components/pedido-form';
import { ThemedText } from '@/presentation/components/themed-text';
import { ThemedView } from '@/presentation/components/themed-view';
import { Pedido } from '@/domain/entities/pedido';
import { NuevoPedido } from '@/domain/repositories/pedido-repository';

export function PedidoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pedidoId = Number(id);

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadPedido = useCallback(() => {
    setLoading(true);
    setError(null);
    pedidoService
      .getPedidoById(pedidoId)
      .then(setPedido)
      .catch(() => setError('No se pudo cargar el pedido.'))
      .finally(() => setLoading(false));
  }, [pedidoId]);

  useFocusEffect(loadPedido);

  async function handleSubmit(values: NuevoPedido) {
    setSubmitting(true);
    setError(null);
    try {
      await pedidoService.updatePedido(pedidoId, values);
      router.back();
    } catch {
      setError('No se pudieron guardar los cambios.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleDelete() {
    Alert.alert('Eliminar pedido', '¿Seguro que quieres eliminar este pedido?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await pedidoService.deletePedido(pedidoId);
          router.back();
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1">
      <ThemedView className="flex-1">
        <ThemedText type="title" className="px-6 pt-6">
          Detalle del pedido
        </ThemedText>

        {loading && (
          <ThemedText type="small" className="px-6 pt-4">
            Cargando…
          </ThemedText>
        )}

        {!loading && error && (
          <ThemedText type="small" className="px-6 pt-4 text-red-600">
            {error}
          </ThemedText>
        )}

        {!loading && !error && !pedido && (
          <ThemedText type="small" className="px-6 pt-4">
            Pedido no encontrado.
          </ThemedText>
        )}

        {!loading && pedido && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <PedidoForm
              initialValues={{
                clienteNombre: pedido.clienteNombre,
                producto: pedido.producto,
                cantidad: String(pedido.cantidad),
                precio: String(pedido.precio),
                estado: pedido.estado,
              }}
              submitLabel="Guardar cambios"
              submitting={submitting}
              onSubmit={handleSubmit}
            />
            <Pressable onPress={handleDelete} className="items-center py-6 active:opacity-60">
              <ThemedText type="link" className="text-red-600">
                Eliminar pedido
              </ThemedText>
            </Pressable>
          </Animated.View>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
