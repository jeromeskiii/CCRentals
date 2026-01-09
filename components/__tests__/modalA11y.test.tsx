import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ServiceRequestModal from '../ServiceRequestModal';
import ConfirmationModal from '../ConfirmationModal';

const focusableSelector =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

describe('modal accessibility', () => {
  it('traps focus and closes on Escape for ServiceRequestModal', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ServiceRequestModal open onClose={onClose} source="test" />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    const focusable = dialog.querySelectorAll<HTMLElement>(focusableSelector);
    expect(focusable.length).toBeGreaterThan(0);

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    last.focus();
    expect(last).toHaveFocus();

    await user.tab();
    expect(first).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('restores focus after ConfirmationModal closes and traps focus', async () => {
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
    openButton.focus();
    await user.click(openButton);

    const dialog = await screen.findByRole('dialog');
    const focusable = dialog.querySelectorAll<HTMLElement>(focusableSelector);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    last.focus();
    await user.tab();
    expect(first).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(openButton).toHaveFocus();
    });
  });
});
