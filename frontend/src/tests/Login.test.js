import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';
import Login from './Login';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock localStorage
const mockLocalStorage = { setItem: jest.fn() };
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('Login Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    mockNavigate.mockReset();
    mockLocalStorage.setItem.mockReset();
  });

  test('renders login form', () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('updates input fields', async () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
    expect(screen.getByLabelText('Password')).toHaveValue('password123');
  });

  test('handles successful login', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ data: { user: { username: 'testuser' }, token: 'fake-token' } }),
      { status: 200 }
    );

    render(<MemoryRouter><Login /></MemoryRouter>);
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5000/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      })
    );
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify({ username: 'testuser', token: 'fake-token' })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  test('displays error on failed login', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });

    render(<MemoryRouter><Login /></MemoryRouter>);
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'wrongpassword');
    await userEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });
});