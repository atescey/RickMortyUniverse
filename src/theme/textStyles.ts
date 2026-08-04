import { TextStyle } from 'react-native';

export const textStyles: Record<string, TextStyle> = {
  headlineXl: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -0.4,
  },
  headlineLg: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.3,
  },
  headlineMd: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 24,
    lineHeight: 32,
  },
  bodyLg: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    lineHeight: 28,
  },
  bodyMd: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  labelCaps: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  monoData: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 14,
    lineHeight: 20,
  },
};
