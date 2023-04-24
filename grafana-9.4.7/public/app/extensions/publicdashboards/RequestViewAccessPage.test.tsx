import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';

import RequestViewAccessPage from './RequestViewAccessPage';

describe('RequestViewAccessPage', () => {
  it('disables submit button and changes its text after submitting valid email address', async () => {
    render(<RequestViewAccessPage />);

    act(() => {
      fireEvent.change(screen.getByPlaceholderText('email'), { target: { value: 'email@example.com' } });
      fireEvent.click(screen.getByTestId('requestAccessSubmitButton'));
    });

    const accessRequestedButton = await screen.findByText('Access requested');
    expect(accessRequestedButton).toBeVisible();
    expect(accessRequestedButton.parentElement).toBeDisabled();
  });

  it('shows validation error when email is not valid', async () => {
    render(<RequestViewAccessPage />);

    act(() => {
      fireEvent.change(screen.getByPlaceholderText('email'), { target: { value: 'invalid.com' } });
      fireEvent.click(screen.getByTestId('requestAccessSubmitButton'));
    });

    expect(await screen.findByText('Invalid email')).toBeVisible();
  });

  it('shows validation error when email is not provided', async () => {
    render(<RequestViewAccessPage />);

    act(() => {
      fireEvent.click(screen.getByTestId('requestAccessSubmitButton'));
    });

    expect(await screen.findByText('Email is required')).toBeVisible();
  });
});
