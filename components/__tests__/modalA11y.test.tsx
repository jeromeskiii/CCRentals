import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ServiceRequestModal from '../ServiceRequestModal';
import ConfirmationModal from '../ConfirmationModal';

const focusableSelector =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

describe('modal accessibility', () => {
  it('closes on Escape for ServiceRequestModal', async () => {
    const onClose = vi.fn();

    render(<ServiceRequestModal open onClose={onClose} source="test" />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    const focusable = dialog.querySelectorAll<HTMLElement>(focusableSelector);
    expect(focusable.length).toBeGreaterThan(0);

    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has correct focusable elements for ConfirmationModal', async () => {
    const user = userEvent.setup();

    const Wrapper = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open modal</button>
          <ConfirmationModal
            isOpen={open}
            title="Confirm"
            message="Proceed?"
            onConfirm={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </>
      );
    };

    render(<Wrapper />);

    const openButton = screen.getByRole('button', { name: 'Open modal' });
    await user.click(openButton);

    const dialog = screen.getByRole('dialog');
    const focusable = dialog.querySelectorAll<HTMLElement>(focusableSelector);

    expect(focusable.length).toBeGreaterThan(0);
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});
