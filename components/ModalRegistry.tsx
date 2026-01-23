import type { ComponentType, FC } from 'react';
import { useModalManager } from '../hooks/useModalManager';
import ServiceRequestModal from './ServiceRequestModal';
import EnhancedQuoteModal from './EnhancedQuoteModal';
import ConfirmationModal from './ConfirmationModal';

/**
 * Modal Registry - Centralized modal rendering
 *
 * Design principles:
 * - Single source of truth for which modals exist
 * - Modals register themselves, App doesn't need to know
 * - Easy to add new modals without touching App
 * - Consistent modal behavior across app
 */

interface ModalConfig {
  component: ComponentType<any>;
  propMapping?: Record<string, string>; // componentProp -> modalState prop key
  openProp?: 'open' | 'isOpen';
}

const MODAL_REGISTRY: Record<string, ModalConfig> = {
  'service-request': {
    component: ServiceRequestModal,
    openProp: 'open',
    propMapping: {
      source: 'source',
    },
  },
  'enhanced-quote': {
    component: EnhancedQuoteModal,
    openProp: 'open',
    propMapping: {
      prefilledQuote: 'prefilledQuote',
    },
  },
  confirmation: {
    component: ConfirmationModal,
    propMapping: {
      title: 'title',
      message: 'message',
      confirmText: 'confirmText',
      cancelText: 'cancelText',
      onConfirm: 'onConfirm',
      onCancel: 'onCancel',
      variant: 'variant',
    },
  },
};

/**
 * ModalRegistry component
 * Renders all modals based on their state in ModalManager
 * Place this once at the root level, after all other content
 */
export const ModalRegistry: FC = () => {
  const { modals, closeModal } = useModalManager();

  return (
    <>
      {Object.entries(MODAL_REGISTRY).map(([modalId, config]) => {
        const modalState = modals[modalId];

        if (!modalState?.open) return null;

        const ModalComponent = config.component;

        // Build props for the modal component
        const componentProps: Record<string, any> = {
          [config.openProp ?? 'isOpen']: modalState.open,
          onClose: () => closeModal(modalId),
        };

        // Map modal state props to component props
        if (config.propMapping) {
          Object.entries(config.propMapping).forEach(([componentProp, modalStateProp]) => {
            const value = modalState.props[modalStateProp];
            if (value !== undefined) {
              componentProps[componentProp] = value;
            }
          });
        }

        return <ModalComponent key={modalId} {...componentProps} />;
      })}
    </>
  );
};

export default ModalRegistry;
