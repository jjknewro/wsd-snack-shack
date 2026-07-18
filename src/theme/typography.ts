import type { TextStyle } from 'react-native';

export const typography: Record<'appName' | 'title' | 'body' | 'caption', TextStyle> = {
  appName: {
    fontSize: 28,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
  },
};
