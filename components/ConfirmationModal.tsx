import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'danger'
}) => {
    const variantStyles = {
        danger: {
            confirm: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            icon: '⚠️',
            bg: 'bg-destructive/10 text-destructive'
        },
        warning: {
            confirm: 'bg-amber-600 text-white hover:bg-amber-700',
            icon: '⚠️',
            bg: 'bg-amber-50 text-amber-600'
        },
        info: {
            confirm: 'bg-primary text-primary-foreground hover:bg-primary/90',
            icon: 'ℹ️',
            bg: 'bg-primary/10 text-primary'
        }
    };

    const styles = variantStyles[variant];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                    >
                        <div className="p-8">
                            {/* Icon */}
                            <div className={`w-16 h-16 ${styles.bg} rounded-2xl flex items-center justify-center text-3xl mb-6`}>
                                {styles.icon}
                            </div>

                            {/* Content */}
                            <h3
                                id="modal-title"
                                className="text-2xl font-black text-foreground mb-3"
                            >
                                {title}
                            </h3>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                {message}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/80 transition-colors"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className={`flex-1 px-6 py-3 font-bold rounded-xl transition-colors ${styles.confirm}`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
