// src/tests/Header.test.jsx
import { render, screen } from '@testing-library/react';
import Header from '../components/Header'; // Adjust the path if necessary

describe('Header component', () => {
  test('renders the header with the correct content', () => {
    render(<Header />);

    // Check if the title is rendered correctly
    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toHaveTextContent('Music Database App');

    // Check if the icon is rendered correctly
    const iconElement = screen.getByRole('img', { hidden: true });
    expect(iconElement).toHaveClass('bi-database-check');
  });

  test('applies the correct classes and styles', () => {
    render(<Header />);

    // Check if the header has the correct class for styling
    const headerElement = screen.getByRole('banner'); // 'header' is commonly represented by 'banner'
    expect(headerElement).toHaveClass('bg-dark text-white py-2');

    // Check if the container has the correct class
    const containerElement = screen.getByRole('banner').firstChild;
    expect(containerElement).toHaveClass('container d-flex align-items-center');
  });
});
