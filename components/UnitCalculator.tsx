import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for the calculator
type EventType = 'wedding' | 'construction' | 'festival' | 'corporate' | 'outdoor' | 'private';

export interface Recommendation {
    type: string;
    quantity: number;
    description: string;
    icon: string;
}

const eventTypeOptions: { value: EventType; label: string; icon: string }[] = [
    { value: 'wedding', label: 'Wedding', icon: '💒' },
    { value: 'construction', label: 'Construction Site', icon: '🏗️' },
    { value: 'festival', label: 'Festival / Concert', icon: '🎪' },
    { value: 'corporate', label: 'Corporate Event', icon: '🏢' },
    { value: 'outdoor', label: 'Outdoor Event', icon: '⛺' },
    { value: 'private', label: 'Private Party', icon: '🎉' },
];

const UnitCalculator: React.FC = () => {
    // Step management
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    // Form state
    const [eventType, setEventType] = useState<EventType | ''>('');
    const [guestCount, setGuestCount] = useState(100);
    const [duration, setDuration] = useState(4);
    const [durationUnit, setDurationUnit] = useState<'hours' | 'days'>('hours');
    const [alcoholServed, setAlcoholServed] = useState(false);
    const [adaRequired, setAdaRequired] = useState(false);
    const [premiumPreferred, setPremiumPreferred] = useState(false);

    // Add-ons
    const [addHandwash, setAddHandwash] = useState(true);
    const [addFencing, setAddFencing] = useState(false);
    const [fencingLength, setFencingLength] = useState(100);
    const [addAttendant, setAddAttendant] = useState(false);

    // Calculate recommendations
    const recommendations = useMemo<Recommendation[]>(() => {
        const recs: Recommendation[] = [];

        // Base calculation: Industry standard is 1 unit per 50 guests for 4 hours
        let baseUnits = Math.ceil(guestCount / 50);

        // Time multiplier
        let timeHours = durationUnit === 'days' ? duration * 8 : duration;
        if (timeHours > 4) {
            baseUnits = Math.ceil(baseUnits * (timeHours / 4));
        }

        // Alcohol increases need by 20%
        if (alcoholServed) {
            baseUnits = Math.ceil(baseUnits * 1.2);
        }

        // Construction sites need more units (1 per 10 workers)
        if (eventType === 'construction') {
            baseUnits = Math.ceil(guestCount / 10);
            if (timeHours > 8) {
                baseUnits = Math.ceil(baseUnits * 1.5);
            }
        }

        // Ensure minimum of 1 unit
        baseUnits = Math.max(1, baseUnits);

        // Premium preference adjustments
        if (premiumPreferred && (eventType === 'wedding' || eventType === 'corporate')) {
            // Use luxury trailers instead
            const trailerUnits = Math.ceil(baseUnits / 3);
            recs.push({
                type: 'Luxury Restroom Trailer',
                quantity: Math.max(1, trailerUnits),
                description: 'Climate-controlled with flushing toilets',
                icon: '🚿'
            });
            // Add some standard units for overflow
            if (guestCount > 100) {
                recs.push({
                    type: 'Deluxe Portable Unit',
                    quantity: Math.ceil(baseUnits / 2),
                    description: 'With fresh water sink',
                    icon: '🚻'
                });
            }
        } else {
            // Standard units
            recs.push({
                type: 'Standard Portable Toilet',
                quantity: baseUnits,
                description: 'Ventilated with hand sanitizer',
                icon: '🚻'
            });
        }

        // ADA units  
        if (adaRequired) {
            const adaCount = Math.max(1, Math.ceil(baseUnits * 0.1)); // 10% ADA
            recs.push({
                type: 'ADA-Compliant Unit',
                quantity: adaCount,
                description: 'Wheelchair accessible with grab bars',
                icon: '♿'
            });
        }

        // Handwash stations
        if (addHandwash) {
            const handwashCount = Math.max(1, Math.ceil(baseUnits / 2));
            recs.push({
                type: 'Handwash Station',
                quantity: handwashCount,
                description: 'Dual sinks with soap and towels',
                icon: '🧼'
            });
        }

        // Fencing
        if (addFencing) {
            recs.push({
                type: 'Temporary Fencing',
                quantity: fencingLength,
                description: 'Linear feet of chainlink fencing',
                icon: '🔗'
            });
        }

        // Attendant
        if (addAttendant && (eventType === 'wedding' || eventType === 'corporate')) {
            recs.push({
                type: 'Restroom Attendant',
                quantity: Math.ceil(timeHours / 4),
                description: '4-hour shifts for premium service',
                icon: '👤'
            });
        }

        return recs;
    }, [eventType, guestCount, duration, durationUnit, alcoholServed, adaRequired, premiumPreferred, addHandwash, addFencing, fencingLength, addAttendant]);

    // Save recommendations to localStorage for SiteMapPlanner
    useEffect(() => {
        if (currentStep === 5 && recommendations.length > 0) {
            localStorage.setItem('calculatorRecommendations', JSON.stringify(recommendations));
        }
    }, [currentStep, recommendations]);

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const canProceed = () => {
        if (currentStep === 1) return eventType !== '';
        return true;
    };

    const resetCalculator = () => {
        setCurrentStep(1);
        setEventType('');
        setGuestCount(100);
        setDuration(4);
        setDurationUnit('hours');
        setAlcoholServed(false);
        setAdaRequired(false);
        setPremiumPreferred(false);
        setAddHandwash(true);
        setAddFencing(false);
        setAddAttendant(false);
    };

    return (
        <section id="calculator" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-sky-600 font-bold uppercase tracking-widest text-sm mb-4">Planning Tool</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">
                        Calculate your sanitation needs
                    </h3>
                    <p className="text-lg text-zinc-600">
                        Answer a few questions and we'll recommend the right equipment for your event or site.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-zinc-50 rounded-[40px] border border-zinc-200 shadow-2xl overflow-hidden">
                        {/* Progress Bar */}
                        <div className="bg-white border-b border-zinc-200 px-8 py-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-zinc-500">Step {currentStep} of {totalSteps}</span>
                                <span className="text-sm font-bold text-sky-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
                            </div>
                            <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-sky-500 to-sky-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                />
                            </div>
                        </div>

                        {/* Step Content */}
                        <div className="p-8 md:p-12 min-h-[400px]">
                            <AnimatePresence mode="wait">
                                {/* Step 1: Event Type */}
                                {currentStep === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h4 className="text-2xl font-bold text-zinc-900 mb-2">What type of event or site?</h4>
                                        <p className="text-zinc-500 mb-8">Select the option that best describes your needs.</p>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {eventTypeOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setEventType(option.value)}
                                                    className={`p-6 rounded-2xl border-2 transition-all text-left ${eventType === option.value
                                                            ? 'border-sky-500 bg-sky-50 shadow-lg'
                                                            : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md'
                                                        }`}
                                                >
                                                    <span className="text-3xl mb-3 block">{option.icon}</span>
                                                    <span className={`font-bold ${eventType === option.value ? 'text-sky-700' : 'text-zinc-900'}`}>
                                                        {option.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Guest Count & Duration */}
                                {currentStep === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h4 className="text-2xl font-bold text-zinc-900 mb-2">
                                            {eventType === 'construction' ? 'Workers & Duration' : 'Guests & Duration'}
                                        </h4>
                                        <p className="text-zinc-500 mb-8">Help us size your setup correctly.</p>

                                        <div className="space-y-10">
                                            {/* Guest/Worker Count */}
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <label className="font-bold text-zinc-900">
                                                        {eventType === 'construction' ? 'Number of Workers' : 'Expected Guests'}
                                                    </label>
                                                    <span className="px-4 py-2 bg-sky-100 text-sky-700 rounded-full font-black text-lg">
                                                        {guestCount}
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="10"
                                                    max="1000"
                                                    step="10"
                                                    value={guestCount}
                                                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                                                    className="w-full h-3 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                                                />
                                                <div className="flex justify-between text-xs text-zinc-400 mt-2">
                                                    <span>10</span>
                                                    <span>500</span>
                                                    <span>1000</span>
                                                </div>
                                            </div>

                                            {/* Duration */}
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <label className="font-bold text-zinc-900">Duration</label>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-4 py-2 bg-sky-100 text-sky-700 rounded-full font-black text-lg">
                                                            {duration}
                                                        </span>
                                                        <select
                                                            value={durationUnit}
                                                            onChange={(e) => setDurationUnit(e.target.value as 'hours' | 'days')}
                                                            className="px-4 py-2 bg-zinc-100 rounded-full font-bold text-zinc-700 cursor-pointer border-0"
                                                        >
                                                            <option value="hours">Hours</option>
                                                            <option value="days">Days</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max={durationUnit === 'hours' ? 24 : 30}
                                                    value={duration}
                                                    onChange={(e) => setDuration(parseInt(e.target.value))}
                                                    className="w-full h-3 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Special Requirements */}
                                {currentStep === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h4 className="text-2xl font-bold text-zinc-900 mb-2">Special Requirements</h4>
                                        <p className="text-zinc-500 mb-8">Select any that apply to your event.</p>

                                        <div className="space-y-4">
                                            {eventType !== 'construction' && (
                                                <button
                                                    onClick={() => setAlcoholServed(!alcoholServed)}
                                                    className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center gap-4 text-left ${alcoholServed
                                                            ? 'border-sky-500 bg-sky-50'
                                                            : 'border-zinc-200 bg-white hover:border-zinc-300'
                                                        }`}
                                                >
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${alcoholServed ? 'bg-sky-500' : 'bg-zinc-100'
                                                        }`}>
                                                        🍺
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-zinc-900">Alcohol will be served</p>
                                                        <p className="text-sm text-zinc-500">Increases unit recommendations by ~20%</p>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${alcoholServed ? 'border-sky-500 bg-sky-500' : 'border-zinc-300'
                                                        }`}>
                                                        {alcoholServed && (
                                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </button>
                                            )}

                                            <button
                                                onClick={() => setAdaRequired(!adaRequired)}
                                                className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center gap-4 text-left ${adaRequired
                                                        ? 'border-sky-500 bg-sky-50'
                                                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${adaRequired ? 'bg-sky-500' : 'bg-zinc-100'
                                                    }`}>
                                                    ♿
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-zinc-900">ADA Compliance Required</p>
                                                    <p className="text-sm text-zinc-500">Includes wheelchair-accessible units</p>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${adaRequired ? 'border-sky-500 bg-sky-500' : 'border-zinc-300'
                                                    }`}>
                                                    {adaRequired && (
                                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </button>

                                            {(eventType === 'wedding' || eventType === 'corporate') && (
                                                <button
                                                    onClick={() => setPremiumPreferred(!premiumPreferred)}
                                                    className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center gap-4 text-left ${premiumPreferred
                                                            ? 'border-sky-500 bg-sky-50'
                                                            : 'border-zinc-200 bg-white hover:border-zinc-300'
                                                        }`}
                                                >
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${premiumPreferred ? 'bg-sky-500' : 'bg-zinc-100'
                                                        }`}>
                                                        ✨
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-zinc-900">Prefer Premium/Luxury</p>
                                                        <p className="text-sm text-zinc-500">Climate-controlled trailers with flushing toilets</p>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${premiumPreferred ? 'border-sky-500 bg-sky-500' : 'border-zinc-300'
                                                        }`}>
                                                        {premiumPreferred && (
                                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 4: Add-ons */}
                                {currentStep === 4 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h4 className="text-2xl font-bold text-zinc-900 mb-2">Optional Add-ons</h4>
                                        <p className="text-zinc-500 mb-8">Enhance your setup with these extras.</p>

                                        <div className="space-y-4">
                                            <button
                                                onClick={() => setAddHandwash(!addHandwash)}
                                                className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center gap-4 text-left ${addHandwash
                                                        ? 'border-emerald-500 bg-emerald-50'
                                                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${addHandwash ? 'bg-emerald-500' : 'bg-zinc-100'
                                                    }`}>
                                                    🧼
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-zinc-900">Handwash Stations</p>
                                                    <p className="text-sm text-zinc-500">Dual sinks with soap and paper towels</p>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${addHandwash ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-300'
                                                    }`}>
                                                    {addHandwash && (
                                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </button>

                                            <div className={`rounded-2xl border-2 transition-all ${addFencing
                                                    ? 'border-emerald-500 bg-emerald-50'
                                                    : 'border-zinc-200 bg-white'
                                                }`}>
                                                <button
                                                    onClick={() => setAddFencing(!addFencing)}
                                                    className="w-full p-6 flex items-center gap-4 text-left"
                                                >
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${addFencing ? 'bg-emerald-500' : 'bg-zinc-100'
                                                        }`}>
                                                        🔗
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-zinc-900">Temporary Fencing</p>
                                                        <p className="text-sm text-zinc-500">Secure your perimeter</p>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${addFencing ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-300'
                                                        }`}>
                                                        {addFencing && (
                                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </button>
                                                {addFencing && (
                                                    <div className="px-6 pb-6">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <label className="text-sm font-bold text-zinc-700">Length needed (ft)</label>
                                                            <span className="px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full font-bold text-sm">
                                                                {fencingLength} ft
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="50"
                                                            max="500"
                                                            step="10"
                                                            value={fencingLength}
                                                            onChange={(e) => setFencingLength(parseInt(e.target.value))}
                                                            className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {(eventType === 'wedding' || eventType === 'corporate') && (
                                                <button
                                                    onClick={() => setAddAttendant(!addAttendant)}
                                                    className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center gap-4 text-left ${addAttendant
                                                            ? 'border-emerald-500 bg-emerald-50'
                                                            : 'border-zinc-200 bg-white hover:border-zinc-300'
                                                        }`}
                                                >
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${addAttendant ? 'bg-emerald-500' : 'bg-zinc-100'
                                                        }`}>
                                                        👤
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-zinc-900">Restroom Attendant</p>
                                                        <p className="text-sm text-zinc-500">Professional service for premium events</p>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${addAttendant ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-300'
                                                        }`}>
                                                        {addAttendant && (
                                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 5: Results */}
                                {currentStep === 5 && (
                                    <motion.div
                                        key="step5"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h4 className="text-2xl font-bold text-zinc-900">Your Recommended Setup</h4>
                                                <p className="text-zinc-500">Based on your {eventTypeOptions.find(e => e.value === eventType)?.label || 'event'} requirements</p>
                                            </div>
                                            <button
                                                onClick={resetCalculator}
                                                className="text-sm text-sky-600 hover:text-sky-700 font-bold"
                                            >
                                                Start Over
                                            </button>
                                        </div>

                                        {/* Summary Card */}
                                        <div className="bg-white rounded-3xl border border-zinc-200 p-6 mb-6">
                                            <div className="grid grid-cols-3 gap-4 text-center mb-6">
                                                <div className="p-4 bg-zinc-50 rounded-2xl">
                                                    <p className="text-3xl font-black text-sky-600">{guestCount}</p>
                                                    <p className="text-xs font-bold text-zinc-500">
                                                        {eventType === 'construction' ? 'Workers' : 'Guests'}
                                                    </p>
                                                </div>
                                                <div className="p-4 bg-zinc-50 rounded-2xl">
                                                    <p className="text-3xl font-black text-sky-600">{duration}</p>
                                                    <p className="text-xs font-bold text-zinc-500">
                                                        {durationUnit === 'hours' ? 'Hours' : 'Days'}
                                                    </p>
                                                </div>
                                                <div className="p-4 bg-zinc-50 rounded-2xl">
                                                    <p className="text-3xl font-black text-sky-600">{recommendations.length}</p>
                                                    <p className="text-xs font-bold text-zinc-500">Items</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {adaRequired && (
                                                    <span className="px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold rounded-full">♿ ADA Compliant</span>
                                                )}
                                                {alcoholServed && (
                                                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">🍺 Alcohol Event</span>
                                                )}
                                                {premiumPreferred && (
                                                    <span className="px-3 py-1 bg-zinc-900 text-white text-xs font-bold rounded-full">✨ Premium</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Recommendations List */}
                                        <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-3xl p-6 text-white mb-6">
                                            <p className="text-sky-200 text-sm font-bold uppercase tracking-widest mb-4">✓ Recommended Setup</p>
                                            <div className="space-y-3">
                                                {recommendations.map((rec, idx) => (
                                                    <div key={idx} className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/20">
                                                        <span className="text-2xl">{rec.icon}</span>
                                                        <div className="flex-1">
                                                            <p className="font-bold">{rec.quantity} × {rec.type}</p>
                                                            <p className="text-sm text-sky-200">{rec.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* CTAs */}
                                        <div className="grid md:grid-cols-4 gap-4">
                                            <button className="p-4 bg-sky-600 text-white font-bold rounded-2xl hover:bg-sky-700 transition-colors flex items-center justify-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Add to Quote
                                            </button>
                                            <button className="p-4 bg-zinc-900 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Schedule Delivery
                                            </button>
                                            <button className="p-4 bg-white text-zinc-900 font-bold rounded-2xl border-2 border-zinc-200 hover:border-zinc-300 transition-colors flex items-center justify-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                Email to Sales Rep
                                            </button>
                                            <a
                                                href="#site-map-planner"
                                                className="p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                </svg>
                                                Plan Site Map
                                            </a>
                                        </div>

                                        <p className="text-center text-sm text-zinc-500 mt-6">
                                            This is an estimate based on industry standards. Our team will confirm final requirements.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Navigation Buttons */}
                        {currentStep < 5 && (
                            <div className="bg-white border-t border-zinc-200 px-8 py-6 flex justify-between">
                                <button
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all ${currentStep === 1
                                            ? 'text-zinc-300 cursor-not-allowed'
                                            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                                        }`}
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={nextStep}
                                    disabled={!canProceed()}
                                    className={`px-8 py-3 rounded-xl font-bold transition-all ${canProceed()
                                            ? 'bg-sky-600 text-white hover:bg-sky-700 shadow-lg shadow-sky-600/30'
                                            : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                                        }`}
                                >
                                    {currentStep === 4 ? 'See Results' : 'Continue'} →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UnitCalculator;
