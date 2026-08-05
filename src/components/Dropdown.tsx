import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme/colors';
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
    accentColor = colors.primary,
}) => {
    const [visible, setVisible] = useState(false);
    const isSelectedFiltered = options && options.length > 0 && selected !== options[0];

    return (
        <>
            <TouchableOpacity
                style={[styles.trigger, isSelectedFiltered && { borderColor: accentColor }]}
                onPress={() => setVisible(true)}
                activeOpacity={0.8}
            >
                <Text style={styles.triggerLabel}>{label}</Text>
                <View style={styles.triggerValueRow}>
                    <Text
                        style={[
                            styles.triggerValue,
                            isSelectedFiltered && { color: accentColor },
                        ]}
                        numberOfLines={1}
                    >
                        {selected}
                    </Text>
                    <Ionicons
                        name={visible ? 'chevron-up' : 'chevron-down'}
                        size={14}
                        color={isSelectedFiltered ? accentColor : colors.textMuted}
                    />
                </View>
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
                <View style={styles.overlay}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={() => setVisible(false)} />
                    <View style={styles.sheet}>
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>{label}</Text>
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
                                        style={styles.option}
                                        onPress={() => {
                                            onSelect(item);
                                            setVisible(false);
                                        }}
                                    >
                                        <Text style={[styles.optionText, isSelected && { color: accentColor }]}>
                                            {item}
                                        </Text>
                                        {isSelected && <Ionicons name="checkmark" size={18} color={accentColor} />}
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
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        paddingHorizontal: spacing.sm,
        paddingVertical: 3,
    },
    triggerLabel: {
        ...textStyles.labelCaps,
        fontSize: 9,
        lineHeight: 11,
        color: colors.textMuted,
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
        color: colors.textPrimary,
        flex: 1,
        marginRight: 4,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: colors.surfaceContainer,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.cardBorder,
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
        color: colors.textMuted,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    optionText: {
        ...textStyles.bodyMd,
        fontSize: 15,
        color: colors.textPrimary,
    },
});