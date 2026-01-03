import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Product data with enhanced fields
const products = [
    {
        id: 1,
        name: "Standard Portable Toilet",
        category: "portable-toilets",
        tagline: "The Construction Workhorse",
        description: "Ventilated, slip-resistant floors, and ample interior space. Ideal for job sites.",
        image: "/images/standard-portable-toilet.png",
        features: ["Weekly Service", "Anti-slip Floor", "Hand Sanitizer"],
        priceRange: "$85-125/week",
        capacity: "small",
        isAda: false,
        isLuxury: false,
        rating: 4.8,
        reviewCount: 342,
        eventsUsed: 850,
        popular: true,
        eventTypes: ["construction", "festival", "outdoor-event"]
    },
    {
        id: 2,
        name: "Deluxe Unit with Sink",
        category: "portable-toilets",
        tagline: "Hybrid Comfort",
        description: "Features an interior foot-pump sink, soap dispenser, and paper towel holder.",
        image: "/images/deluxe-unit-sink.png",
        features: ["Fresh Water Sink", "Flushable Tank", "Full Mirror"],
        priceRange: "$150-200/week",
        capacity: "small",
        isAda: false,
        isLuxury: true,
        rating: 4.9,
        reviewCount: 278,
        eventsUsed: 620,
        popular: true,
        eventTypes: ["wedding", "corporate", "festival"]
    },
    {
        id: 3,
        name: "ADA Compliant Portable Unit",
        category: "portable-toilets",
        tagline: "Accessible Design",
        description: "Extra-wide doors, grab bars, and lowered fixtures for wheelchair accessibility.",
        image: "/images/standard-portable-toilet.png",
        features: ["Wheelchair Accessible", "Grab Bars", "Extra Space"],
        priceRange: "$125-175/week",
        capacity: "medium",
        isAda: true,
        isLuxury: false,
        rating: 4.9,
        reviewCount: 156,
        eventsUsed: 430,
        popular: false,
        eventTypes: ["wedding", "festival", "corporate", "construction"]
    },
    {
        id: 4,
        name: "2-Stall Luxury Restroom Trailer",
        category: "restroom-trailers",
        tagline: "Premium Experience",
        description: "Climate-controlled trailer with flushing toilets, running water, and elegant finishes.",
        image: "/images/deluxe-unit-sink.png",
        features: ["Climate Control", "Flushing Toilets", "Vanity Mirrors", "Running Water"],
        priceRange: "$450-650/day",
        capacity: "medium",
        isAda: false,
        isLuxury: true,
        rating: 5.0,
        reviewCount: 189,
        eventsUsed: 340,
        popular: true,
        eventTypes: ["wedding", "corporate", "vip-event"]
    },
    {
        id: 5,
        name: "4-Stall Luxury Restroom Trailer",
        category: "restroom-trailers",
        tagline: "Event Excellence",
        description: "Spacious 4-stall trailer perfect for large weddings and corporate events.",
        image: "/images/deluxe-unit-sink.png",
        features: ["4 Private Stalls", "AC/Heating", "Sound System", "Attendant Station"],
        priceRange: "$750-1000/day",
        capacity: "large",
        isAda: true,
        isLuxury: true,
        rating: 5.0,
        reviewCount: 97,
        eventsUsed: 180,
        popular: false,
        eventTypes: ["wedding", "corporate", "vip-event"]
    },
    {
        id: 6,
        name: "Handwash Station",
        category: "handwash",
        tagline: "Multi-User Hygiene",
        description: "Dual-sided portable sinks with foot pumps to promote health on your site.",
        image: "/images/handwash-station.png",
        features: ["Dual Sinks", "Soap/Towels Incl.", "Non-Potable Water"],
        priceRange: "$75-100/week",
        capacity: "small",
        isAda: false,
        isLuxury: false,
        rating: 4.7,
        reviewCount: 215,
        eventsUsed: 920,
        popular: true,
        eventTypes: ["construction", "festival", "outdoor-event", "wedding"]
    },
    {
        id: 7,
        name: "Temporary Chainlink Fence",
        category: "fencing",
        tagline: "Site Security",
        description: "Chainlink fencing and privacy screens to secure your perimeter and assets.",
        image: "/images/temp-chainlink-fence-1.jpg",
        features: ["Panel Fencing", "Privacy Scrim", "Rapid Setup"],
        priceRange: "$5-8/ft/week",
        capacity: "large",
        isAda: false,
        isLuxury: false,
        rating: 4.6,
        reviewCount: 178,
        eventsUsed: 650,
        popular: false,
        eventTypes: ["construction", "festival", "outdoor-event"]
    },
    {
        id: 8,
        name: "Premium Privacy Fence",
        category: "fencing",
        tagline: "Elegant Barrier",
        description: "White vinyl privacy panels for upscale events requiring visual separation.",
        image: "/images/temp-chainlink-fence-2.jpg",
        features: ["White Vinyl", "Wind Resistant", "Elegant Look"],
        priceRange: "$12-18/ft/week",
        capacity: "large",
        isAda: false,
        isLuxury: true,
        rating: 4.8,
        reviewCount: 89,
        eventsUsed: 210,
        popular: false,
        eventTypes: ["wedding", "corporate", "vip-event"]
    }
];

