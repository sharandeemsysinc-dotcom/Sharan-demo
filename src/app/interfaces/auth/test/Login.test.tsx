import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../UI/login';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../stores/authSlice';
import { BrowserRouter } from 'react-router-dom';
import * as loginService from '../services/loginService';

// Mock dependencies
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => mockUseLocation(),
    };
});

// Mock the login mutation hook
const mockLogin = vi.fn();
vi.mock('../services/loginService', async () => {
    const actual = await vi.importActual('../services/loginService');
    return {
        ...actual,
        useLoginMutation: () => [mockLogin, { isLoading: false }],
    };
});

// Helper to render component with Redux and Router
const renderWithProviders = (ui: React.ReactElement) => {
    const store = configureStore({
        reducer: {
            auth: authReducer,
            [loginService.loginService.reducerPath]: loginService.loginService.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(loginService.loginService.middleware),
    });

    return render(
        <Provider store={store}>
            <BrowserRouter>{ui}</BrowserRouter>
        </Provider>
    );
};

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseLocation.mockReturnValue({ pathname: '/auth/login' });

        // Default success mock
        mockLogin.mockResolvedValue({
            data: {
                status: true,
                message: "Login successful!",
                data: {
                    user: { id: 'user-123', role_name: 'Admin' },
                    access_token: 'fake-token',
                    refresh_token: 'fake-refresh',
                }
            }
        });
    });

    // Test Case 001: Valid login
    it('should login successfully with valid credentials', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);

        await user.type(screen.getByLabelText(/Username/i), 'test@example.com');
        await user.type(screen.getByLabelText(/Password/i), 'password123');

        await user.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
                "role_id": 4,
            });

            expect(screen.getByText('Login successful!')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/admin/staff'); // Based on Admin role in mock
        });
    });

    // Test Case 002: Invalid password
    it('should show error message for invalid password', async () => {
        const user = userEvent.setup();
        // Mock failure response
        mockLogin.mockResolvedValue({
            data: {
                status: false,
                message: 'Login failed. Please check your credentials.'
            }
        });

        renderWithProviders(<LoginPage />);

        await user.type(screen.getByLabelText(/Username/i), 'test@example.com');
        await user.type(screen.getByLabelText(/Password/i), 'wrongpassword');

        await user.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(
                screen.getByText('Login failed. Please check your credentials.')
            ).toBeInTheDocument();
        });
    });

    // Test Case 003: Invalid username
    it('should show error message for invalid username', async () => {
        const user = userEvent.setup();
        mockLogin.mockResolvedValue({
            data: {
                status: false,
                message: 'Login failed. Please check your credentials.'
            }
        });

        renderWithProviders(<LoginPage />);

        await user.type(screen.getByLabelText(/Username/i), 'invalid@example.com');
        await user.type(screen.getByLabelText(/Password/i), 'password123');

        await user.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(
                screen.getByText('Login failed. Please check your credentials.')
            ).toBeInTheDocument();
        });
    });

    // Test Case 004: Both invalid
    it('should show error message for invalid username and password', async () => {
        const user = userEvent.setup();
        mockLogin.mockResolvedValue({
            data: {
                status: false,
                message: 'Login failed. Please check your credentials.'
            }
        });

        renderWithProviders(<LoginPage />);

        await user.type(screen.getByLabelText(/Username/i), 'invalid@example.com');
        await user.type(screen.getByLabelText(/Password/i), 'wrongpassword');

        await user.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(
                screen.getByText('Login failed. Please check your credentials.')
            ).toBeInTheDocument();
        });
    });

    // Test Case 005: Empty fields validation
    it('should validate empty fields', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);

        await user.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(screen.getByText('Username is required')).toBeInTheDocument();
            expect(screen.getByText('Password required')).toBeInTheDocument();
        });
    });

    // Test Case 006: Email validation
    it('should validate email format correctly', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);

        await user.type(screen.getByLabelText(/Username/i), 'invalid-email');
        await user.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
        });
    });

    // Test Case 007: Forgot password link
    it('should show Forgot Password link', () => {
        renderWithProviders(<LoginPage />);
        expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    });

    // Test Case 008: Multiple failed attempts
    it('should handle multiple failed login attempts', async () => {
        const user = userEvent.setup();

        mockLogin.mockResolvedValue({
            data: {
                status: false,
                message: 'Too many failed attempts. Account locked.'
            }
        });

        renderWithProviders(<LoginPage />);

        for (let i = 0; i < 5; i++) {
            await user.clear(screen.getByLabelText(/Username/i));
            await user.clear(screen.getByLabelText(/Password/i));

            await user.type(screen.getByLabelText(/Username/i), 'test@example.com');
            await user.type(screen.getByLabelText(/Password/i), 'wrongpassword');

            await user.click(screen.getByRole('button', { name: /Login/i }));
        }

        await waitFor(() => {
            expect(
                screen.getByText('Too many failed attempts. Account locked.')
            ).toBeInTheDocument();
        });
    });

    // Test Case 009: Password masking toggle
    it('should toggle password visibility', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);

        const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;
        expect(passwordInput.type).toBe('password');

        const toggle = screen.getAllByRole('button').find((btn) =>
            btn.querySelector('svg')
        );

        if (toggle) {
            await user.click(toggle);
            expect(passwordInput.type).toBe('text');

            await user.click(toggle);
            expect(passwordInput.type).toBe('password');
        }
    });

    // Test Case 010: UI elements
    it('should render all UI elements', () => {
        renderWithProviders(<LoginPage />);

        expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
        expect(screen.getByText('Client')).toBeInTheDocument();
        expect(screen.getByText('Coach')).toBeInTheDocument();
    });

    // Test Case 011: Special characters handling
    it('should handle special characters in inputs', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);

        await user.type(screen.getByLabelText(/Username/i), '@#$%^&*');
        await user.type(screen.getByLabelText(/Password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
        });

        await user.clear(screen.getByLabelText(/Username/i));
        await user.clear(screen.getByLabelText(/Password/i));

        await user.type(screen.getByLabelText(/Username/i), 'test@example.com');
        await user.type(screen.getByLabelText(/Password/i), 'P@ssw0rd!#$%');

        await user.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalled();
        });
    });

    // Test Case 012: Response time
    it('should complete login in acceptable time', async () => {
        const user = userEvent.setup();
        const start = Date.now();

        renderWithProviders(<LoginPage />);

        await user.type(screen.getByLabelText(/Username/i), 'test@example.com');
        await user.type(screen.getByLabelText(/Password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(screen.getByText('Login successful!')).toBeInTheDocument();
        });

        expect(Date.now() - start).toBeLessThan(3000);
    });

    // Tab switching
    it('should switch tabs correctly', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);

        await user.click(screen.getByText('Coach'));
        expect(screen.getByText('Coach')).toBeInTheDocument();

        await user.click(screen.getByText('Client'));
        expect(screen.getByText('Client')).toBeInTheDocument();
    });
});

