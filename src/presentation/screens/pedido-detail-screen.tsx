import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { pedidoService } from '@/application/services/pedido.service';
import { PedidoForm } from '@/presentation/components/pedido-form';
import { ThemedText } from '@/presentation/components/themed-text';
import { ThemedView } from '@/presentation/components/themed-view';
import { Spacing } from '@/presentation/styles/theme';
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
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Detalle del pedido
        </ThemedText>

        {loading && (
          <ThemedText type="small" style={styles.message}>
            Cargando…
          </ThemedText>
        )}

        {!loading && error && (
          <ThemedText type="small" style={styles.error}>
            {error}
          </ThemedText>
        )}

        {!loading && !error && !pedido && (
          <ThemedText type="small" style={styles.message}>
            Pedido no encontrado.
          </ThemedText>
        )}

        {!loading && pedido && (
          <>
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
            <Pressable onPress={handleDelete} style={styles.deleteButton}>
              <ThemedText type="link" style={styles.deleteText}>
                Eliminar pedido
              </ThemedText>
            </Pressable>
          </>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  title: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
  },
  message: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  error: {
    color: '#d33',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: Spacing.four,
  },
  deleteText: {
    color: '#d33',
  },
});
