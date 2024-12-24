import { render, screen } from '@testing-library/react';
import MainBanner from '@src/core/components/common/MainBanner'; // Adjust path if necessary
import { describe, it } from '@jest/globals';
import '@testing-library/jest-dom'; // Import jest-dom for the matchers like toBeInTheDocument

describe('MainBanner', () => {
  it('renders the MainBanner component with the correct content', () => {
    render(<MainBanner />);
    expect(screen.getByText(/Welcome to Education/i).textContent).toContain('Welcome to Education');
    expect(screen.getByText(/Hello Students/i).textContent).toContain('Hello Students');
    expect(screen.getByText(/Demo By NP/i).textContent).toContain('Demo By NP');
  });

  it('renders with the correct background image style', () => {
    const { container } = render(<MainBanner />);
    const sectionElement = container.querySelector('section');
    const style = window.getComputedStyle(sectionElement!);
    const backgroundImage = style.backgroundImage;
    expect(backgroundImage).toContain('https://media0.giphy.com/media/oTnyrIL4iTsiZ8FiPO/200w.gif');
  });
});
