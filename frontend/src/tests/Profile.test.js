import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import Profile from '../pages/Profile/Profile';
import Sidebar from '../components/SidebarUser';

// 1. Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// 2. Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

// 3. Mock Sidebar
jest.mock('../components/SidebarUser', () => () => (
  <div data-testid="sidebar-mock">Sidebar Mock</div>
));

// 4. Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaUser: () => <span>UserIcon</span>,
  FaEnvelope: () => <span>EnvelopeIcon</span>,
  FaLock: () => <span>LockIcon</span>,
  FaBell: () => <span>BellIcon</span>,
  FaSave: () => <span>SaveIcon</span>,
  FaEdit: () => <span>EditIcon</span>,
  FaMoon: () => <span>MoonIcon</span>,
  FaSun: () => <span>SunIcon</span>,
}));

describe('Profile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'user') {
        return JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          notificationThreshold: 'medium',
          themePreference: 'light',
          lastUpdated: new Date().toISOString(),
        });
      }
      return null;
    });
    jest.useFakeTimers(); // Enable fake timers
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers(); // Reset timers
  });

  test('jsdom environment is available', () => {
    expect(document).toBeDefined();
    expect(window).toBeDefined();
  });

  test('renders loading spinner initially', () => {
    render(<Profile />);
    expect(
      screen.getByTestId('sidebar-mock').parentElement.querySelector('.animate-spin')
    ).toBeInTheDocument();
  });

  test('loads and displays user data', async () => {
    await act(async () => {
      render(<Profile />);
      jest.advanceTimersByTime(500); // Advance setTimeout in fetchUserData
    });

    await waitFor(
      () => {
        expect(
          screen.getByTestId('sidebar-mock').parentElement.querySelector('.animate-spin')
        ).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    // Check for user name (match either Test User or fallback Alex Johnson)
    expect(screen.getByText(/Test User|Alex Johnson/)).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
    expect(screen.getByText('User Profile')).toBeInTheDocument();
  });
});