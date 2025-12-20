
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultPeople: number;
    defaultHours: number;
    calculatedUnits: number;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, defaultPeople, defaultHours, calculatedUnits }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const { error: supabaseError } = await supabase
                .from('leads')
                .insert([
                    {
                        name,
                        email,
                        phone,
                        estimated_units: calculatedUnits,
                        event_details: { people: defaultPeople, hours: defaultHours }
                    }
                ]);

            if (supabaseError) throw supabaseError;

            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setName('');
                setEmail('');
                setPhone('');
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
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-black text-zinc-900">Save Your Estimate</h3>
                                    <p className="text-zinc-500 text-sm mt-1">
                                        Based on your input, we recommend <strong className="text-sky-600">{calculatedUnits} units</strong>.
                                    </p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
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
                                    <h4 className="text-xl font-bold text-zinc-900 mb-2">Quote Saved!</h4>
                                    <p className="text-zinc-500">We'll be in touch shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Email</label>
                                        <input
                                            required
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                            placeholder="jane@company.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>

                                    {error && (
                                        <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">{error}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 active:scale-[0.98] transition-all shadow-lg shadow-sky-900/20 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                                    >
                                        {isSubmitting ? 'Saving...' : 'Get Custom Quote'}
                                    </button>
                                    <p className="text-xs text-center text-zinc-400 mt-4">
                                        We respect your inbox. No spam, ever.
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

export default QuoteModal;
