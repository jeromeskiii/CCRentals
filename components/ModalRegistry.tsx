import { ReactNode } from 'react';
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
  component: React.ComponentType<any>;
  propMapping?: Record<string, string>; // Maps context props to component props
}

const MODAL_REGISTRY: Record<string, ModalConfig> = {
  'service-request': {
    component: ServiceRequestModal,
    propMapping: {
      source: 'props.source' // Maps modal props.source to component source prop
    }
  },
  'enhanced-quote': {
    component: EnhancedQuoteModal,
    propMapping: {
      prefilledQuote: 'props.prefilledQuote'
    }
  },
  'confirmation': {
    component: ConfirmationModal,
    propMapping: {
      title: 'props.title',
      message: 'props.message',
      confirmText: 'props.confirmText',
      cancelText: 'props.cancelText',
      onConfirm: 'props.onConfirm',
      onCancel: 'props.onCancel',
      variant: 'props.variant'
    }
  }
};

/**
 * ModalRegistry component
 * Renders all modals based on their state in ModalManager
 * Place this once at the root level, after all other content
 */
export const ModalRegistry: React.FC = () => {
  const { modals, closeModal } = useModalManager();

  return (
    <>
      {Object.entries(MODAL_REGISTRY).map(([modalId, config]) => {
        const modalState = modals[modalId];
        
        if (!modalState?.open) return null;

        const ModalComponent = config.component;
        
        // Build props for the modal component
        const componentProps: Record<string, any> = {
          open: true,
          onClose: () => closeModal(modalId)
        };

        // Map modal state props to component props
        if (config.propMapping) {
          Object.entries(config.propMapping).forEach(([componentProp, modalPropPath]) => {
            const value = modalState.props[componentProp];
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
