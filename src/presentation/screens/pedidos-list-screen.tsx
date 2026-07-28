import { Link, router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/presentation/components/themed-text';
import { ThemedView } from '@/presentation/components/themed-view';
import { usePedidos } from '@/presentation/hooks/use-pedidos';
import { Pedido } from '@/domain/entities/pedido';

function PedidoRow({ pedido, index }: { pedido: Pedido; index: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 40).duration(300)}>
      <Pressable onPress={() => router.push(`/pedidos/${pedido.id}`)} className="active:scale-[0.98]">
        <ThemedView type="backgroundElement" className="gap-0.5 rounded-2xl p-4">
          <ThemedText type="smallBold">{pedido.clienteNombre}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {pedido.producto} · x{pedido.cantidad}
          </ThemedText>
          <ThemedText type="small">
            ${pedido.precio.toFixed(2)} · {pedido.estado}
          </ThemedText>
        </ThemedView>
      </Pressable>
    </Animated.View>
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
    <SafeAreaView className="flex-1">
      <ThemedView className="flex-1 px-6">
        <Animated.View entering={FadeInUp.duration(350)} className="gap-2 py-6">
          <ThemedText type="title">Pedidos</ThemedText>
          <View className="flex-row gap-6">
            <Link href="/products">
              <ThemedText type="linkPrimary">Catálogo</ThemedText>
            </Link>
            <Link href="/profile">
              <ThemedText type="linkPrimary">Perfil</ThemedText>
            </Link>
          </View>
        </Animated.View>

        {error && (
          <ThemedView type="backgroundElement" className="mb-4 rounded-2xl p-6">
            <ThemedText type="small">{error}</ThemedText>
          </ThemedView>
        )}

        {!error && loading && pedidos.length === 0 && (
          <ThemedView type="backgroundElement" className="mb-4 rounded-2xl p-6">
            <ThemedText type="small">Cargando pedidos…</ThemedText>
          </ThemedView>
        )}

        {!error && !loading && pedidos.length === 0 && (
          <ThemedView type="backgroundElement" className="mb-4 rounded-2xl p-6">
            <ThemedText type="small">Todavía no hay pedidos registrados.</ThemedText>
          </ThemedView>
        )}

        <FlatList
          className="flex-1"
          data={pedidos}
          keyExtractor={(pedido) => String(pedido.id)}
          renderItem={({ item, index }) => <PedidoRow pedido={item} index={index} />}
          contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
        />

        <Pressable onPress={() => router.push('/pedidos/create')} className="items-center active:scale-95">
          <View className="my-4 rounded-full bg-brand px-8 py-3">
            <ThemedText className="font-semibold text-white">+ Nuevo pedido</ThemedText>
          </View>
        </Pressable>
      </ThemedView>
    </SafeAreaView>
  );
}
