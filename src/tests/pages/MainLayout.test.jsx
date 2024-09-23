// src/tests/MainLayout.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainLayout from '../../pages/MainLayout'; // Adjust the path if necessary
import { vi } from 'vitest';
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

// Mock components to isolate MainLayout's behavior
vi.mock('../../components/Header', () => ({
  default: () => <div>Mock Header</div>,
}));
vi.mock('../../components/NavBar', () => ({
  default: () => <div>Mock NavBar</div>,
}));
vi.mock('../../components/Footer', () => ({
  default: () => <div>Mock Footer</div>,
}));

describe('MainLayout component', () => {
  test('renders Header, NavBar, and Footer correctly', () => {
    render(
      <MemoryRouter>
        <MainLayout>
          <div>Main Content</div>
        </MainLayout>
      </MemoryRouter>
    );

    // Check that the Header, NavBar, and Footer are rendered
    expect(screen.getByText('Mock Header')).toBeInTheDocument();
    expect(screen.getByText('Mock NavBar')).toBeInTheDocument();
    expect(screen.getByText('Mock Footer')).toBeInTheDocument();
  });

  test('renders children content with animation', () => {
    render(
      <MemoryRouter>
        <MainLayout>
          <div>Main Content</div>
        </MainLayout>
      </MemoryRouter>
    );

    // Check that the children content is rendered
    expect(screen.getByText('Main Content')).toBeInTheDocument();

    // Check that the motion.main element is present
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });

  test('applies correct initial animation styles to main content', () => {
    render(
      <MemoryRouter>
        <MainLayout>
          <div>Main Content</div>
        </MainLayout>
      </MemoryRouter>
    );

    // Check that the motion.main element has the initial animation styles
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveStyle({ opacity: 0, transform: 'translateY(20px)' });
  });

  test('updates animation key based on base path change', () => {
    render(
      <MemoryRouter initialEntries={['/artists']}>
        <MainLayout>
          <div>Main Content for Artists</div>
        </MainLayout>
      </MemoryRouter>
    );

    // Check that the base path key is correct based on initial route
    expect(screen.getByRole('main')).toHaveAttribute('data-key', 'artists');

    // Re-render with a different route
    render(
      <MemoryRouter initialEntries={['/albums']}>
        <MainLayout>
          <div>Main Content for Albums</div>
        </MainLayout>
      </MemoryRouter>
    );

    // Check that the base path key is updated
    expect(screen.getByRole('main')).toHaveAttribute('data-key', 'albums');
  });

  test('renders footer with animation', () => {
    render(
      <MemoryRouter>
        <MainLayout>
          <div>Main Content</div>
        </MainLayout>
      </MemoryRouter>
    );

    // Check that the motion.footer element is present
    const footerElement = screen.getByText('Mock Footer').closest('footer');
    expect(footerElement).toBeInTheDocument();
    expect(footerElement).toHaveStyle({ opacity: 0, transform: 'translateY(20px)' });
  });
});
