# CCRentals Website Template

A clean, trustworthy website template for Coastal Clean Rentals with a professional design system.

## Quick Start

To use this template:

1. **Replace the App** - Copy contents from `AppTemplate.tsx` to `App.tsx`
2. **Update Imports** - Ensure imports point to template components
3. **Customize Content** - Update copy, images, and data as needed

```tsx
// In App.tsx, update imports:
import AppTemplate from './AppTemplate';

// Replace the App component with:
export default AppTemplate;
```

## Design System

### Theme Variables

The template uses OKLCH color space for consistent, accessible colors:

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary` | `oklch(0.7227 0.1920 149.5793)` | Teal/aqua brand color |
| `--background` | `oklch(0.9751 0.0127 244.2507)` | Very light blue-gray |
| `--foreground` | `oklch(0.3729 0.0306 259.7328)` | Dark text |
| `--card` | `oklch(1.0000 0 0)` | Pure white cards |
| `--radius` | `0.5rem` | Consistent border radius |

### Typography

- **Sans:** DM Sans (headings, body)
- **Serif:** Lora (quotes, emphasis)
- **Mono:** IBM Plex Mono (technical data)

### Shadows

Subtle shadows for depth without visual noise:

```css
--shadow-sm: 0px 1px 2px hsl(0 0% 0% / 0.10);
--shadow: 0px 4px 8px -1px hsl(0 0% 0% / 0.10);
--shadow-md: 0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 2px 4px -2px hsl(0 0% 0% / 0.10);
--shadow-lg: 0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 4px 6px -2px hsl(0 0% 0% / 0.10);
```

## Component Library

### Template Components (`components/template/`)

| Component | Purpose | Props |
|-----------|---------|-------|
| `Hero.tsx` | Main hero section with animations | `openLeadModal(source)` |
| `Navbar.tsx` | Navigation with scroll effects | `openLeadModal(source)` |
| `ServicesInventory.tsx` | Services + rental inventory | None |
| `TrustSignals.tsx` | Certifications, metrics, trust | None |
| `Reviews.tsx` | Testimonials with stats | None |
| `ServiceAreas.tsx` | Coverage map and areas | None |
| `CTASection.tsx` | Final call-to-action | `openLeadModal(source)` |
| `Footer.tsx` | Site footer with links | None |

### Animation

Uses **Framer Motion** for scroll-triggered animations:

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
  Content
</motion.div>
```

## Content Structure

### Services & Inventory

The `ServicesInventory` component combines:

1. **Service Lines** (top section)
   - Standard Turnover (75-point checklist)
   - Emergency Response (24/7, <2hr response)
   - Industry Specifics (Construction, Weddings, Agriculture, Disaster Relief)

2. **Rental Inventory** (bottom section, tabbed)
   - Standard Units (Portable, Deluxe, ADA)
   - Luxury Trailers (2-stall, 4-stall)
   - Site Equipment (Handwash, Fencing)

### Service Areas

Counties: Los Angeles, Orange, Ventura, San Bernardino, San Diego, Riverside, Santa Barbara

Cities: Long Beach, Malibu, Anaheim, Huntington Beach, Inland Empire

### Trust Signals

- **Certifications:** ISO 9001, OSHA Compliant
- **Speed:** Same-Day Delivery, <2hr Emergency Response
- **Quality:** 4.9/5 Average Cleaning Score, Sanitation Excellence Guaranteed
- **Volume:** 12k+ Turnovers, 100+ Trucks

### Reviews

Featured testimonials:
- Marcello D. (Superhost): "Level of detail is unmatched..."
- Elena R. (Property Manager): "Reliability was my biggest pain point..."

## Customization

### Colors

Update in `index.css`:

```css
:root {
  --primary: oklch(0.7227 0.1920 149.5793); /* Change this for different brand color */
}
```

### Fonts

Update in `index.css`:

```css
:root {
  --font-sans: "Your Font", sans-serif;
  --font-serif: "Your Font", serif;
  --font-mono: "Your Font", monospace;
}
```

### Images

Replace placeholder images in components:
- Hero: `Hero.tsx` line 54 - construction site image
- ServiceAreas: `ServiceAreas.tsx` - SVG map visualization

## Accessibility

All components meet WCAG 2.1 AA:

- Semantic HTML structure
- Keyboard navigation support
- Focus indicators on interactive elements
- Reduced motion support via `prefers-reduced-motion`
- Sufficient color contrast ratios

## File Structure

```
CCRentals/
├── components/
│   └── template/
│       ├── Hero.tsx
│       ├── Navbar.tsx
│       ├── ServicesInventory.tsx
│       ├── TrustSignals.tsx
│       ├── Reviews.tsx
│       ├── ServiceAreas.tsx
│       ├── CTASection.tsx
│       └── Footer.tsx
├── AppTemplate.tsx
├── index.css
└── TEMPLATE_README.md
```

## Integration Notes

### Existing Modal

The template uses the existing `ServiceRequestModal` component. Ensure it's properly configured in Supabase.

### Animations

The template uses:
- **Framer Motion** for scroll animations
- **GSAP** for Hero parallax effects (existing code)

Both libraries are already installed.

### Dark Mode

The template includes dark mode CSS variables. To enable dark mode toggle:

1. Add dark mode class to HTML
2. Update `tailwind.config.js` darkMode setting
3. Add toggle button to Navbar
