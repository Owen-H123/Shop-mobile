import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
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

type EstadoMeta = {
  label: string;
  color: string;
  bg: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const ESTADO_META: Record<EstadoPedido, EstadoMeta> = {
  PENDIENTE: {
    label: "Pendientes",
    color: "#B45309",
    bg: "#FEF3C7",
    icon: "time-outline",
  },
  EN_PROCESO: {
    label: "En proceso",
    color: "#1D4ED8",
    bg: "#DBEAFE",
    icon: "sync-outline",
  },
  ENTREGADO: {
    label: "Entregados",
    color: "#15803D",
    bg: "#DCFCE7",
    icon: "checkmark-circle-outline",
  },
  CANCELADO: {
    label: "Cancelados",
    color: "#B91C1C",
    bg: "#FEE2E2",
    icon: "close-circle-outline",
  },
};

function StatCard({
  label,
  value,
  icon,
  color,
  bg,
  delay,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  delay: number;
}) {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(320)}
      className="w-[47%] gap-2 rounded-2xl p-4"
      style={{ backgroundColor: bg }}
    >
      <View className="flex-row items-center justify-between">
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <ThemedText className="text-2xl font-bold" style={{ color }}>
        {value}
      </ThemedText>
      <ThemedText type="small" style={{ color }}>
        {label}
      </ThemedText>
    </Animated.View>
  );
}

function QuickAction({
  label,
  icon,
  onPress,
  delay,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  delay: number;
}) {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(320)}
      className="flex-1"
    >
      <Pressable
        onPress={onPress}
        className="items-center gap-2 active:opacity-70"
      >
        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-brand/10">
          <Ionicons name={icon} size={22} color="#F35744" />
        </View>
        <ThemedText type="small" className="text-center">
          {label}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

function RecentPedidoRow({ pedido, index }: { pedido: Pedido; index: number }) {
  const meta = ESTADO_META[pedido.estado];
  return (
    <Animated.View entering={FadeInDown.delay(index * 40).duration(280)}>
      <Pressable
        onPress={() => router.push(`/pedidos/${pedido.id}`)}
        className="active:scale-[0.98]"
      >
        <ThemedView
          type="backgroundElement"
          className="flex-row items-center gap-3 rounded-2xl p-4"
        >
          <View
            className="h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: meta.bg }}
          >
            <Ionicons name={meta.icon} size={16} color={meta.color} />
          </View>
          <View className="flex-1 gap-0.5">
            <ThemedText type="smallBold">{pedido.clienteNombre}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {pedido.producto} · x{pedido.cantidad}
            </ThemedText>
          </View>
          <ThemedText type="smallBold">
            {formatCurrency(pedido.precio * pedido.cantidad)}
          </ThemedText>
        </ThemedView>
      </Pressable>
    </Animated.View>
  );
}

