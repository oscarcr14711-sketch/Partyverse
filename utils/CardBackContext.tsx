import React, { createContext, ReactNode, useContext, useState } from 'react';
import { CardBack, getCardBackById } from '../data/card-backs';

interface CardBackContextType {
    selectedCardBackId: string;
    selectedCardBack: CardBack;
    setCardBack: (id: string) => void;
}

const CardBackContext = createContext<CardBackContextType | undefined>(undefined);

export const CardBackProvider = ({ children }: { children: ReactNode }) => {
    const [selectedCardBackId, setSelectedCardBackId] = useState('default');

    const selectedCardBack = getCardBackById(selectedCardBackId);

    const setCardBack = (id: string) => {
        setSelectedCardBackId(id);
    };

    return (
        <CardBackContext.Provider value={{ selectedCardBackId, selectedCardBack, setCardBack }}>
            {children}
        </CardBackContext.Provider>
    );
};

export const useCardBack = (): CardBackContextType => {
    const context = useContext(CardBackContext);
    if (!context) {
        throw new Error('useCardBack must be used within a CardBackProvider');
    }
    return context;
};
