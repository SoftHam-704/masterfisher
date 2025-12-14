import { createContext, useContext, useState, ReactNode } from 'react';

interface FloatingCTAContextType {
    isExpanded: boolean;
    setIsExpanded: (value: boolean) => void;
    openModal: () => void;
    closeModal: () => void;
}

const FloatingCTAContext = createContext<FloatingCTAContextType | undefined>(undefined);

export const FloatingCTAProvider = ({ children }: { children: ReactNode }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const openModal = () => {
        // Scroll to make the button visible first
        window.scrollTo({ top: 400, behavior: 'smooth' });
        // Open the modal after a short delay to allow scroll
        setTimeout(() => setIsExpanded(true), 600);
    };

    const closeModal = () => setIsExpanded(false);

    return (
        <FloatingCTAContext.Provider value={{ isExpanded, setIsExpanded, openModal, closeModal }}>
            {children}
        </FloatingCTAContext.Provider>
    );
};

export const useFloatingCTA = () => {
    const context = useContext(FloatingCTAContext);
    if (context === undefined) {
        throw new Error('useFloatingCTA must be used within a FloatingCTAProvider');
    }
    return context;
};