export function AdminDashboardScreen() {
  const { pedidos, loading, error, refetch } = usePedidos();
  const { usuarioActual, checkingSesion, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // Protege la ruta: sin sesión vuelve al login; si es VENDEDOR, no entra al panel admin.
  useEffect(() => {
    if (checkingSesion) return;
    if (!usuarioActual) {
      router.replace("/");
      return;
    }
    if (usuarioActual.rol !== "ADMIN") {
      router.replace("/pedidos");
    }
  }, [checkingSesion, usuarioActual]);

  const stats = useMemo(() => {
    const porEstado: Record<EstadoPedido, number> = {
      PENDIENTE: 0,
      EN_PROCESO: 0,
      ENTREGADO: 0,
      CANCELADO: 0,
    };
    let ventasEntregadas = 0;

    for (const pedido of pedidos) {
      porEstado[pedido.estado] += 1;
      if (pedido.estado === "ENTREGADO") {
        ventasEntregadas += pedido.precio * pedido.cantidad;
      }
    }

    return { total: pedidos.length, porEstado, ventasEntregadas };
  }, [pedidos]);

  const recientes = useMemo(
    () =>
      [...pedidos]
        .sort(
          (a, b) =>
            new Date(b.fechaRegistro).getTime() -
            new Date(a.fechaRegistro).getTime(),
        )
        .slice(0, 5),
    [pedidos],
  );

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

  if (checkingSesion || !usuarioActual || usuarioActual.rol !== "ADMIN") {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }}>
        <Animated.View
          entering={FadeInDown.duration(320)}
          className="flex-row items-start justify-between"
        >
          <View className="gap-1">
            <ThemedText type="small" themeColor="textSecondary">
              Panel de administración
            </ThemedText>
            <ThemedText type="title">
              Hola, {usuarioActual.nombre.split(" ")[0]}
            </ThemedText>
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
        </Animated.View>

        {error && (
          <ThemedView type="backgroundElement" className="rounded-2xl p-6">
            <ThemedText type="small">{error}</ThemedText>
          </ThemedView>
        )}

        {loading && pedidos.length === 0 ? (
          <ThemedView
            type="backgroundElement"
            className="items-center rounded-2xl p-8"
          >
            <ActivityIndicator />
            <ThemedText type="small" className="pt-2">
              Cargando estadísticas…
            </ThemedText>
          </ThemedView>
        ) : (
          <>
            {/* Resumen principal */}
            <View className="flex-row gap-3">
              <Animated.View
                entering={FadeInUp.delay(80).duration(320)}
                className="flex-1 gap-2 rounded-2xl bg-black p-4"
              >
                <Ionicons name="cube-outline" size={18} color="#ffffff" />
                <ThemedText className="text-2xl font-bold text-white">
                  {stats.total}
                </ThemedText>
                <ThemedText type="small" className="text-white/70">
                  Pedidos totales
                </ThemedText>
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(140).duration(320)}
                className="flex-1 gap-2 rounded-2xl bg-brand p-4"
              >
                <Ionicons name="cash-outline" size={18} color="#ffffff" />
                <ThemedText className="text-2xl font-bold text-white">
                  {formatCurrency(stats.ventasEntregadas)}
                </ThemedText>
                <ThemedText type="small" className="text-white/80">
                  Ventas entregadas
                </ThemedText>
              </Animated.View>
            </View>

            {/* Estados */}
            <View className="gap-2">
              <ThemedText type="smallBold">Pedidos por estado</ThemedText>
              <View className="flex-row flex-wrap justify-between gap-y-3">
                {(Object.keys(ESTADO_META) as EstadoPedido[]).map(
                  (estado, index) => (
                    <StatCard
                      key={estado}
                      label={ESTADO_META[estado].label}
                      value={String(stats.porEstado[estado])}
                      icon={ESTADO_META[estado].icon}
                      color={ESTADO_META[estado].color}
                      bg={ESTADO_META[estado].bg}
                      delay={200 + index * 60}
                    />
                  ),
                )}
              </View>
            </View>

            {/* Accesos rápidos */}
            <View className="gap-2">
              <ThemedText type="smallBold">Accesos rápidos</ThemedText>
              <ThemedView
                type="backgroundElement"
                className="flex-row rounded-2xl p-4"
              >
                <QuickAction
                  label="Nuevo pedido"
                  icon="add-circle-outline"
                  onPress={() => router.push("/pedidos/create")}
                  delay={440}
                />
                <QuickAction
                  label="Ver pedidos"
                  icon="list-outline"
                  onPress={() => router.push("/pedidos")}
                  delay={480}
                />
                <QuickAction
                  label="Catálogo"
                  icon="storefront-outline"
                  onPress={() => router.push("/products")}
                  delay={520}
                />
                <QuickAction
                  label="Perfil"
                  icon="person-circle-outline"
                  onPress={() => router.push("/profile")}
                  delay={560}
                />
              </ThemedView>
            </View>

            {/* Actividad reciente */}
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <ThemedText type="smallBold">Actividad reciente</ThemedText>
                <Pressable onPress={() => router.push("/pedidos")}>
                  <ThemedText type="small" className="text-brand">
                    Ver todos
                  </ThemedText>
                </Pressable>
              </View>

              {recientes.length === 0 ? (
                <ThemedView
                  type="backgroundElement"
                  className="rounded-2xl p-6"
                >
                  <ThemedText type="small">
                    Todavía no hay pedidos registrados.
                  </ThemedText>
                </ThemedView>
              ) : (
                <View className="gap-2">
                  {recientes.map((pedido, index) => (
                    <RecentPedidoRow
                      key={pedido.id}
                      pedido={pedido}
                      index={index}
                    />
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
