import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/colors';
import { textStyles } from '../theme/textStyles';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'PORTAL AÇILIYOR...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...textStyles.labelCaps,
    color: colors.primary,
    marginTop: spacing.xs,
  },
});
