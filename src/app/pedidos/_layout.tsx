import { Stack } from 'expo-router';

export default function PedidosLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Pedidos' }} />
      <Stack.Screen name="create" options={{ title: 'Nuevo pedido' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalle del pedido' }} />
    </Stack>
  );
}
