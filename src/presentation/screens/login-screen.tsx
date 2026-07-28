import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/presentation/components/themed-text';
import { ThemedView } from '@/presentation/components/themed-view';
import { useTheme } from '@/presentation/hooks/use-theme';
import { Spacing } from '@/presentation/styles/theme';

export function LoginScreen() {
  const theme = useTheme();
  const [usuario, setUsuario] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleIngresar() {
    if (!usuario.trim()) {
      setError('Ingresa un usuario para continuar.');
      return;
    }
    setError(null);
    router.replace('/pedidos');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Ingresar</ThemedText>

        <ThemedView type="backgroundElement" style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            value={usuario}
            onChangeText={setUsuario}
            placeholder="Usuario"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="none"
          />
        </ThemedView>

        {error && (
          <ThemedText type="small" style={styles.error}>
            {error}
          </ThemedText>
        )}

        <Pressable onPress={handleIngresar}>
          <ThemedView type="backgroundSelected" style={styles.button}>
            <ThemedText type="linkPrimary">Ingresar</ThemedText>
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.five,
  },
  inputWrapper: {
    width: '100%',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  input: {
    paddingVertical: Spacing.two,
  },
  error: {
    color: '#d33',
  },
  button: {
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
  },
});
