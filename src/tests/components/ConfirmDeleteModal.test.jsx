// src/tests/ConfirmDeleteModal.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

describe('ConfirmDeleteModal component', () => {
  const handleClose = vi.fn();
  const handleConfirm = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('does not render when "show" is false', () => {
    render(
      <ConfirmDeleteModal
        show={false}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        itemName="Test Item"
      />
    );

    // Modal should not be rendered when show is false
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders correctly when "show" is true', () => {
    render(
      <ConfirmDeleteModal
        show={true}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        itemName="Test Item"
      />
    );

    // Modal should be rendered with the correct title and item name
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete')).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  test('calls handleClose when the cancel button is clicked', () => {
    render(
      <ConfirmDeleteModal
        show={true}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        itemName="Test Item"
      />
    );

    // Click the cancel button
    fireEvent.click(screen.getByText('Cancel'));

    // Check if handleClose was called
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('calls handleConfirm when the delete button is clicked', () => {
    render(
      <ConfirmDeleteModal
        show={true}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        itemName="Test Item"
      />
    );

    // Click the delete button
    fireEvent.click(screen.getByText('Delete'));

    // Check if handleConfirm was called
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  test('calls handleClose when the close icon is clicked', () => {
    render(
      <ConfirmDeleteModal
        show={true}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        itemName="Test Item"
      />
    );

    // Click the close button (icon)
    fireEvent.click(screen.getByLabelText('Close'));

    // Check if handleClose was called
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
