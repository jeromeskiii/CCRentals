import { render, screen } from '@testing-library/react';
import Navbar from '../template/Navbar';
import CTASection from '../template/CTASection';

describe('template components', () => {
  it('renders Navbar without ModalManagerProvider when openLeadModal prop is provided', () => {
    render(<Navbar openLeadModal={vi.fn()} />);
    expect(screen.getByRole('button', { name: /request service/i })).toBeInTheDocument();
  });

  it('renders CTASection without ModalManagerProvider when openLeadModal prop is provided', () => {
    render(<CTASection openLeadModal={vi.fn()} />);
    expect(screen.getByRole('button', { name: /request service/i })).toBeInTheDocument();
  });
});
