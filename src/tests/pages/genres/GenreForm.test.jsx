// src/tests/GenreForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import GenreForm from '../pages/genres/GenreForm';
import { genreApi } from '../api/entitiesApi';

// Mock the genreApi
vi.mock('../api/entitiesApi', () => ({
  genreApi: {
    getById: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  },
}));

describe('GenreForm component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    // Mock useNavigate hook
    vi.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders "Add New Genre" form correctly', () => {
    render(
      <MemoryRouter>
        <GenreForm />
      </MemoryRouter>
    );

    // Check if the form is rendered with the title "Add New Genre"
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Add New Genre');
    expect(screen.getByLabelText('Genre Name:')).toBeInTheDocument();
  });

  test('renders "Edit Genre" form correctly when genreId is provided', async () => {
    const mockGenre = { id: 1, name: 'Test Genre' };
    genreApi.getById.mockResolvedValue(mockGenre);

    render(
      <MemoryRouter initialEntries={['/genres/1']}>
        <Routes>
          <Route path="/genres/:genreId" element={<GenreForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if the form is rendered with the title "Edit Genre"
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Edit Genre');

    // Wait for genre data to be populated
    await waitFor(() => expect(screen.getByDisplayValue('Test Genre')).toBeInTheDocument());
  });

  test('shows validation error when form is submitted with empty field', async () => {
    render(
      <MemoryRouter>
        <GenreForm />
      </MemoryRouter>
    );

    // Click the Save button without entering the genre name
    fireEvent.click(screen.getByText('SAVE'));

    // Wait for validation error to be displayed
    await waitFor(() => expect(screen.getByText('Genre name is required')).toBeInTheDocument());
  });

  test('submits the form successfully when adding a new genre', async () => {
    genreApi.insert.mockResolvedValue({});
    render(
      <MemoryRouter>
        <GenreForm />
      </MemoryRouter>
    );

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText('Genre Name:'), { target: { value: 'New Genre' } });

    // Click the Save button
    fireEvent.click(screen.getByText('SAVE'));

    // Wait for the insert API call to be made and navigate to genres list
    await waitFor(() => expect(genreApi.insert).toHaveBeenCalledWith({ name: 'New Genre' }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/genres'));
  });

  test('submits the form successfully when editing a genre', async () => {
    const mockGenre = { id: 1, name: 'Test Genre' };
    genreApi.getById.mockResolvedValue(mockGenre);
    genreApi.update.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={['/genres/1']}>
        <Routes>
          <Route path="/genres/:genreId" element={<GenreForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for genre data to be populated
    await waitFor(() => expect(screen.getByDisplayValue('Test Genre')).toBeInTheDocument());

    // Update the form field
    fireEvent.change(screen.getByLabelText('Genre Name:'), { target: { value: 'Updated Genre' } });

    // Click the Save button
    fireEvent.click(screen.getByText('SAVE'));

    // Wait for the update API call to be made and navigate to genres list
    await waitFor(() => expect(genreApi.update).toHaveBeenCalledWith({ id: 1, name: 'Updated Genre' }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/genres'));
  });

  test('navigates back to the genres list when "CANCEL" button is clicked', () => {
    render(
      <MemoryRouter>
        <GenreForm />
      </MemoryRouter>
    );

    // Click the Cancel button
    fireEvent.click(screen.getByLabelText('Cancel and go back to genres list'));

    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/genres');
  });
});
