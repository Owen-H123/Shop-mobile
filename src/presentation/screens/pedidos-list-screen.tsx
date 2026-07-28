import { Link, router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/presentation/components/themed-text';
import { ThemedView } from '@/presentation/components/themed-view';
import { usePedidos } from '@/presentation/hooks/use-pedidos';
import { Spacing } from '@/presentation/styles/theme';
import { Pedido } from '@/domain/entities/pedido';

function PedidoRow({ pedido }: { pedido: Pedido }) {
  return (
    <Pressable onPress={() => router.push(`/pedidos/${pedido.id}`)}>
      <ThemedView type="backgroundElement" style={styles.row}>
        <ThemedText type="smallBold">{pedido.clienteNombre}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {pedido.producto} · x{pedido.cantidad}
        </ThemedText>
        <ThemedText type="small">
          ${pedido.precio.toFixed(2)} · {pedido.estado}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function PedidosListScreen() {
  const { pedidos, loading, error, refetch } = usePedidos();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title">Pedidos</ThemedText>
          <View style={styles.headerLinks}>
            <Link href="/products">
              <ThemedText type="linkPrimary">Catálogo</ThemedText>
            </Link>
            <Link href="/profile">
              <ThemedText type="linkPrimary">Perfil</ThemedText>
            </Link>
          </View>
        </View>

        {error && (
          <ThemedView type="backgroundElement" style={styles.message}>
            <ThemedText type="small">{error}</ThemedText>
          </ThemedView>
        )}

        {!error && loading && pedidos.length === 0 && (
          <ThemedView type="backgroundElement" style={styles.message}>
            <ThemedText type="small">Cargando pedidos…</ThemedText>
          </ThemedView>
        )}

        {!error && !loading && pedidos.length === 0 && (
          <ThemedView type="backgroundElement" style={styles.message}>
            <ThemedText type="small">Todavía no hay pedidos registrados.</ThemedText>
          </ThemedView>
        )}

        <FlatList
          style={styles.list}
          data={pedidos}
          keyExtractor={(pedido) => String(pedido.id)}
          renderItem={({ item }) => <PedidoRow pedido={item} />}
          contentContainerStyle={styles.listContent}
        />

        <Pressable onPress={() => router.push('/pedidos/create')}>
          <ThemedView type="backgroundSelected" style={styles.createButton}>
            <ThemedText type="linkPrimary">+ Nuevo pedido</ThemedText>
          </ThemedView>
        </Pressable>
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
    paddingHorizontal: Spacing.four,
  },
  header: {
    paddingVertical: Spacing.four,
    gap: Spacing.two,
  },
  headerLinks: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
  message: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    marginBottom: Spacing.three,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: Spacing.two,
    paddingBottom: Spacing.four,
  },
  row: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.half,
  },
  createButton: {
    alignSelf: 'center',
    marginVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
  },
});
