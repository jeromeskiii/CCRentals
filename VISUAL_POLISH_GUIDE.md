# Visual Polish Guide - CCRentals Template

## 🎭 Animation & Interaction Patterns

### Button Interactions
```
Default State:
  - bg-primary
  - shadow-lg

Hover State:
  - bg-primary/90
  - scale(1.05)
  - shadow-xl

Active State:
  - scale(0.95)
  - Quick snap back

Timing:
  - transition: all 0.3s ease-out
```

### Card Hover Effects

**Service Cards** (Light lift)
```
Hover:
  - scale: 1.02
  - translateY: -4px
  - shadow: lg → xl
  - border-color: primary/30
  - duration: 300ms
```

**Review Cards** (Medium lift)
```
Hover:
  - translateY: -8px
  - shadow: xl → 2xl
  - duration: 300ms
  - easing: easeOut
```

**Metric Cards** (Subtle lift)
```
Hover:
  - scale: 1.03
  - translateY: -4px
  - shadow: sm → xl
  - duration: 300ms
```

---

## 📐 Responsive Spacing System

### Section Padding Pattern
```
Mobile (base):     py-16  (64px)
Small (640px+):    py-20  (80px)
Medium (768px+):   py-24  (96px)
Large (1024px+):   py-24  (maintained)
```

### Container Padding
```
Mobile (base):     px-4   (16px)
Small (640px+):    px-6   (24px)
Desktop:           px-6   (maintained)
```

### Gap Progression
```
Mobile:    gap-4   (16px)
Small:     gap-6   (24px)
Medium:    gap-8   (32px)
```

---

## 🔤 Typography Scale

### Heading Hierarchy
```
Hero H1:
  text-4xl (36px)     [mobile]
  sm:text-5xl (48px)  [640px+]
  md:text-6xl (60px)  [768px+]
  lg:text-7xl (72px)  [1024px+]

Section H2:
  text-3xl (30px)     [mobile]
  sm:text-4xl (36px)  [640px+]
  md:text-5xl (48px)  [768px+]

Section H3:
  text-xl (20px)      [mobile]
  sm:text-2xl (24px)  [640px+]
```

### Body Text
```
Base paragraph:
  text-base (16px)    [mobile]
  sm:text-lg (18px)   [640px+]
  md:text-xl (20px)   [768px+]

Small text:
  text-xs (12px)      [mobile]
  sm:text-sm (14px)   [640px+]
```

---

## 🎨 Color Usage Patterns

### Interactive Elements
```
Primary Button:
  bg-primary
  text-primary-foreground
  hover:bg-primary/90
  focus:ring-primary

Secondary Button:
  bg-secondary
  text-secondary-foreground
  border-border
  hover:bg-secondary/80

Link Hover:
  text-muted-foreground → text-primary
```

### Background Layers
```
Page Background:    bg-background
Section Alt:        bg-secondary/30
Card:               bg-card
Overlay:            bg-foreground (for footer)
```

---

## ✨ Animation Timing Reference

### Duration Scale
```
Instant:    0ms     (state changes)
Fast:       150ms   (button clicks)
Normal:     300ms   (card hovers, nav)
Slow:       500ms   (section reveals)
Slower:     800ms   (hero animations)
```

### Easing Functions
```
Linear:         linear
EaseOut:        cubic-bezier(0, 0, 0.2, 1)
EaseInOut:      cubic-bezier(0.4, 0, 0.2, 1)
BackOut:        cubic-bezier(0.68, -0.55, 0.265, 1.55)
ExpoOut:        cubic-bezier(0.19, 1, 0.22, 1)
```

### Stagger Delays
```
Service Cards:      stagger: 0.1s
Review Cards:       stagger: 0.1s
Stats:              stagger: 0.08s
Area Badges:        stagger: 0.08s
```

---

## 🎯 Touch Target Guidelines

### Minimum Sizes
```
Buttons:            44px × 44px (iOS/Android standard)
Links:              44px × 24px (height × width minimum)
Form inputs:        48px height
Tab buttons:        40px height (min)
```

### Spacing Between Targets
```
Vertical:   8px minimum (gap-2)
Horizontal: 12px minimum (gap-3)
```

---

## 📱 Mobile-Specific Adjustments

### Hero Section
```
Badge text:
  "Sanitation Excellence Guaranteed"  [desktop]
  "Excellence Guaranteed"             [mobile]

Button layout:
  flex-col     [mobile]
  sm:flex-row  [640px+]

Stats grid:
  grid-cols-2  [mobile]
  md:grid-cols-4  [768px+]
```

### ServiceAreas
```
Content order:
  [Content, Map]  [mobile - easier to read first]
  [Map, Content]  [desktop - visual impact]
```

### Footer
```
Grid:
  1 column          [mobile]
  sm:grid-cols-2    [640px+]
  lg:grid-cols-5    [1024px+]

Contact stack:
  flex-col          [mobile]
  sm:flex-row       [640px+]
```

---

## 🔍 Focus State Specification

### Visual Treatment
```
Ring width:         2px
Ring color:         primary
Ring offset:        2px
Ring offset color:  background
Outline:            none (replaced by ring)
```

### Applies To
```
- All <a> tags
- All <button> elements
- Form inputs/textareas/selects
- Interactive cards (when tabbed)
```

---

## 🌙 Dark Mode Considerations

### Auto-Adapting Elements
All colors use CSS custom properties that automatically adjust:
```
bg-background    → light or dark based on theme
bg-card          → adjusts contrast
text-foreground  → ensures readability
```

### Shadow Adjustments
Shadows maintain visibility in both modes via OKLCH color space.

---

## 🎬 Hero Animation Sequence

```
Timeline:
  0ms:     Background Ken Burns starts (20s loop)
  300ms:   Word 1 clip-path reveal (800ms duration)
  420ms:   Word 2 clip-path reveal
  540ms:   Word 3 clip-path reveal
  1040ms:  Subtitle fade-in + slide
  1240ms:  CTA buttons bounce-in
  1440ms:  Stats stagger reveal (100ms between each)
```

---

## 📊 Performance Budgets

### Animation Performance
```
Target FPS:         60fps (16.67ms per frame)
Max animations:     4 simultaneous
GPU acceleration:   Applied to transforms only
Will-change:        Used sparingly, cleared after animation
```

### CSS Complexity
```
Max specificity:    2 levels deep
BEM methodology:    Not used (Tailwind utility-first)
Custom classes:     Only for complex animations
```

---

## 🧪 Testing Viewport Sizes

### Priority Breakpoints
```
Mobile:      375px  (iPhone SE)
Mobile L:    428px  (iPhone 14 Pro Max)
Tablet:      768px  (iPad Mini)
Desktop:     1280px (Standard laptop)
Wide:        1920px (Full HD)
```

### Edge Cases
```
Very small:  320px  (ensure no overflow)
Between:     640px  (sm breakpoint edge)
Ultra-wide:  2560px (max-w-7xl container)
```

---

## 🎁 Polish Details

### Navbar
- Blur backdrop when scrolled
- Shadow appears on scroll
- Logo background inverts (transparent → solid)
- Mobile menu slides down smoothly

### Cards
- Border color subtly shifts on hover
- Icon backgrounds animate color change
- Text maintains readability during transitions

### Badges/Pills
- Pulse animation on status indicators
- Rounded full for pill shape
- Small, readable font sizes

### Links
- Underline on hover (where appropriate)
- Color transition (300ms)
- Focus ring appears on keyboard nav only

---

**Use this guide as a reference when extending the template or adding new components!**
