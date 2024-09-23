// src/tests/Footer.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../../components/Footer';

describe('Footer component', () => {
  test('renders About Us section with correct content', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // Check for About Us section and its content
    expect(screen.getByRole('heading', { level: 5, name: 'About Us' })).toBeInTheDocument();
    expect(screen.getByText(/We are a music database application/i)).toBeInTheDocument();
  });

  test('renders Quick Links section with correct links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // Check for Quick Links section and verify links
    expect(screen.getByRole('heading', { level: 5, name: 'Quick Links' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Artists' })).toHaveAttribute('href', '/artists');
    expect(screen.getByRole('link', { name: 'Albums' })).toHaveAttribute('href', '/albums');
    expect(screen.getByRole('link', { name: 'Genres' })).toHaveAttribute('href', '/genres');
  });

  test('renders Contact Us section with email and phone', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // Check for Contact Us section
    expect(screen.getByRole('heading', { level: 5, name: 'Contact Us' })).toBeInTheDocument();

    // Check for email and phone
    expect(screen.getByText('info@musicapp.com')).toHaveAttribute('href', 'mailto:info@musicapp.com');
    expect(screen.getByText(/Phone: \+123 456 7890/i)).toBeInTheDocument();
  });

  test('renders social media links correctly', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // Check for social media icons and their presence
    expect(screen.getByRole('link', { name: /facebook/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /twitter/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument();
  });

  test('renders footer bottom section with copyright', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // Check for the footer bottom text
    expect(screen.getByText('© 2024 MusicApp. All rights reserved.')).toBeInTheDocument();
  });

  test('applies the correct classes and styles', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // Check if the footer has the correct class for styling
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toHaveClass('mt-auto bg-dark text-white py-3');

    // Check if the container inside the footer has the correct class
    const containerElement = footerElement.querySelector('.container');
    expect(containerElement).toBeInTheDocument();
    expect(containerElement).toHaveClass('container');
  });
});
