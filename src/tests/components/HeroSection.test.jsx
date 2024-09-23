// src/tests/HeroSection.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HeroSection from '../../components/HeroSection';

describe('HeroSection component', () => {
  test('renders the hero section with the correct content', () => {
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>
    );

    // Check if the main title and description are rendered
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome to Music Database');
    expect(screen.getByText('Explore artists, albums, tracks, and more!')).toBeInTheDocument();

    // Check if the "Get Started" button is rendered with the correct link
    const getStartedButton = screen.getByRole('link', { name: 'Get Started' });
    expect(getStartedButton).toBeInTheDocument();
    expect(getStartedButton).toHaveAttribute('href', '/tracks');
  });

  test('applies correct styles and classes', () => {
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>
    );

    // Check if the section has the correct class and styles applied
    const heroSection = screen.getByRole('banner');
    expect(heroSection).toHaveClass('bg-dark text-white text-center py-5');
  });
});
