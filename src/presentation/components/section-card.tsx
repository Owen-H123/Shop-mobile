import { PropsWithChildren } from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { ThemedText } from '@/presentation/components/themed-text';
import { ThemedView } from '@/presentation/components/themed-view';

type SectionCardProps = PropsWithChildren<{
  title: string;
}>;

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <Animated.View entering={FadeInUp.duration(350)}>
      <ThemedView type="backgroundElement" className="gap-4 rounded-2xl p-6">
        <ThemedText type="smallBold">{title}</ThemedText>
        <View className="gap-4">{children}</View>
      </ThemedView>
    </Animated.View>
  );
}
