import { Ionicons } from "@expo/vector-icons";
import { Link, router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { EstadoPedido, Pedido } from "@/domain/entities/pedido";
import { ThemedText } from "@/presentation/components/themed-text";
import { ThemedView } from "@/presentation/components/themed-view";
import { useAuth } from "@/presentation/hooks/use-auth";
import { usePedidos } from "@/presentation/hooks/use-pedidos";
import { formatCurrency } from "@/presentation/utils/format-currency";

const ESTADO_CONFIG: Record<EstadoPedido, { label: string; className: string }> = {
  PENDIENTE: {
    label: "Pendiente",
    className: "bg-amber-500/15 dark:bg-amber-400/20",
  },
  EN_PROCESO: {
    label: "En proceso",
    className: "bg-blue-500/15 dark:bg-blue-400/20",
  },
  ENTREGADO: {
    label: "Entregado",
    className: "bg-emerald-500/15 dark:bg-emerald-400/20",
  },
  CANCELADO: {
    label: "Cancelado",
    className: "bg-red-500/15 dark:bg-red-400/20",
  },
};

const ESTADO_TEXT_CLASSNAMES: Record<EstadoPedido, string> = {
  PENDIENTE: "text-amber-700 dark:text-amber-300",
  EN_PROCESO: "text-blue-700 dark:text-blue-300",
  ENTREGADO: "text-emerald-700 dark:text-emerald-300",
  CANCELADO: "text-red-700 dark:text-red-300",
};

function EstadoBadge({ estado }: { estado: EstadoPedido }) {
  const config = ESTADO_CONFIG[estado];
  return (
    <View className={`rounded-full px-2.5 py-1 ${config.className}`}>
      <ThemedText
        type="small"
        className={`text-xs font-semibold leading-4 ${ESTADO_TEXT_CLASSNAMES[estado]}`}
      >
        {config.label}
      </ThemedText>
    </View>
  );
}

function getIniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  const iniciales = partes.slice(0, 2).map((parte) => parte[0]?.toUpperCase() ?? "");
  return iniciales.join("") || "?";
}

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
          className="flex-row items-center gap-3 rounded-2xl p-4"
        >
          <View className="h-11 w-11 items-center justify-center rounded-full bg-brand/15">
            <ThemedText type="smallBold" className="text-brand">
              {getIniciales(pedido.clienteNombre)}
            </ThemedText>
          </View>

          <View className="flex-1 gap-0.5">
            <ThemedText type="smallBold" numberOfLines={1}>
              {pedido.clienteNombre}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
              {pedido.producto} · x{pedido.cantidad}
            </ThemedText>
          </View>

          <View className="items-end gap-1.5">
            <ThemedText type="smallBold">{formatCurrency(pedido.precio)}</ThemedText>
            <EstadoBadge estado={pedido.estado} />
          </View>

          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </ThemedView>
      </Pressable>
    </Animated.View>
  );
}

function NavChip({
  href,
  icon,
  label,
}: {
  href: "/admin" | "/products" | "/profile";
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <Link href={href} asChild>
      <Pressable className="flex-row items-center gap-1.5 rounded-full bg-surface-selected px-3.5 py-2 active:opacity-70">
        <Ionicons name={icon} size={15} color="#F35744" />
        <ThemedText type="small">{label}</ThemedText>
      </Pressable>
    </Link>
  );
}

export function PedidosListScreen() {
  const { pedidos, loading, error, refetch } = usePedidos();
  const { usuarioActual, checkingSesion, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const pendientes = useMemo(
    () => pedidos.filter((pedido) => pedido.estado === "PENDIENTE").length,
    [pedidos],
  );

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
        <Animated.View entering={FadeInUp.duration(350)} className="gap-3 py-6">
          <View className="flex-row items-start justify-between">
            <View className="gap-1">
              <ThemedText type="title">Pedidos</ThemedText>
              {usuarioActual && (
                <ThemedText type="small" themeColor="textSecondary">
                  {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}
                  {pendientes > 0 ? ` · ${pendientes} pendiente${pendientes === 1 ? "" : "s"}` : ""}
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

          <View className="flex-row flex-wrap gap-2">
            {usuarioActual?.rol === "ADMIN" && (
              <NavChip href="/admin" icon="speedometer-outline" label="Panel Admin" />
            )}
            <NavChip href="/products" icon="pricetags-outline" label="Catálogo" />
            <NavChip href="/profile" icon="person-outline" label="Perfil" />
          </View>
        </Animated.View>

        {error && (
          <ThemedView
            type="backgroundElement"
            className="mb-4 items-center gap-2 rounded-2xl p-6"
          >
            <Ionicons name="alert-circle-outline" size={22} color="#DC2626" />
            <ThemedText type="small" className="text-center">
              {error}
            </ThemedText>
          </ThemedView>
        )}

        {!error && loading && pedidos.length === 0 && (
          <View className="flex-1 items-center justify-center gap-3">
            <ActivityIndicator />
            <ThemedText type="small" themeColor="textSecondary">
              Cargando pedidos…
            </ThemedText>
          </View>
        )}

        {!error && !loading && pedidos.length === 0 && (
          <View className="flex-1 items-center justify-center gap-3 pb-16">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-surface-selected dark:bg-surface-selected-dark">
              <Ionicons name="receipt-outline" size={28} color="#9CA3AF" />
            </View>
            <ThemedText type="smallBold">Todavía no hay pedidos</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" className="text-center">
              Los pedidos que registres van a aparecer acá.
            </ThemedText>
          </View>
        )}

        {!error && pedidos.length > 0 && (
          <FlatList
            className="flex-1"
            data={pedidos}
            keyExtractor={(pedido) => String(pedido.id)}
            renderItem={({ item, index }) => (
              <PedidoRow pedido={item} index={index} />
            )}
            contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
            refreshControl={
              <RefreshControl refreshing={loading && pedidos.length > 0} onRefresh={refetch} />
            }
          />
        )}

        <Pressable
          onPress={() => router.push("/pedidos/create")}
          className="flex-row items-center justify-center gap-1.5 active:scale-95"
        >
          <View className="my-4 flex-row items-center gap-1.5 rounded-full bg-brand px-8 py-3">
            <Ionicons name="add" size={18} color="white" />
            <ThemedText className="font-semibold text-white">
              Nuevo pedido
            </ThemedText>
          </View>
        </Pressable>
      </ThemedView>
    </SafeAreaView>
  );
}