describe('Forgot Password', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseLocation.mockReturnValue({ pathname: '/auth/login' });
    });

    it('should navigate to forgot password view when clicking "Forget Password?"', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);

        const forgotPasswordLink = screen.getByText('Forgot Password?');
        await user.click(forgotPasswordLink);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/auth/forgot-password');
        });
    });

    it('should render forgot password form correctly', async () => {
        mockUseLocation.mockReturnValue({ pathname: '/auth/forgot-password' });
        renderWithProviders(<LoginPage />);

        expect(screen.getByRole('heading', { name: /Forgot Password/i })).toBeInTheDocument();
        expect(screen.getByText('Enter your username to reset your password')).toBeInTheDocument();
        expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Send Reset Link/i })).toBeInTheDocument();
        expect(screen.getByText('Back to Login')).toBeInTheDocument();
    });

    it('should validate empty email in forgot password form', async () => {
        mockUseLocation.mockReturnValue({ pathname: '/auth/forgot-password' });
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);

        const sendButton = screen.getByRole('button', { name: /Send Reset Link/i });
        await user.click(sendButton);

        await waitFor(() => {
            expect(screen.getByText('Username is required')).toBeInTheDocument();
        });
    });

    it('should validate invalid email format', async () => {
        mockUseLocation.mockReturnValue({ pathname: '/auth/forgot-password' });
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);

        const emailInput = screen.getByLabelText(/Username/i);
        await user.type(emailInput, 'invalid-email');
        const sendButton = screen.getByRole('button', { name: /Send Reset Link/i });
        await user.click(sendButton);

        await waitFor(() => {
            expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
        });
    });

    it('should handle successful password reset request', async () => {
        mockUseLocation.mockReturnValue({ pathname: '/auth/forgot-password' });
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);

        const emailInput = screen.getByLabelText(/Username/i);
        await user.type(emailInput, 'test@example.com');
        const sendButton = screen.getByRole('button', { name: /Send Reset Link/i });
        await user.click(sendButton);

        await waitFor(() => {
            expect(screen.getByText(/Forgot password successful!/i)).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
        }, { timeout: 3000 });
    });

    it('should navigate back to login when clicking "Back to Login"', async () => {
        mockUseLocation.mockReturnValue({ pathname: '/auth/forgot-password' });
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);

        const backLink = screen.getByText('Back to Login');
        await user.click(backLink);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
        });
    });
});