import React, { useId, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { leadSubmissionSchema } from '../lib/validation';
import { useModalA11y } from '../lib/useModalA11y';

interface ServiceRequestModalProps {
    open: boolean;
    onClose: () => void;
    source: string | null;
}

const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({ open, onClose, source }) => {
    const idPrefix = useId();
    const titleId = `${idPrefix}-service-request-title`;
    const nameId = `${idPrefix}-name`;
    const phoneId = `${idPrefix}-phone`;
    const emailId = `${idPrefix}-email`;
    const serviceTypeId = `${idPrefix}-service-type`;
    const timeWindowId = `${idPrefix}-time-window`;
    const emergencyId = `${idPrefix}-emergency`;
    const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [serviceType, setServiceType] = useState('Standard Portable Restroom');
    const [isEmergency, setIsEmergency] = useState(false);
    const [timeWindow, setTimeWindow] = useState('ASAP');
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
    const [honeypot, setHoneypot] = useState('');

    const { modalRef } = useModalA11y({ isOpen: open, onClose });

    // Clear timeout on unmount
    useEffect(() => {
        return () => {
            if (successTimeoutRef.current) {
                clearTimeout(successTimeoutRef.current);
            }
        };
    }, []);

    const serviceOptions = [
        "Standard Portable Restroom",
        "ADA Compliant Restroom",
        "Flushable Restroom",
        "Luxury Restroom Trailer",
        "Hand Wash Station",
        "Holding Tank",
        "Other"
    ];

    const timeWindowOptions = [
        "ASAP",
        "Morning",
        "Afternoon",
        "Evening"
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        // Check honeypot field (bot detection)
        if (honeypot) {
            console.warn('Bot detected via honeypot');
            return;
        }

        // Validate form
        const result = leadSubmissionSchema.safeParse({
            name: name.trim(),
            email: email ? email.toLowerCase().trim() : undefined,
            phone: phone.replace(/\D/g, ''),
            service_type: serviceType,
            is_emergency: isEmergency,
            preferred_time_window: timeWindow,
            source: source || 'unknown',
            status: 'new'
        });

        if (!result.success) {
            const errors: { name?: string; email?: string; phone?: string } = {};
            result.error.issues.forEach(err => {
                if (err.path[0] === 'name') errors.name = err.message;
                if (err.path[0] === 'email') errors.email = err.message;
                if (err.path[0] === 'phone') errors.phone = err.message;
            });
            setFieldErrors(errors);
            return;
        }

        setIsSubmitting(true);

        try {
            await api.leads.create(result.data);

            setIsSuccess(true);
            successTimeoutRef.current = setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setName('');
                setEmail('');
                setPhone('');
                setIsEmergency(false);
                setTimeWindow('ASAP');
                setHoneypot('');
                setFieldErrors({});
            }, 3000);
        } catch (err) {
            console.error('Submission error:', err);
            setError('Something went wrong. Please try again or call us directly.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        ref={modalRef}
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        tabIndex={-1}
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 id={titleId} className="text-2xl font-black text-zinc-900">Request Service</h3>
                                    <p className="text-zinc-500 text-sm mt-1">
                                        We'll get back to you within 60 seconds.
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                                    aria-label="Close dialog"
                                >
                                    <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {isSuccess ? (
                                <div className="py-12 text-center">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h4 className="text-xl font-bold text-zinc-900 mb-2">Got it!</h4>
                                    <p className="text-zinc-500">We'll call you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor={nameId} className="block text-xs font-bold uppercase text-zinc-500 mb-1">Name <span className="text-red-500">*</span></label>
                                        <input
                                            id={nameId}
                                            required
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className={`w-full px-4 py-3 bg-zinc-50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${
                                                fieldErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 focus:ring-sky-500'
                                            }`}
                                            placeholder="Jane Doe"
                                            disabled={isSubmitting}
                                        />
                                        {fieldErrors.name && (
                                            <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor={phoneId} className="block text-xs font-bold uppercase text-zinc-500 mb-1">Phone <span className="text-red-500">*</span></label>
                                        <input
                                            id={phoneId}
                                            required
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className={`w-full px-4 py-3 bg-zinc-50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${
                                                fieldErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 focus:ring-sky-500'
                                            }`}
                                            placeholder="(555) 123-4567"
                                            disabled={isSubmitting}
                                        />
                                        {fieldErrors.phone && (
                                            <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor={emailId} className="block text-xs font-bold uppercase text-zinc-500 mb-1">Email</label>
                                        <input
                                            id={emailId}
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`w-full px-4 py-3 bg-zinc-50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${
                                                fieldErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 focus:ring-sky-500'
                                            }`}
                                            placeholder="jane@company.com (optional)"
                                            disabled={isSubmitting}
                                        />
                                        {fieldErrors.email && (
                                            <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.email}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label htmlFor={serviceTypeId} className="block text-xs font-bold uppercase text-zinc-500 mb-1">Service Type</label>
                                            <select
                                                id={serviceTypeId}
                                                value={serviceType}
                                                onChange={(e) => setServiceType(e.target.value)}
                                                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:border-transparent focus:ring-sky-500 outline-none transition-all appearance-none"
                                            >
                                                {serviceOptions.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                             <label htmlFor={timeWindowId} className="block text-xs font-bold uppercase text-zinc-500 mb-1">Preferred Time</label>
                                             <select
                                                id={timeWindowId}
                                                value={timeWindow}
                                                onChange={(e) => setTimeWindow(e.target.value)}
                                                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:border-transparent focus:ring-sky-500 outline-none transition-all appearance-none"
                                            >
                                                {timeWindowOptions.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
                                        <input 
                                            type="checkbox"
                                            id={emergencyId}
                                            checked={isEmergency}
                                            onChange={(e) => setIsEmergency(e.target.checked)}
                                            className="w-5 h-5 text-red-600 rounded focus:ring-red-500 border-gray-300"
                                        />
                                        <label htmlFor={emergencyId} className="text-sm font-bold text-red-800">
                                            This is an emergency request
                                        </label>
                                    </div>

                                    {/* Honeypot field for bot detection */}
                                    <input
                                        type="text"
                                        name="website"
                                        value={honeypot}
                                        onChange={(e) => setHoneypot(e.target.value)}
                                        className="hidden"
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />

                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                            <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                                                <span>⚠️</span>
                                                {error}
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 active:scale-[0.98] transition-all shadow-lg shadow-sky-900/20 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            isEmergency ? 'Request Emergency Service' : 'Request Service'
                                        )}
                                    </button>
                                     <p className="text-xs text-center text-zinc-400 mt-4">
                                        We respect your privacy.
                                    </p>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ServiceRequestModal;
