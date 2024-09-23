// src/tests/NavBar.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../../components/NavBar';

describe('NavBar component', () => {
  test('renders all navigation links correctly', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    // Check for the presence of all navigation links
    expect(screen.getByRole('link', { name: 'Music Database App' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Artists' })).toHaveAttribute('href', '/artists');
    expect(screen.getByRole('link', { name: 'Tracks' })).toHaveAttribute('href', '/tracks');
    expect(screen.getByRole('link', { name: 'Albums' })).toHaveAttribute('href', '/albums');
    expect(screen.getByRole('link', { name: 'Genres' })).toHaveAttribute('href', '/genres');
    expect(screen.getByRole('link', { name: 'Media Types' })).toHaveAttribute('href', '/media-types');
  });

  test('highlights the active link based on the current route', () => {
    render(
      <MemoryRouter initialEntries={['/artists']}>
        <NavBar />
      </MemoryRouter>
    );

    // Check that the active link is highlighted
    expect(screen.getByRole('link', { name: 'Artists' })).toHaveClass('active');
  });

  test('toggles the navbar menu on small screens', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    // Check the initial state of the navbar menu (should be collapsed)
    expect(screen.getByRole('navigation')).not.toHaveClass('show');

    // Click the toggle button to expand the navbar menu
    const toggleButton = screen.getByLabelText('Toggle navigation');
    fireEvent.click(toggleButton);

    // Check if the navbar menu is expanded
    expect(screen.getByRole('navigation')).toHaveClass('show');
  });

  test('navbar brand redirects to the home page', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    // Check the navbar brand link
    const brandLink = screen.getByRole('link', { name: 'Music Database App' });
    expect(brandLink).toHaveAttribute('href', '/');
  });
});
