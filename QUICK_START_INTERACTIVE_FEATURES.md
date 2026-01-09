# 🚀 Quick Start Guide - Interactive Features

## Overview
Get your new interactive features up and running in 5 minutes!

---

## ✅ What's Been Added

5 new production-ready components:
1. **QuoteCalculator** - Real-time pricing calculator
2. **EnhancedQuoteModal** - Multi-step quote request form
3. **ServiceComparison** - Side-by-side service comparison
4. **BookingCalendar** - Interactive date range picker
5. **InteractiveFeaturesPage** - Unified page with all tools

---

## 🎯 Option 1: Full Interactive Page (Recommended)

### Step 1: Add to Navigation
Update your `Navbar.tsx` component:

```typescript
// In your nav links
<a href="/quote" className="nav-link">
  Get Quote
</a>

// Or as a button
<button
  onClick={() => window.location.href = '/quote'}
  className="px-6 py-2 bg-primary text-primary-foreground rounded-full"
>
  Get Instant Quote
</button>
```

### Step 2: View the Demo
Simply open in your browser:

```bash
# If using Vite
npm run dev

# Then navigate to
# http://localhost:5173/InteractiveFeaturesDemo.tsx
```

Or import directly in your App.tsx for testing:

```typescript
import InteractiveFeaturesDemo from './InteractiveFeaturesDemo';

// Replace your main component temporarily
export default InteractiveFeaturesDemo;
```

### Step 3: Set Up Routing (If needed)
If you're using React Router:

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InteractiveFeaturesPage from './components/InteractiveFeaturesPage';
import App from './App';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/quote" element={<InteractiveFeaturesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
```

---

## 🎯 Option 2: Individual Component Integration

### Just the Calculator
Add to any page for instant pricing:

```typescript
import QuoteCalculator from './components/QuoteCalculator';

function YourPage() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <QuoteCalculator />
      </div>
    </section>
  );
}
```

### Just the Comparison Tool
Perfect for a "Services" page:

```typescript
import ServiceComparison from './components/ServiceComparison';

function ServicesPage() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 text-center">
          Compare Our Services
        </h2>
        <ServiceComparison />
      </div>
    </section>
  );
}
```

### Just the Calendar
For a "Book Now" page:

```typescript
import BookingCalendar from './components/BookingCalendar';

function BookingPage() {
  const handleDateSelect = (start: Date, end: Date) => {
    console.log('Selected:', start, end);
    // Proceed to quote/booking flow
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <BookingCalendar onDateSelect={handleDateSelect} />
      </div>
    </section>
  );
}
```

---

## 🔗 Component Integrations

### Calculator → Quote Modal
Pre-fill the modal with calculator data:

```typescript
import QuoteCalculator, { QuoteDetails } from './components/QuoteCalculator';
import EnhancedQuoteModal from './components/EnhancedQuoteModal';

function MyPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [quoteData, setQuoteData] = useState<QuoteDetails | null>(null);

  const handleRequestQuote = (details: QuoteDetails) => {
    setQuoteData(details);
    setModalOpen(true);
  };

  return (
    <>
      <QuoteCalculator onRequestQuote={handleRequestQuote} />
      <EnhancedQuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        prefilledQuote={quoteData}
      />
    </>
  );
}
```

### Comparison → Quote Modal
Let users select from comparison and request quote:

```typescript
import ServiceComparison from './components/ServiceComparison';
import EnhancedQuoteModal from './components/EnhancedQuoteModal';

function MyPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const handleSelectService = (serviceName: string) => {
    setSelectedService(serviceName);
    setModalOpen(true);
  };

  return (
    <>
      <ServiceComparison onSelectService={handleSelectService} />
      <EnhancedQuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        prefilledQuote={{
          serviceType: selectedService,
          units: 1,
          duration: 7,
          startDate: '',
          estimatedTotal: 0,
          breakdown: { basePrice: 0, durationCharge: 0, unitCharge: 0, deliveryFee: 0, total: 0 }
        }}
      />
    </>
  );
}
```

---

## 📊 Tracking Analytics

Add tracking to key events:

```typescript
// After npm install @segment/analytics-next or your preferred tool

import { QuoteCalculator } from './components/QuoteCalculator';

