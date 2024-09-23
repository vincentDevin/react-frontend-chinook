// src/tests/HomePage.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import HomePage from '../../pages/HomePage'; // Adjust the path if necessary
import MainLayout from '../../pages/MainLayout';
import HeroSection from '../../components/HeroSection';
import FeatureHighlights from '../../components/FeatureHighlights';
import RandomSpotlight from '../../components/RandomSpotlight';
import * as docTitleHook from '../../useDocTitle';

// Mock components to isolate HomePage's behavior
vi.mock('../../pages/MainLayout', () => ({
  default: ({ children }) => <div>Mock MainLayout {children}</div>,
}));
vi.mock('../../components/HeroSection', () => ({
  default: () => <div>Mock HeroSection</div>,
}));
vi.mock('../../components/FeatureHighlights', () => ({
  default: () => <div>Mock FeatureHighlights</div>,
}));
vi.mock('../../components/RandomSpotlight', () => ({
  default: () => <div>Mock RandomSpotlight</div>,
}));

describe('HomePage component', () => {
  test('renders MainLayout with HeroSection, FeatureHighlights, and RandomSpotlight', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Check that the MainLayout, HeroSection, FeatureHighlights, and RandomSpotlight are rendered
    expect(screen.getByText('Mock MainLayout')).toBeInTheDocument();
    expect(screen.getByText('Mock HeroSection')).toBeInTheDocument();
    expect(screen.getByText('Mock FeatureHighlights')).toBeInTheDocument();
    expect(screen.getByText('Mock RandomSpotlight')).toBeInTheDocument();
  });

  test('sets the document title correctly using useDocTitle hook', () => {
    const setDocTitleSpy = vi.spyOn(docTitleHook, 'useDocTitle');
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Check that useDocTitle was called with the correct title
    expect(setDocTitleSpy).toHaveBeenCalledWith('Home - Music Database App');
  });

  test('renders children components in the correct order inside MainLayout', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Check the rendering order of the child components
    const layoutContainer = screen.getByText('Mock MainLayout');
    expect(layoutContainer).toContainElement(screen.getByText('Mock HeroSection'));
    expect(layoutContainer).toContainElement(screen.getByText('Mock FeatureHighlights'));
    expect(layoutContainer).toContainElement(screen.getByText('Mock RandomSpotlight'));
  });
});
