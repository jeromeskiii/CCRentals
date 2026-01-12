import { useState, useCallback, useContext, createContext, ReactNode } from 'react';

/**
 * Modal state management with proper ownership boundaries
 *
 * Design principles:
 * - App doesn't know modal implementation details
 * - Modals are decoupled from App state
 * - Scalable to unlimited modal types
 * - Testable in isolation
 */

interface ModalState {
  open: boolean;
  props: Record<string, any>;
}

interface ModalManagerContextValue {
  modals: Record<string, ModalState>;
  openModal: (id: string, props?: Record<string, any>) => void;
  closeModal: (id: string) => void;
  isModalOpen: (id: string) => boolean;
  getModalProps: (id: string) => Record<string, any>;
}

const ModalManagerContext = createContext<ModalManagerContextValue | null>(null);

interface ModalManagerProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages all modal state
 * Place this at the root of your app to enable modal management
 */
export const ModalManagerProvider: React.FC<ModalManagerProviderProps> = ({ children }) => {
  const [modals, setModals] = useState<Record<string, ModalState>>({});

  const openModal = useCallback((id: string, props: Record<string, any> = {}) => {
    setModals((prev) => ({
      ...prev,
      [id]: { open: true, props },
    }));
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals((prev) => ({
      ...prev,
      [id]: { open: false, props: {} },
    }));
  }, []);

  const isModalOpen = useCallback(
    (id: string) => {
      return modals[id]?.open || false;
    },
    [modals]
  );

  const getModalProps = useCallback(
    (id: string) => {
      return modals[id]?.props || {};
    },
    [modals]
  );

  const value: ModalManagerContextValue = {
    modals,
    openModal,
    closeModal,
    isModalOpen,
    getModalProps,
  };

  return <ModalManagerContext.Provider value={value}>{children}</ModalManagerContext.Provider>;
};

/**
 * Optional hook to access modal manager.
 * Returns `null` when used outside ModalManagerProvider.
 */
export const useOptionalModalManager = (): ModalManagerContextValue | null => {
  return useContext(ModalManagerContext);
};

/**
 * Hook to access modal manager
 * Throws error if used outside ModalManagerProvider
 */
export const useModalManager = (): ModalManagerContextValue => {
  const context = useOptionalModalManager();
  if (!context) {
    throw new Error('useModalManager must be used within ModalManagerProvider');
  }
  return context;
};

/**
 * Convenience hook for managing a specific modal
 * Reduces boilerplate for components that only need one modal
 */
export const useModal = (modalId: string) => {
  const { openModal, closeModal, isModalOpen, getModalProps } = useModalManager();

  return {
    isOpen: isModalOpen(modalId),
    open: (props?: Record<string, any>) => openModal(modalId, props),
    close: () => closeModal(modalId),
    props: getModalProps(modalId),
  };
};