const eventTypes = [
    { value: "", label: "All Event Types" },
    { value: "wedding", label: "Wedding" },
    { value: "construction", label: "Construction" },
    { value: "festival", label: "Festival" },
    { value: "corporate", label: "Corporate Event" },
    { value: "outdoor-event", label: "Outdoor Event" },
    { value: "vip-event", label: "VIP Event" }
];

const categories = [
    { value: "", label: "All Categories" },
    { value: "portable-toilets", label: "Portable Toilets" },
    { value: "restroom-trailers", label: "Restroom Trailers" },
    { value: "handwash", label: "Handwash Stations" },
    { value: "fencing", label: "Fencing" }
];

const capacities = [
    { value: "", label: "Any Capacity" },
    { value: "small", label: "Small (1-50 people)" },
    { value: "medium", label: "Medium (50-200 people)" },
    { value: "large", label: "Large (200+ people)" }
];

const InventoryExplorer: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEventType, setSelectedEventType] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCapacity, setSelectedCapacity] = useState("");
    const [adaOnly, setAdaOnly] = useState(false);
    const [luxuryOnly, setLuxuryOnly] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [quoteItems, setQuoteItems] = useState<number[]>([]);

    // Filter products based on all criteria
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Search filter
            if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            // Event type filter
            if (selectedEventType && !product.eventTypes.includes(selectedEventType)) {
                return false;
            }
            // Category filter
            if (selectedCategory && product.category !== selectedCategory) {
                return false;
            }
            // Capacity filter
            if (selectedCapacity && product.capacity !== selectedCapacity) {
                return false;
            }
            // ADA filter
            if (adaOnly && !product.isAda) {
                return false;
            }
            // Luxury filter
            if (luxuryOnly && !product.isLuxury) {
                return false;
            }
            return true;
        });
    }, [searchQuery, selectedEventType, selectedCategory, selectedCapacity, adaOnly, luxuryOnly]);

    const toggleQuoteItem = (id: number) => {
        setQuoteItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedEventType("");
        setSelectedCategory("");
        setSelectedCapacity("");
        setAdaOnly(false);
        setLuxuryOnly(false);
    };

    const hasActiveFilters = searchQuery || selectedEventType || selectedCategory || selectedCapacity || adaOnly || luxuryOnly;

    return (
        <section id="inventory" className="py-24 bg-zinc-50">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-sky-600 font-bold uppercase tracking-widest text-sm mb-4">Explore Inventory</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">
                        Find the perfect equipment for your event
                    </h3>
                    <p className="text-lg text-zinc-600">
                        Browse our complete catalog of sanitation solutions, restroom trailers, and site equipment.
                    </p>
                </div>

                {/* Trust Signal Banner */}
                <div className="flex flex-wrap justify-center gap-8 mb-12 py-6 px-8 bg-white rounded-2xl border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-zinc-900">500+ Events</p>
                            <p className="text-sm text-zinc-500">Successfully served</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-zinc-900">4.9 Average Rating</p>
                            <p className="text-sm text-zinc-500">From verified customers</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-zinc-900">Same-Day Delivery</p>
                            <p className="text-sm text-zinc-500">When you need it fast</p>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-3xl border border-zinc-200 shadow-lg p-6 md:p-8 mb-10">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search equipment..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-zinc-900 font-medium"
                        />
                    </div>

                    {/* Filter Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <select
                            value={selectedEventType}
                            onChange={(e) => setSelectedEventType(e.target.value)}
                            className="px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-zinc-700 font-medium cursor-pointer"
                        >
                            {eventTypes.map(et => (
                                <option key={et.value} value={et.value}>{et.label}</option>
                            ))}
                        </select>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-zinc-700 font-medium cursor-pointer"
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>

                        <select
                            value={selectedCapacity}
                            onChange={(e) => setSelectedCapacity(e.target.value)}
                            className="px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-zinc-700 font-medium cursor-pointer"
                        >
                            {capacities.map(cap => (
                                <option key={cap.value} value={cap.value}>{cap.label}</option>
                            ))}
                        </select>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setAdaOnly(!adaOnly)}
                                className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all ${adaOnly
                                        ? 'bg-sky-600 text-white'
                                        : 'bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                                    }`}
                            >
                                ♿ ADA
                            </button>
                            <button
                                onClick={() => setLuxuryOnly(!luxuryOnly)}
                                className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all ${luxuryOnly
                                        ? 'bg-sky-600 text-white'
                                        : 'bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                                    }`}
                            >
                                ✨ Luxury
                            </button>
                        </div>
                    </div>

                    {/* Results & View Toggle */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <p className="text-zinc-600">
                                <span className="font-bold text-zinc-900">{filteredProducts.length}</span> products found
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-sky-600 hover:text-sky-700 font-bold underline"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                        <div className="flex bg-zinc-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${viewMode === "grid" ? 'bg-white shadow text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${viewMode === "list" ? 'bg-white shadow text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quote Items Banner */}
                <AnimatePresence>
                    {quoteItems.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-8 p-4 bg-sky-600 text-white rounded-2xl flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-black">
                                    {quoteItems.length}
                                </div>
                                <span className="font-bold">items in your quote</span>
                            </div>
                            <button className="px-6 py-2 bg-white text-sky-600 font-bold rounded-xl hover:bg-sky-50 transition-colors">
                                View Quote →
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Product Grid/List */}
                <motion.div
                    layout
                    className={viewMode === "grid"
                        ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        : "flex flex-col gap-6"
                    }
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`group bg-white rounded-3xl overflow-hidden border border-zinc-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ${viewMode === "list" ? "flex flex-col md:flex-row" : ""
                                    }`}
                            >
                                {/* Image */}
                                <div className={`relative overflow-hidden bg-zinc-100 ${viewMode === "list" ? "md:w-72 aspect-[16/10] md:aspect-auto md:h-auto" : "aspect-[16/10]"
                                    }`}>
                                    <img
                                        src={product.image}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        alt={product.name}
                                    />
                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {product.popular && (
                                            <span className="px-3 py-1 bg-amber-400 text-amber-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                Most Popular
                                            </span>
                                        )}
                                        {product.isAda && (
                                            <span className="px-3 py-1 bg-sky-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                ADA Compliant
                                            </span>
                                        )}
                                        {product.isLuxury && (
                                            <span className="px-3 py-1 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                Premium
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className={`p-6 flex flex-col ${viewMode === "list" ? "flex-1" : ""}`}>
                                    {/* Rating */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-zinc-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-sm font-bold text-zinc-900">{product.rating}</span>
                                        <span className="text-sm text-zinc-400">({product.reviewCount})</span>
                                    </div>

                                    <h4 className="text-xl font-bold text-zinc-900 mb-2">{product.name}</h4>
                                    <p className="text-zinc-500 text-sm leading-relaxed mb-4 flex-grow">
                                        {product.description}
                                    </p>

                                    {/* Features */}
                                    <div className={`flex flex-wrap gap-2 mb-4 ${viewMode === "list" ? "md:mb-0" : ""}`}>
                                        {product.features.slice(0, 3).map((feature, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-full">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Price & CTA */}
                                    <div className={`flex items-center justify-between pt-4 border-t border-zinc-100 ${viewMode === "list" ? "md:pt-0 md:border-0 md:ml-auto md:gap-6" : ""}`}>
                                        <div>
                                            <p className="text-xs text-zinc-400 font-medium">Starting at</p>
                                            <p className="text-lg font-black text-sky-600">{product.priceRange}</p>
                                        </div>
                                        <button
                                            onClick={() => toggleQuoteItem(product.id)}
                                            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all ${quoteItems.includes(product.id)
                                                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                                    : 'bg-zinc-900 text-white hover:bg-sky-600'
                                                }`}
                                        >
                                            {quoteItems.includes(product.id) ? '✓ Added' : 'Add to Quote'}
                                        </button>
                                    </div>

                                    {/* Trust signal */}
                                    <p className="text-xs text-zinc-400 mt-3 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Used at {product.eventsUsed}+ events
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* No Results */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h4 className="text-2xl font-bold text-zinc-900 mb-2">No products found</h4>
                        <p className="text-zinc-500 mb-6">Try adjusting your filters or search query</p>
                        <button
                            onClick={clearFilters}
                            className="px-6 py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default InventoryExplorer;
