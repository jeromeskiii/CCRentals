# Modal Architecture Migration Guide

## What Changed

### Before (Tight Coupling)
```tsx
// App.tsx owned modal state directly
const [leadModalOpen, setLeadModalOpen] = useState(false);
const [leadSource, setLeadSource] = useState<string | null>(null);

// Had to pass callback through component tree
<Navbar openLeadModal={openLeadModal} />
<Hero openLeadModal={openLeadModal} />

// Had to import and render each modal individually
<ServiceRequestModal open={leadModalOpen} onClose={closeLeadModal} source={leadSource} />
```

**Problems:**
- Adding new modal required editing App.tsx
- Modal-specific state leaked into App component
- Hard to test modals in isolation
- Scalability issues with 10+ modals

### After (Proper Boundaries)
```tsx
// App.tsx - Clean, no modal logic
const App = () => (
  <ModalManagerProvider>
    <Navbar />
    <Hero />
    {/* ... other components ... */}
    <ModalRegistry /> {/* Renders all modals automatically */}
  </ModalManagerProvider>
);

// Child components - Access modal system via hook
const Navbar = () => {
  const { openModal } = useModalManager();
  return <button onClick={() => openModal('service-request', { source: 'navbar' })}>Request Service</button>;
};
```

**Benefits:**
- Add new modal: Register in ModalRegistry.tsx only
- App.tsx never changes
- Each modal owns its state
- Testable in isolation
- Scales to unlimited modals

## Migration Steps for Existing Components

### 1. Update Child Components

**Before:**
```tsx
interface NavbarProps {
  openLeadModal: (source: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ openLeadModal }) => {
  return <button onClick={() => openLeadModal('navbar')}>;
};
```

**After:**
```tsx
import { useModalManager } from '../hooks/useModalManager';

const Navbar: React.FC = () => {
  const { openModal } = useModalManager();
  
  return <button onClick={() => openModal('service-request', { source: 'navbar' })}>Request Service</button>;
};
```

### 2. Update Modal Components (If Needed)

**Before:**
```tsx
interface ServiceRequestModalProps {
  open: boolean;
  onClose: () => void;
  source: string | null;
}
```

**After:** (No changes needed! ModalRegistry handles the mapping)

### 3. Add New Modal

**Step 1:** Create modal component as usual

**Step 2:** Register in `ModalRegistry.tsx`:
```tsx
const MODAL_REGISTRY = {
  // ... existing modals ...
  'my-new-modal': {
    component: MyNewModal,
    propMapping: {
      customProp: 'props.customProp'
    }
  }
};
```

**Step 3:** Use anywhere:
```tsx
const { openModal } = useModalManager();
openModal('my-new-modal', { customProp: 'value' });
```

## Testing

### Test Modal in Isolation
```tsx
import { renderHook } from '@testing-library/react';
import { useModalManager } from './useModalManager';

test('opens modal with props', () => {
  const { result } = renderHook(() => useModalManager(), {
    wrapper: ModalManagerProvider
  });
  
  act(() => {
    result.current.openModal('service-request', { source: 'test' });
  });
  
  expect(result.current.isModalOpen('service-request')).toBe(true);
  expect(result.current.getModalProps('service-request')).toEqual({ source: 'test' });
});
```

## Architecture Principles

1. **State Ownership**: ModalManagerContext owns modal state
2. **Boundary Enforcement**: App doesn't know modal details
3. **Open/Closed Principle**: Open for extension (new modals), closed for modification (App.tsx)
4. **Single Responsibility**: Each component has one job
   - App: Layout
   - ModalRegistry: Modal rendering
   - useModalManager: Modal state
   - Individual modals: Their own logic

## Rollback Plan

If issues arise, revert App.tsx to original and remove:
- hooks/useModalManager.ts
- components/ModalRegistry.tsx

Original modal pattern still works with existing code.
