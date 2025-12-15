import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Language, translations } from '../translations';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => Promise<void>;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@partyverse_language';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>('en');

    // Load saved language on mount
    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
            if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es' || savedLanguage === 'fr')) {
                setLanguageState(savedLanguage as Language);
            }
        } catch (error) {
            console.error('Error loading language:', error);
        }
    };

    const setLanguage = async (lang: Language) => {
        try {
            await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
            setLanguageState(lang);
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    // Translation function - supports nested keys like 'common.close'
    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key} for language: ${language}`);
                return key; // Return key if translation not found
            }
        }

        return typeof value === 'string' ? value : key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
