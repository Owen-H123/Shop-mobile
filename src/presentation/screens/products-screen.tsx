import { Image } from 'expo-image';
import { FlatList, RefreshControl, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/presentation/components/themed-text';
import { ThemedView } from '@/presentation/components/themed-view';
import { useProducts } from '@/presentation/hooks/use-products';
import { MaxContentWidth } from '@/presentation/styles/theme';
import { Product } from '@/domain/entities/product';

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 40).duration(300)}>
      <ThemedView type="backgroundElement" className="flex-row items-center gap-4 rounded-2xl p-4">
        <Image source={{ uri: product.image }} style={{ width: 64, height: 64 }} contentFit="contain" />
        <View className="flex-1 gap-0.5">
          <ThemedText type="smallBold" numberOfLines={2}>
            {product.title}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {product.category}
          </ThemedText>
          <ThemedText type="default">${product.price.toFixed(2)}</ThemedText>
        </View>
      </ThemedView>
    </Animated.View>
  );
}

export function ProductsScreen() {
  const { products, loading, error, refetch } = useProducts();

  return (
    <SafeAreaView className="flex-1">
      <ThemedView className="w-full flex-1 self-center px-6" style={{ maxWidth: MaxContentWidth }}>
        <Animated.View entering={FadeInUp.duration(350)}>
          <ThemedText type="subtitle" className="py-6">
            Productos
          </ThemedText>
        </Animated.View>

        {error && (
          <ThemedView type="backgroundElement" className="mb-4 rounded-2xl p-6">
            <ThemedText type="small">{error}</ThemedText>
          </ThemedView>
        )}

        {!error && loading && products.length === 0 && (
          <ThemedView type="backgroundElement" className="mb-4 rounded-2xl p-6">
            <ThemedText type="small">Cargando productos…</ThemedText>
          </ThemedView>
        )}

        <FlatList
          className="flex-1"
          data={products}
          keyExtractor={(product) => String(product.id)}
          renderItem={({ item, index }) => <ProductCard product={item} index={index} />}
          contentContainerStyle={{ gap: 16, paddingBottom: 32 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
        />
      </ThemedView>
    </SafeAreaView>
  );
}
