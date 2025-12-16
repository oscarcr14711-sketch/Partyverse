import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'user-language';

export const translations = {
    English: {
        settings: 'Settings',
        soundMusic: 'Sound & Music',
        notifications: 'Notifications',
        theme: 'Theme',
        language: 'Language',
        cardBack: 'Card Back Design',
        privacy: 'Privacy',
        about: 'About',
        logOut: 'Log Out',
        close: 'Close',
        chooseAvatar: 'Choose Avatar',
        achievements: 'Achievements',
        recentGames: 'Recent Games',
        quickActions: 'Quick Actions',
        shareProfile: 'Share Profile',
        viewLeaderboard: 'View Leaderboard',
    },
    Español: {
        settings: 'Ajustes',
        soundMusic: 'Sonido y Música',
        notifications: 'Notificaciones',
        theme: 'Tema',
        language: 'Idioma',
        cardBack: 'Diseño de Cartas',
        privacy: 'Privacidad',
        about: 'Acerca de',
        logOut: 'Cerrar Sesión',
        close: 'Cerrar',
        chooseAvatar: 'Elegir Avatar',
        achievements: 'Logros',
        recentGames: 'Juegos Recientes',
        quickActions: 'Acciones Rápidas',
        shareProfile: 'Compartir Perfil',
        viewLeaderboard: 'Ver Tabla de Clasificación',
    },
    Français: {
        settings: 'Paramètres',
        soundMusic: 'Son et Musique',
        notifications: 'Notifications',
        theme: 'Thème',
        language: 'Langue',
        cardBack: 'Dos de Carte',
        privacy: 'Confidentialité',
        about: 'À propos',
        logOut: 'Déconnexion',
        close: 'Fermer',
        chooseAvatar: 'Choisir Avatar',
        achievements: 'Succès',
        recentGames: 'Jeux Récents',
        quickActions: 'Actions Rapides',
        shareProfile: 'Partager Profil',
        viewLeaderboard: 'Voir Classement',
    },
    Deutsch: {
        settings: 'Einstellungen',
        soundMusic: 'Ton & Musik',
        notifications: 'Benachrichtigungen',
        theme: 'Thema',
        language: 'Sprache',
        cardBack: 'Kartenrückseite',
        privacy: 'Datenschutz',
        about: 'Über',
        logOut: 'Abmelden',
        close: 'Schließen',
        chooseAvatar: 'Avatar wählen',
        achievements: 'Erfolge',
        recentGames: 'Kürzliche Spiele',
        quickActions: 'Schnellaktionen',
        shareProfile: 'Profil teilen',
        viewLeaderboard: 'Bestenliste ansehen',
    },
    Italiano: {
        settings: 'Impostazioni',
        soundMusic: 'Suono e Musica',
        notifications: 'Notifiche',
        theme: 'Tema',
        language: 'Lingua',
        cardBack: 'Dorso Carte',
        privacy: 'Privacy',
        about: 'Info',
        logOut: 'Esci',
        close: 'Chiudi',
        chooseAvatar: 'Scegli Avatar',
        achievements: 'Obiettivi',
        recentGames: 'Partite Recenti',
        quickActions: 'Azioni Rapide',
        shareProfile: 'Condividi Profilo',
        viewLeaderboard: 'Vedi Classifica',
    },
    Português: {
        settings: 'Configurações',
        soundMusic: 'Som e Música',
        notifications: 'Notificações',
        theme: 'Tema',
        language: 'Idioma',
        cardBack: 'Verso da Carta',
        privacy: 'Privacidade',
        about: 'Sobre',
        logOut: 'Sair',
        close: 'Fechar',
        chooseAvatar: 'Escolher Avatar',
        achievements: 'Conquistas',
        recentGames: 'Jogos Recentes',
        quickActions: 'Ações Rápidas',
        shareProfile: 'Compartilhar Perfil',
        viewLeaderboard: 'Ver Classificação',
    },
};

export type Language = keyof typeof translations;

export const useLanguage = () => {
    const [language, setLanguage] = useState<Language>('English');

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored && translations[stored as Language]) {
                setLanguage(stored as Language);
            }
        } catch (e) {
            console.error('Failed to load language', e);
        }
    };

    const changeLanguage = async (lang: Language) => {
        setLanguage(lang);
        try {
            await AsyncStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {
            console.error('Failed to save language', e);
        }
    };

    return {
        language,
        setLanguage: changeLanguage,
        t: translations[language],
    };
};
