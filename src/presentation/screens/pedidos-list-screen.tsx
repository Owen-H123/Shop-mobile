import { Ionicons } from "@expo/vector-icons";
import { Link, router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Pedido } from "@/domain/entities/pedido";
import { ThemedText } from "@/presentation/components/themed-text";
import { ThemedView } from "@/presentation/components/themed-view";
import { useAuth } from "@/presentation/hooks/use-auth";
import { usePedidos } from "@/presentation/hooks/use-pedidos";
import { formatCurrency } from "@/presentation/utils/format-currency";

function PedidoRow({ pedido, index }: { pedido: Pedido; index: number }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 8) * 40).duration(300)}
    >
      <Pressable
        onPress={() => router.push(`/pedidos/${pedido.id}`)}
        className="active:scale-[0.98]"
      >
        <ThemedView
          type="backgroundElement"
          className="gap-0.5 rounded-2xl p-4"
        >
          <ThemedText type="smallBold">{pedido.clienteNombre}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {pedido.producto} · x{pedido.cantidad}
          </ThemedText>
          <ThemedText type="small">
            {formatCurrency(pedido.precio)} · {pedido.estado}
          </ThemedText>
        </ThemedView>
      </Pressable>
    </Animated.View>
  );
}

export function PedidosListScreen() {
  const { pedidos, loading, error, refetch } = usePedidos();
  const { usuarioActual, checkingSesion, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    if (!checkingSesion && !usuarioActual) {
      router.replace("/");
    }
  }, [checkingSesion, usuarioActual]);

  function handleLogout() {
    Alert.alert("Cerrar sesión", "¿Seguro que deseas salir de tu cuenta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          setSigningOut(true);
          await logout();
          setSigningOut(false);
          router.replace("/");
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1">
      <ThemedView className="flex-1 px-6">
        <Animated.View entering={FadeInUp.duration(350)} className="gap-2 py-6">
          <View className="flex-row items-start justify-between">
            <View className="gap-1">
              <ThemedText type="title">Pedidos</ThemedText>
              {usuarioActual && (
                <ThemedText type="small" themeColor="textSecondary">
                  Sesión: {usuarioActual.nombre}
                </ThemedText>
              )}
            </View>

            <Pressable
              onPress={handleLogout}
              disabled={signingOut}
              className="flex-row items-center gap-1.5 rounded-full bg-surface-selected px-4 py-2 active:opacity-70"
            >
              {signingOut ? (
                <ActivityIndicator size="small" />
              ) : (
                <>
                  <Ionicons name="log-out-outline" size={16} color="#DC2626" />
                  <ThemedText type="small" className="text-red-600">
                    Salir
                  </ThemedText>
                </>
              )}
            </Pressable>
          </View>

          <View className="flex-row gap-6">
            {usuarioActual?.rol === "ADMIN" && (
              <Link href="/admin">
                <ThemedText type="linkPrimary">Panel Admin</ThemedText>
              </Link>
            )}
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
            <ThemedText type="small">
              Todavía no hay pedidos registrados.
            </ThemedText>
          </ThemedView>
        )}

        <FlatList
          className="flex-1"
          data={pedidos}
          keyExtractor={(pedido) => String(pedido.id)}
          renderItem={({ item, index }) => (
            <PedidoRow pedido={item} index={index} />
          )}
          contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
        />

        <Pressable
          onPress={() => router.push("/pedidos/create")}
          className="items-center active:scale-95"
        >
          <View className="my-4 rounded-full bg-brand px-8 py-3">
            <ThemedText className="font-semibold text-white">
              + Nuevo pedido
            </ThemedText>
          </View>
        </Pressable>
      </ThemedView>
    </SafeAreaView>
  );
}
