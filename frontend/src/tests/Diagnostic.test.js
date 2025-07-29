
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import DiagnosticTestList from '../../src/pages/Crud/DiagnosticTestList';
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn().mockReturnValue(JSON.stringify([
    {
      id: 1,
      name: 'Blood Test',
      patient: 'Emily Rodriguez',
      status: 'critical',
      result: 'Abnormal',
      patientId: 'PAT-12345',
      date: '2023-05-15T14:30:22',
    },
    {
      id: 2,
      name: 'X-Ray',
      patient: 'John Smith',
      status: 'critical',
      result: 'Normal',
      patientId: 'PAT-12346',
      date: '2023-05-10T14:25:10',
    },
    {
      id: 3,
      name: 'MRI',
      patient: 'Sarah Johnson',
      status: 'normal',
      result: 'Normal',
      patientId: 'PAT-12347',
      date: '2023-05-05T14:07:45',
    },
    {
      id: 4,
      name: 'CT Scan',
      patient: 'Michael Brown',
      status: 'normal',
      result: 'Normal',
      patientId: 'PAT-12348',
      date: '2023-05-01T13:30:15',
    },
    {
      id: 5,
      name: 'Ultrasound',
      patient: 'Lisa Davis',
      status: 'pending',
      result: 'Pending',
      patientId: 'PAT-12349',
      date: '2023-04-28T12:45:30',
    },
  ])),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock Sidebar
jest.mock('../components/Sidebar', () => () => (
  <div data-testid="sidebar-mock">Sidebar Mock</div>
));

describe('DiagnosticTestList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  test('renders loading spinner initially', () => {
    renderWithRouter(<DiagnosticTestList />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('displays test data after loading', async () => {
    await act(async () => {
      renderWithRouter(<DiagnosticTestList />);
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(screen.getByText('Blood Test')).toBeInTheDocument();
      expect(screen.getByText('Emily Rodriguez')).toBeInTheDocument();
      expect(screen.getAllByText('CRITICAL').length).toBe(2);
    }, { timeout: 1000 });
  });

  test('displays correct stats cards', async () => {
    await act(async () => {
      renderWithRouter(<DiagnosticTestList />);
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(screen.getByTestId('total-tests')).toHaveTextContent('Total Tests');
      expect(screen.getByTestId('total-tests-count')).toHaveTextContent('5');
      expect(screen.getByTestId('critical')).toHaveTextContent('Critical');
      expect(screen.getByTestId('critical-count')).toHaveTextContent('2');
    }, { timeout: 1000 });
  });

  test('can add a new test', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    await act(async () => {
      renderWithRouter(<DiagnosticTestList />);
      jest.advanceTimersByTime(500);
    });

    await user.click(screen.getByRole('button', { name: /New Test/i }));
    
    await user.type(screen.getByLabelText('Test Name'), 'New Test');
    await user.type(screen.getByLabelText('Result'), 'Normal');
    await user.type(screen.getByLabelText('Patient Name'), 'John Doe');
    await user.type(screen.getByLabelText('Patient ID'), 'PAT-99999');
    await user.selectOptions(screen.getByLabelText('Status'), 'normal');
    await user.type(screen.getByLabelText('Date'), new Date().toISOString().split('T')[0]);
    
    await user.click(screen.getByRole('button', { name: /Save/i }));
    
    await waitFor(() => {
      expect(screen.getByText('New Test')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  test('can delete a test', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    await act(async () => {
      renderWithRouter(<DiagnosticTestList />);
      jest.advanceTimersByTime(500);
    });

    const initialTestCount = screen.getAllByTestId('edit-button').length;
    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    
    await user.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('edit-button').length).toBe(initialTestCount - 1);
    }, { timeout: 1000 });
  });
});
