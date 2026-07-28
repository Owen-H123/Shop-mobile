import { Image } from 'expo-image';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/presentation/components/themed-text';
import { ThemedView } from '@/presentation/components/themed-view';
import { useProducts } from '@/presentation/hooks/use-products';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/presentation/styles/theme';
import { Product } from '@/domain/entities/product';

function ProductCard({ product }: { product: Product }) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} contentFit="contain" />
      <View style={styles.cardBody}>
        <ThemedText type="smallBold" numberOfLines={2}>
          {product.title}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {product.category}
        </ThemedText>
        <ThemedText type="default">${product.price.toFixed(2)}</ThemedText>
      </View>
    </ThemedView>
  );
}

export function ProductsScreen() {
  const { products, loading, error, refetch } = useProducts();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.title}>
          Productos
        </ThemedText>

        {error && (
          <ThemedView type="backgroundElement" style={styles.messageBox}>
            <ThemedText type="small">{error}</ThemedText>
          </ThemedView>
        )}

        {!error && loading && products.length === 0 && (
          <ThemedView type="backgroundElement" style={styles.messageBox}>
            <ThemedText type="small">Cargando productos…</ThemedText>
          </ThemedView>
        )}

        <FlatList
          style={styles.list}
          data={products}
          keyExtractor={(product) => String(product.id)}
          renderItem={({ item }) => <ProductCard product={item} />}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
        />
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
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
  },
  title: {
    paddingVertical: Spacing.four,
  },
  messageBox: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    marginBottom: Spacing.three,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  card: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
  },
  cardBody: {
    flex: 1,
    gap: Spacing.half,
  },
});
