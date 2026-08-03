import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface BadgeProps {
  status: string;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status.toLowerCase()) {
      case 'alive':
        return {
          dotColor: colors.statusAlive,
          bgColor: colors.statusAliveBg,
          textColor: colors.statusAlive,
        };
      case 'dead':
        return {
          dotColor: colors.statusDead,
          bgColor: colors.statusDeadBg,
          textColor: colors.statusDead,
        };
      default:
        return {
          dotColor: colors.statusUnknown,
          bgColor: colors.statusUnknownBg,
          textColor: colors.statusUnknown,
        };
    }
  };

  const badgeTheme = getBadgeStyle();

  return (
    <View style={[styles.container, { backgroundColor: badgeTheme.bgColor }]}>
      <View style={[styles.dot, { backgroundColor: badgeTheme.dotColor }]} />
      <Text style={[styles.text, { color: badgeTheme.textColor }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    ...typography.badge,
    textTransform: 'capitalize',
  },
});
