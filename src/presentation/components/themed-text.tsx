import { Text, type TextProps } from 'react-native';

import { ThemeColor } from '@/presentation/styles/theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
  className?: string;
};

const TYPE_CLASSNAMES: Record<NonNullable<ThemedTextProps['type']>, string> = {
  default: 'text-base leading-6 font-medium',
  title: 'text-5xl leading-[52px] font-semibold',
  subtitle: 'text-3xl leading-[44px] font-semibold',
  small: 'text-sm leading-5 font-medium',
  smallBold: 'text-sm leading-5 font-bold',
  link: 'text-sm leading-[30px]',
  linkPrimary: 'text-sm leading-[30px] text-[#3c87f7]',
  code: 'font-mono text-xs',
};

const COLOR_CLASSNAMES: Record<ThemeColor, string> = {
  text: 'text-black dark:text-white',
  textSecondary: 'text-muted dark:text-muted-dark',
  background: 'text-black dark:text-white',
  backgroundElement: 'text-black dark:text-white',
  backgroundSelected: 'text-black dark:text-white',
};

export function ThemedText({ className, type = 'default', themeColor = 'text', ...rest }: ThemedTextProps) {
  return (
    <Text
      className={`${TYPE_CLASSNAMES[type]} ${COLOR_CLASSNAMES[themeColor]} ${className ?? ''}`}
      {...rest}
    />
  );
}
