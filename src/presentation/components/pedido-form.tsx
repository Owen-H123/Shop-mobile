import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemedText } from '@/presentation/components/themed-text';
import { ThemedView } from '@/presentation/components/themed-view';
import { useTheme } from '@/presentation/hooks/use-theme';
import { EstadoPedido } from '@/domain/entities/pedido';
import { NuevoPedido } from '@/domain/repositories/pedido-repository';

const ESTADOS: EstadoPedido[] = ['PENDIENTE', 'EN_PROCESO', 'ENTREGADO', 'CANCELADO'];

type PedidoFormValues = {
  clienteNombre: string;
  producto: string;
  cantidad: string;
  precio: string;
  estado: EstadoPedido;
};

type PedidoFormProps = {
  initialValues?: Partial<PedidoFormValues>;
  submitLabel: string;
  submitting?: boolean;
  onSubmit: (pedido: NuevoPedido) => void;
};

export function PedidoForm({ initialValues, submitLabel, submitting, onSubmit }: PedidoFormProps) {
  const theme = useTheme();
  const [clienteNombre, setClienteNombre] = useState(initialValues?.clienteNombre ?? '');
  const [producto, setProducto] = useState(initialValues?.producto ?? '');
  const [cantidad, setCantidad] = useState(initialValues?.cantidad ?? '');
  const [precio, setPrecio] = useState(initialValues?.precio ?? '');
  const [estado, setEstado] = useState<EstadoPedido>(initialValues?.estado ?? 'PENDIENTE');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    const cantidadNumero = Number(cantidad);
    const precioNumero = Number(precio);

    if (!clienteNombre.trim() || !producto.trim()) {
      setError('Cliente y producto son obligatorios.');
      return;
    }
    if (!Number.isFinite(cantidadNumero) || cantidadNumero <= 0) {
      setError('La cantidad debe ser un número mayor a 0.');
      return;
    }
    if (!Number.isFinite(precioNumero) || precioNumero < 0) {
      setError('El precio debe ser un número válido.');
      return;
    }

    setError(null);
    onSubmit({
      clienteNombre: clienteNombre.trim(),
      producto: producto.trim(),
      cantidad: cantidadNumero,
      precio: precioNumero,
      estado,
    });
  }

  return (
    <Animated.View entering={FadeIn.duration(300)} className="gap-4 p-6">
      <View className="gap-1">
        <ThemedText type="small" themeColor="textSecondary">
          Cliente
        </ThemedText>
        <ThemedView type="backgroundElement" className="rounded-lg px-4">
          <TextInput
            className="py-3 text-black dark:text-white"
            value={clienteNombre}
            onChangeText={setClienteNombre}
            placeholder="Nombre del cliente"
            placeholderTextColor={theme.textSecondary}
          />
        </ThemedView>
      </View>

      <View className="gap-1">
        <ThemedText type="small" themeColor="textSecondary">
          Producto
        </ThemedText>
        <ThemedView type="backgroundElement" className="rounded-lg px-4">
          <TextInput
            className="py-3 text-black dark:text-white"
            value={producto}
            onChangeText={setProducto}
            placeholder="Producto"
            placeholderTextColor={theme.textSecondary}
          />
        </ThemedView>
      </View>

      <View className="gap-1">
        <ThemedText type="small" themeColor="textSecondary">
          Cantidad
        </ThemedText>
        <ThemedView type="backgroundElement" className="rounded-lg px-4">
          <TextInput
            className="py-3 text-black dark:text-white"
            value={cantidad}
            onChangeText={setCantidad}
            placeholder="0"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
          />
        </ThemedView>
      </View>

      <View className="gap-1">
        <ThemedText type="small" themeColor="textSecondary">
          Precio
        </ThemedText>
        <ThemedView type="backgroundElement" className="rounded-lg px-4">
          <TextInput
            className="py-3 text-black dark:text-white"
            value={precio}
            onChangeText={setPrecio}
            placeholder="0.00"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
          />
        </ThemedView>
      </View>

      <View className="gap-1">
        <ThemedText type="small" themeColor="textSecondary">
          Estado
        </ThemedText>
        <View className="flex-row flex-wrap gap-2">
          {ESTADOS.map((item) => (
            <Pressable key={item} onPress={() => setEstado(item)} className="active:scale-95">
              <ThemedView
                type={estado === item ? 'backgroundSelected' : 'backgroundElement'}
                className="rounded-full px-4 py-1.5">
                <ThemedText type="small">{item}</ThemedText>
              </ThemedView>
            </Pressable>
          ))}
        </View>
      </View>

      {error && (
        <ThemedText type="small" className="text-red-600">
          {error}
        </ThemedText>
      )}

      <Pressable onPress={handleSubmit} disabled={submitting} className="self-start active:scale-95">
        <ThemedView type="backgroundSelected" className="rounded-full px-6 py-3">
          <ThemedText type="linkPrimary">{submitting ? 'Guardando…' : submitLabel}</ThemedText>
        </ThemedView>
      </Pressable>
    </Animated.View>
  );
}
