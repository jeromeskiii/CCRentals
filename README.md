<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1x3TMM-a5IkGp0QWSqnp8OIDO6y3WTx0K

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Architecture & Patterns

### Accessibility (A11y)

We use a custom hook `useModalA11y` to standardize modal accessibility across the application. This hook handles:

- **Focus Trapping**: Keeps focus within the modal while it's open
- **Focus Restoration**: Returns focus to the triggering element when closed
- **Escape Key**: Closes the modal when the Escape key is pressed
- **Initial Focus**: Automatically focuses the first interactive element

**Usage:**

```typescript
import { useModalA11y } from '../hooks/useModalA11y';

const MyModal = ({ open, onClose }) => {
  const { modalRef } = useModalA11y({
    isOpen: open,
    onClose
  });

  return (
    <div role="dialog" ref={modalRef}>
      {/* Modal content */}
    </div>
  );
};
```

This pattern is currently implemented in:

- `ServiceRequestModal`
- `ConfirmationModal`
- `EnhancedQuoteModal`
