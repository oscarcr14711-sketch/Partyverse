import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { playSound } from '../utils/SoundManager';

interface RulesModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    accentColor?: string;
}

export function RulesModal({
    visible,
    onClose,
    title = 'How to Play',
    children,
    accentColor = '#4A90E2'
}: RulesModalProps) {
    // Play sound when modal opens
    useEffect(() => {
        if (visible) {
            playSound('ui.modalOpen');
        }
    }, [visible]);

    const handleClose = () => {
        playSound('ui.modalClose');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: accentColor }]}>{title}</Text>
                        <TouchableOpacity onPress={handleClose}>
                            <Ionicons name="close" size={24} color={accentColor} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScroll}>
                        {children}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#2C2C2E',
        borderRadius: 20,
        maxHeight: '70%',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    modalScroll: {
        padding: 20,
    },
});

// Helper components for consistent rule formatting
export function RuleSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <>
            <Text style={ruleSectionStyles.sectionTitle}>{title}</Text>
            <Text style={ruleSectionStyles.ruleText}>{children}</Text>
        </>
    );
}

const ruleSectionStyles = StyleSheet.create({
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 8,
    },
    ruleText: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 8,
    },
});

