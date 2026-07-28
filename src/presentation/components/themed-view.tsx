import { View, type ViewProps } from 'react-native';

import { ThemeColor } from '@/presentation/styles/theme';

export type ThemedViewProps = ViewProps & {
  type?: ThemeColor;
  className?: string;
};

const BACKGROUND_CLASSNAMES: Record<ThemeColor, string> = {
  background: 'bg-white dark:bg-black',
  backgroundElement: 'bg-surface dark:bg-surface-dark',
  backgroundSelected: 'bg-surface-selected dark:bg-surface-selected-dark',
  text: 'bg-black dark:bg-white',
  textSecondary: 'bg-muted dark:bg-muted-dark',
};

export function ThemedView({ className, type = 'background', ...rest }: ThemedViewProps) {
  return <View className={`${BACKGROUND_CLASSNAMES[type]} ${className ?? ''}`} {...rest} />;
}