function MyPage() {
  const handleQuoteRequest = (details: QuoteDetails) => {
    // Track the event
    analytics.track('Quote Requested', {
      service: details.serviceType,
      units: details.units,
      duration: details.duration,
      total: details.estimatedTotal,
      source: 'calculator'
    });

    // Open modal
    setModalOpen(true);
  };

  return <QuoteCalculator onRequestQuote={handleQuoteRequest} />;
}
```

---

## 🎨 Customization

### Change Pricing
Edit `components/QuoteCalculator.tsx`:

```typescript
const pricingTiers: Record<string, PricingTier> = {
  'Standard Portable Toilet': {
    name: 'Standard Portable Toilet',
    basePrice: 125,        // ← Change base price
    perDayRate: 15,        // ← Change daily rate
    perUnitRate: 125,      // ← Change per-unit rate
    description: '...',
    features: ['...']
  },
  // ... other services
};
```

### Change Delivery Fee Logic
```typescript
// In calculateQuote() function
const deliveryFee = units >= 5 ? 0 : 75;  // ← Modify threshold/amount
```

### Add New Services
1. Add to `pricingTiers` in QuoteCalculator.tsx
2. Add to `services` array in ServiceComparison.tsx
3. Add to `serviceTypes` in EnhancedQuoteModal.tsx

### Style Customization
All components use Tailwind and follow your theme:
- Primary color: `bg-primary text-primary-foreground`
- Secondary: `bg-secondary text-secondary-foreground`
- Cards: `bg-card border-border`

---

## ✅ Verify It's Working

### Test Calculator
1. Open the page
2. Select a service type
3. Adjust units and duration
4. See price update in real-time
5. Click "Request This Quote"
6. Modal should open with pre-filled data

### Test Comparison
1. Click on 2-3 service cards
2. See feature comparison matrix
3. Click "Select" on a service
4. Modal should open

### Test Calendar
1. Click a start date
2. Click an end date
3. See range highlighted
4. See days counter update

### Test Modal Submission
1. Fill out all steps
2. Submit form
3. Check Supabase `leads` table
4. Should see new record

---

## 🐛 Troubleshooting

### Modal Not Opening
```typescript
// Check state
console.log('Modal open state:', modalOpen);

// Ensure AnimatePresence wraps modal
<AnimatePresence>
  {modalOpen && <EnhancedQuoteModal ... />}
</AnimatePresence>
```

### Calculator Not Calculating
```typescript
// Add logging in QuoteCalculator.tsx
const quote = calculateQuote();
console.log('Calculated quote:', quote);
```

### Supabase Errors
```typescript
// Check connection
import { supabase } from './lib/supabase';

// Test query
const { data, error } = await supabase.from('leads').select('*').limit(1);
console.log('Supabase test:', { data, error });
```

### TypeScript Errors
```bash
# Install types if missing
npm install --save-dev @types/react @types/react-dom

# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Common Modifications

### Add Phone Number Field to Calculator
```typescript
// In QuoteCalculator.tsx, add state
const [phoneNumber, setPhoneNumber] = useState('');

// Add input field
<input
  type="tel"
  value={phoneNumber}
  onChange={(e) => setPhoneNumber(e.target.value)}
  className="..."
  placeholder="(555) 123-4567"
/>

// Pass to modal
onRequestQuote?.({
  ...details,
  phoneNumber  // Add to QuoteDetails interface
});
```

### Add Company Field
```typescript
// Already included in EnhancedQuoteModal!
// Just optional - make it required if needed:

<input
  type="text"
  value={company}
  onChange={(e) => setCompany(e.target.value)}
  required  // ← Add this
  className="..."
/>
```

### Block Specific Dates in Calendar
```typescript
// Create blocked dates array
const blockedDates = [
  new Date(2026, 0, 15),  // Jan 15, 2026
  new Date(2026, 0, 16),  // Jan 16, 2026
  new Date(2026, 11, 25), // Dec 25, 2026
];

// Pass to calendar
<BookingCalendar blockedDates={blockedDates} />
```

---

## 🎯 Next Steps

1. **Test in Development**
   ```bash
   npm run dev
   ```

2. **Add to Navigation**
   Link to `/quote` or render InteractiveFeaturesPage

3. **Set Up Analytics**
   Track quote requests, service selections, etc.

4. **Deploy to Production**
   ```bash
   npm run build
   # Deploy build folder to your host
   ```

5. **Monitor Performance**
   - Track conversion rates
   - Gather user feedback
   - Iterate based on data

---

## 📚 Full Documentation

For detailed information, see:
- `INTERACTIVE_FEATURES_GUIDE.md` - Complete technical guide
- `FEATURE_ADDITIONS_SUMMARY.md` - Business impact & features
- Component files - Inline documentation

---

## 🎉 You're All Set!

Your interactive features are ready to drive conversions! 

**Questions?** Check the documentation or review the component code.

**Need help?** All components include detailed inline comments.

---

**Happy Converting! 🚀**
