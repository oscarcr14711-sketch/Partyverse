import { StyleSheet } from 'react-native';

/**
 * Estilos compartidos para headers de pantallas
 * Usar estos estilos para mantener consistencia en toda la app
 */
export const sharedHeaderStyles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    headerWithBackOnly: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    headerTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: '700',
        flex: 1,
        textAlign: 'center',
    },
    spacer: {
        width: 40, // Same width as back button for centering
    },
});
