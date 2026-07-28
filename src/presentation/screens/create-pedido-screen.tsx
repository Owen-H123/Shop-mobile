import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { pedidoService } from '@/application/services/pedido.service';
import { PedidoForm } from '@/presentation/components/pedido-form';
import { ThemedText } from '@/presentation/components/themed-text';
import { ThemedView } from '@/presentation/components/themed-view';
import { Spacing } from '@/presentation/styles/theme';
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
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Nuevo pedido
        </ThemedText>
        {error && (
          <ThemedText type="small" style={styles.error}>
            {error}
          </ThemedText>
        )}
        <PedidoForm submitLabel="Guardar pedido" submitting={submitting} onSubmit={handleSubmit} />
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
  error: {
    color: '#d33',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
});
