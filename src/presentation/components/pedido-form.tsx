import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/presentation/components/themed-text';
import { ThemedView } from '@/presentation/components/themed-view';
import { useTheme } from '@/presentation/hooks/use-theme';
import { Spacing } from '@/presentation/styles/theme';
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
    <View style={styles.form}>
      <View style={styles.field}>
        <ThemedText type="small" themeColor="textSecondary">
          Cliente
        </ThemedText>
        <ThemedView type="backgroundElement" style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            value={clienteNombre}
            onChangeText={setClienteNombre}
            placeholder="Nombre del cliente"
            placeholderTextColor={theme.textSecondary}
          />
        </ThemedView>
      </View>

      <View style={styles.field}>
        <ThemedText type="small" themeColor="textSecondary">
          Producto
        </ThemedText>
        <ThemedView type="backgroundElement" style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            value={producto}
            onChangeText={setProducto}
            placeholder="Producto"
            placeholderTextColor={theme.textSecondary}
          />
        </ThemedView>
      </View>

      <View style={styles.field}>
        <ThemedText type="small" themeColor="textSecondary">
          Cantidad
        </ThemedText>
        <ThemedView type="backgroundElement" style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            value={cantidad}
            onChangeText={setCantidad}
            placeholder="0"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
          />
        </ThemedView>
      </View>

      <View style={styles.field}>
        <ThemedText type="small" themeColor="textSecondary">
          Precio
        </ThemedText>
        <ThemedView type="backgroundElement" style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            value={precio}
            onChangeText={setPrecio}
            placeholder="0.00"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
          />
        </ThemedView>
      </View>

      <View style={styles.field}>
        <ThemedText type="small" themeColor="textSecondary">
          Estado
        </ThemedText>
        <View style={styles.estadoRow}>
          {ESTADOS.map((item) => (
            <Pressable key={item} onPress={() => setEstado(item)}>
              <ThemedView
                type={estado === item ? 'backgroundSelected' : 'backgroundElement'}
                style={styles.estadoChip}>
                <ThemedText type="small">{item}</ThemedText>
              </ThemedView>
            </Pressable>
          ))}
        </View>
      </View>

      {error && (
        <ThemedText type="small" style={styles.error}>
          {error}
        </ThemedText>
      )}

      <Pressable onPress={handleSubmit} disabled={submitting} style={styles.submitButton}>
        <ThemedView type="backgroundSelected" style={styles.submitButtonInner}>
          <ThemedText type="linkPrimary">{submitting ? 'Guardando…' : submitLabel}</ThemedText>
        </ThemedView>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
    padding: Spacing.four,
  },
  field: {
    gap: Spacing.one,
  },
  inputWrapper: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  input: {
    paddingVertical: Spacing.two,
  },
  estadoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  estadoChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.five,
  },
  error: {
    color: '#d33',
  },
  submitButton: {
    alignSelf: 'flex-start',
  },
  submitButtonInner: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
  },
});
