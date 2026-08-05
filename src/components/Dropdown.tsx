import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/colors';
import { textStyles } from '../theme/textStyles';

interface DropdownProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  accentColor?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options = [],
  selected,
  onSelect,
  accentColor,
}) => {
  const { colors } = useTheme();
  const activeAccent = accentColor || colors.primary;
  const [visible, setVisible] = useState(false);
  const isSelectedFiltered = options && options.length > 0 && selected !== options[0];

  return (
    <>
      <TouchableOpacity
        style={[
          styles.trigger,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderColor: isSelectedFiltered ? activeAccent : colors.cardBorder,
          },
        ]}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.triggerLabel, { color: colors.textMuted }]}>{label}</Text>
        <View style={styles.triggerValueRow}>
          <Text
            style={[
              styles.triggerValue,
              { color: isSelectedFiltered ? activeAccent : colors.textPrimary },
            ]}
            numberOfLines={1}
          >
            {selected}
          </Text>
          <Ionicons
            name={visible ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={isSelectedFiltered ? activeAccent : colors.textMuted}
          />
        </View>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setVisible(false)} />
          <View style={[styles.sheet, { backgroundColor: colors.surfaceContainer, borderColor: colors.cardBorder }]}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.textMuted }]}>{label}</Text>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => {
                const isSelected = item === selected;
                return (
                  <TouchableOpacity
                    style={[styles.option, { borderBottomColor: colors.divider }]}
                    onPress={() => {
                      onSelect(item);
                      setVisible(false);
                    }}
                  >
                    <Text style={[styles.optionText, { color: isSelected ? activeAccent : colors.textPrimary }]}>
                      {item}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={18} color={activeAccent} />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flex: 1,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  triggerLabel: {
    ...textStyles.labelCaps,
    fontSize: 9,
    lineHeight: 11,
    marginBottom: 1,
  },
  triggerValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerValue: {
    ...textStyles.bodyMd,
    fontSize: 13,
    lineHeight: 15,
    flex: 1,
    marginRight: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    maxHeight: '60%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  sheetTitle: {
    ...textStyles.labelCaps,
    fontSize: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 1,
  },
  optionText: {
    ...textStyles.bodyMd,
    fontSize: 15,
  },
});