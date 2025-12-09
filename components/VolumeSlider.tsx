import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VolumeSliderProps {
    value: number;
    onValueChange: (value: number) => void;
    label: string;
    icon: string;
    color?: string;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({
    value,
    onValueChange,
    label,
    icon,
    color = '#667eea',
}) => {
    const steps = [0, 25, 50, 75, 100];

    const handleDecrease = () => {
        const currentIndex = steps.indexOf(value);
        if (currentIndex > 0) {
            onValueChange(steps[currentIndex - 1]);
        }
    };

    const handleIncrease = () => {
        const currentIndex = steps.indexOf(value);
        if (currentIndex < steps.length - 1) {
            onValueChange(steps[currentIndex + 1]);
        }
    };

    const handleStepPress = (step: number) => {
        onValueChange(step);
    };

    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <Ionicons name={icon as any} size={22} color={color} />
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.valueText}>{value}%</Text>
            </View>
            <View style={styles.sliderRow}>
                <TouchableOpacity
                    onPress={handleDecrease}
                    style={[styles.controlButton, value === 0 && styles.controlButtonDisabled]}
                    disabled={value === 0}
                >
                    <Ionicons name="remove" size={20} color={value === 0 ? '#ccc' : color} />
                </TouchableOpacity>

                <View style={styles.stepsContainer}>
                    {steps.map((step, index) => (
                        <TouchableOpacity
                            key={step}
                            onPress={() => handleStepPress(step)}
                            style={styles.stepWrapper}
                        >
                            <View
                                style={[
                                    styles.stepDot,
                                    step <= value && { backgroundColor: color },
                                    step > value && styles.stepDotInactive,
                                ]}
                            />
                            {index < steps.length - 1 && (
                                <View
                                    style={[
                                        styles.stepLine,
                                        step < value && { backgroundColor: color },
                                        step >= value && styles.stepLineInactive,
                                    ]}
                                />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    onPress={handleIncrease}
                    style={[styles.controlButton, value === 100 && styles.controlButtonDisabled]}
                    disabled={value === 100}
                >
                    <Ionicons name="add" size={20} color={value === 100 ? '#ccc' : color} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
        fontWeight: '500',
    },
    valueText: {
        fontSize: 14,
        color: '#667eea',
        fontWeight: 'bold',
        minWidth: 40,
        textAlign: 'right',
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    controlButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlButtonDisabled: {
        backgroundColor: '#fafafa',
    },
    stepsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
        height: 30,
    },
    stepWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#667eea',
    },
    stepDotInactive: {
        backgroundColor: '#ddd',
    },
    stepLine: {
        flex: 1,
        height: 4,
        backgroundColor: '#667eea',
        marginHorizontal: 2,
    },
    stepLineInactive: {
        backgroundColor: '#ddd',
    },
});

export default VolumeSlider;
