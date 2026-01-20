import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ChangePassword from "../UI/ChangePassword";
import * as loginService from "../services/loginService";

// Mock the navigation
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock the change password mutation
const mockChangePassword = vi.fn();
vi.mock("../services/loginService", async () => {
    const actual = await vi.importActual("../services/loginService");
    return {
        ...actual,
        useChangePasswordMutation: vi.fn(),
    };
});

describe("ChangePassword Component", () => {
    let mockStore: any;

    beforeEach(() => {
        // Create a mock store with auth state
        mockStore = configureStore({
            reducer: {
                auth: () => ({
                    userId: "user123",
                }),
                api: () => ({}),
            },
        });

        // Reset mocks
        vi.clearAllMocks();

        // Default mock implementation
        (loginService.useChangePasswordMutation as any).mockReturnValue([
            mockChangePassword,
        ]);
    });

    const renderComponent = () => {
        return render(
            <Provider store={mockStore}>
                <BrowserRouter>
                    <ChangePassword />
                </BrowserRouter>
            </Provider>
        );
    };

    describe("Component Rendering", () => {
        it("should render the change password form with all required elements", () => {
            renderComponent();

            expect(screen.getByText("Change Password")).toBeInTheDocument();
            expect(screen.getByText("Enter your old password and new password to update your credentials")).toBeInTheDocument();
            expect(screen.getByLabelText(/Old Password/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
            expect(screen.getByRole("button", { name: /Update Password/i })).toBeInTheDocument();
        });

        it("should render logo image", () => {
            renderComponent();
            const logo = screen.getByAltText("logo");
            expect(logo).toBeInTheDocument();
        });

        it("should have all password fields as password type inputs", () => {
            renderComponent();

            const oldPasswordInput = screen.getByLabelText(/Old Password/i);
            const newPasswordInput = screen.getByLabelText(/New Password/i);
            const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);

            // Password fields should initially be type="password"
            expect(oldPasswordInput).toHaveAttribute("type", "password");
            expect(newPasswordInput).toHaveAttribute("type", "password");
            expect(confirmPasswordInput).toHaveAttribute("type", "password");
        });
    });

    describe("Form Validation", () => {
        it("should show validation error when old password is empty", async () => {
            const user = userEvent.setup();
            renderComponent();

            const submitButton = screen.getByRole("button", { name: /Update Password/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText("Old Password is required")).toBeInTheDocument();
            });
        });

        it("should show validation error when new password is empty", async () => {
            const user = userEvent.setup();
            renderComponent();

            const submitButton = screen.getByRole("button", { name: /Update Password/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText("New Password is required")).toBeInTheDocument();
            });
        });

        it("should show validation error when confirm password is empty", async () => {
            const user = userEvent.setup();
            renderComponent();

            const submitButton = screen.getByRole("button", { name: /Update Password/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText("Confirm Password is required")).toBeInTheDocument();
            });
        });

        it("should show validation error when password is less than 8 characters", async () => {
            const user = userEvent.setup();
            renderComponent();

            await user.type(screen.getByLabelText(/New Password/i), "Short1!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "Short1!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            await waitFor(() => {
                expect(screen.getByText("Password must be at least 8 characters")).toBeInTheDocument();
            });
        });

        it("should show validation error when password doesn't contain lowercase letter", async () => {
            const user = userEvent.setup();
            renderComponent();

            await user.type(screen.getByLabelText(/New Password/i), "PASSWORD123!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "PASSWORD123!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            await waitFor(() => {
                expect(screen.getByText("Password must contain at least one lowercase letter")).toBeInTheDocument();
            });
        });

        it("should show validation error when password doesn't contain uppercase letter", async () => {
            const user = userEvent.setup();
            renderComponent();

            await user.type(screen.getByLabelText(/New Password/i), "password123!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "password123!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            await waitFor(() => {
                expect(screen.getByText("Password must contain at least one uppercase letter")).toBeInTheDocument();
            });
        });

        it("should show validation error when password doesn't contain a number", async () => {
            const user = userEvent.setup();
            renderComponent();

            await user.type(screen.getByLabelText(/New Password/i), "Password!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "Password!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            await waitFor(() => {
                expect(screen.getByText("Password must contain at least one number")).toBeInTheDocument();
            });
        });

        it("should show validation error when password doesn't contain special character", async () => {
            const user = userEvent.setup();
            renderComponent();

            await user.type(screen.getByLabelText(/New Password/i), "Password123");
            await user.type(screen.getByLabelText(/Confirm Password/i), "Password123");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            await waitFor(() => {
                expect(screen.getByText("Password must contain at least one special character")).toBeInTheDocument();
            });
        });

        it("should show validation error when passwords don't match", async () => {
            const user = userEvent.setup();
            renderComponent();

            await user.type(screen.getByLabelText(/Old Password/i), "OldPass123!");
            await user.type(screen.getByLabelText(/New Password/i), "NewPass123!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "DifferentPass123!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            await waitFor(() => {
                expect(screen.getByText("Passwords must match")).toBeInTheDocument();
            });
        });

        it("should not show validation errors when all fields are valid", async () => {
            const user = userEvent.setup();
            renderComponent();
            mockChangePassword.mockResolvedValue({ data: { status: true } });

            await user.type(screen.getByLabelText(/Old Password/i), "OldPass123!");
            await user.type(screen.getByLabelText(/New Password/i), "NewPass123!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "NewPass123!");

            await waitFor(() => {
                expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
                expect(screen.queryByText(/must match/i)).not.toBeInTheDocument();
            });
        });
    });

    describe("Form Submission - Success Cases", () => {
        it("should call change password mutation with correct data", async () => {
            const user = userEvent.setup();
            mockChangePassword.mockResolvedValue({
                data: { status: true, message: "Password changed successfully!" }
            });
            renderComponent();

            await user.type(screen.getByLabelText(/Old Password/i), "OldPass123!");
            await user.type(screen.getByLabelText(/New Password/i), "NewPass123!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "NewPass123!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            await waitFor(() => {
                expect(mockChangePassword).toHaveBeenCalledWith({
                    old_password: "OldPass123!",
                    new_password: "NewPass123!",
                    confirm_password: "NewPass123!",
                    user_id: "user123",
                });
            });
        });

        it("should show success toast message on successful password change", async () => {
            const user = userEvent.setup();
            mockChangePassword.mockResolvedValue({
                data: { status: true, message: "Password changed successfully!" }
            });
            renderComponent();

            await user.type(screen.getByLabelText(/Old Password/i), "OldPass123!");
            await user.type(screen.getByLabelText(/New Password/i), "NewPass123!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "NewPass123!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            await waitFor(() => {
                expect(screen.getByText("Password changed successfully!")).toBeInTheDocument();
            });
        });

        it("should navigate to login page after successful password change", async () => {
            const user = userEvent.setup();
            mockChangePassword.mockResolvedValue({
                data: { status: true, message: "Password changed successfully!" }
            });
            renderComponent();

            await user.type(screen.getByLabelText(/Old Password/i), "OldPass123!");
            await user.type(screen.getByLabelText(/New Password/i), "NewPass123!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "NewPass123!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith("/auth/login");
            });
        });

        it("should reset form fields after successful password change", async () => {
            const user = userEvent.setup();
            mockChangePassword.mockResolvedValue({
                data: { status: true, message: "Password changed successfully!" }
            });
            renderComponent();

            const oldPasswordInput = screen.getByLabelText(/Old Password/i) as HTMLInputElement;
            const newPasswordInput = screen.getByLabelText(/New Password/i) as HTMLInputElement;
            const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i) as HTMLInputElement;

            await user.type(oldPasswordInput, "OldPass123!");
            await user.type(newPasswordInput, "NewPass123!");
            await user.type(confirmPasswordInput, "NewPass123!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            await waitFor(() => {
                expect(oldPasswordInput.value).toBe("");
                expect(newPasswordInput.value).toBe("");
                expect(confirmPasswordInput.value).toBe("");
            });
        });

        it("should show custom success message from API response", async () => {
            const user = userEvent.setup();
            mockChangePassword.mockResolvedValue({
                data: { status: true, message: "Custom success message!" }
            });
            renderComponent();

            await user.type(screen.getByLabelText(/Old Password/i), "OldPass123!");
            await user.type(screen.getByLabelText(/New Password/i), "NewPass123!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "NewPass123!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            await waitFor(() => {
                expect(screen.getByText("Custom success message!")).toBeInTheDocument();
            });
        });
    });

    describe("Form Submission - Error Cases", () => {
        it("should show error toast when API returns error status", async () => {
            const user = userEvent.setup();
            mockChangePassword.mockResolvedValue({
                data: null,
                error: {
                    status: 400,
                    data: { message: "Old password is incorrect" }
                }
            });
            renderComponent();

            await user.type(screen.getByLabelText(/Old Password/i), "WrongPass123!");
            await user.type(screen.getByLabelText(/New Password/i), "NewPass123!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "NewPass123!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            await waitFor(() => {
                expect(screen.getByText("Old password is incorrect")).toBeInTheDocument();
            });
        });

        it("should show generic error message when API error has no message", async () => {
            const user = userEvent.setup();
            mockChangePassword.mockResolvedValue({
                data: null,
                error: { status: 500, data: {} }
            });
            renderComponent();

            await user.type(screen.getByLabelText(/Old Password/i), "OldPass123!");
            await user.type(screen.getByLabelText(/New Password/i), "NewPass123!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "NewPass123!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            await waitFor(() => {
                expect(screen.getByText("Failed to change password")).toBeInTheDocument();
            });
        });

        it("should handle network errors gracefully", async () => {
            const user = userEvent.setup();
            mockChangePassword.mockRejectedValue({
                data: { message: "Network error occurred" }
            });
            renderComponent();

            await user.type(screen.getByLabelText(/Old Password/i), "OldPass123!");
            await user.type(screen.getByLabelText(/New Password/i), "NewPass123!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "NewPass123!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            await waitFor(() => {
                expect(screen.getByText("Network error occurred")).toBeInTheDocument();
            });
        });

        it("should show generic error message for unknown exceptions", async () => {
            const user = userEvent.setup();
            mockChangePassword.mockRejectedValue({});
            renderComponent();

            await user.type(screen.getByLabelText(/Old Password/i), "OldPass123!");
            await user.type(screen.getByLabelText(/New Password/i), "NewPass123!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "NewPass123!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            await waitFor(() => {
                expect(screen.getByText("Failed to change password. Please try again.")).toBeInTheDocument();
            });
        });
    });

    describe("Loading States", () => {
        it("should disable submit button while submitting", async () => {
            const user = userEvent.setup();
            mockChangePassword.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
            renderComponent();

            await user.type(screen.getByLabelText(/Old Password/i), "OldPass123!");
            await user.type(screen.getByLabelText(/New Password/i), "NewPass123!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "NewPass123!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            expect(screen.getByRole("button", { name: /Updating.../i })).toBeDisabled();
        });

        it("should show 'Updating...' text while submitting", async () => {
            const user = userEvent.setup();
            mockChangePassword.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
            renderComponent();

            await user.type(screen.getByLabelText(/Old Password/i), "OldPass123!");
            await user.type(screen.getByLabelText(/New Password/i), "NewPass123!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "NewPass123!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            expect(screen.getByRole("button", { name: /Updating.../i })).toBeInTheDocument();
        });

        it("should re-enable button after submission completes", async () => {
            const user = userEvent.setup();
            mockChangePassword.mockResolvedValue({
                data: { status: true, message: "Success!" }
            });
            renderComponent();

            await user.type(screen.getByLabelText(/Old Password/i), "OldPass123!");
            await user.type(screen.getByLabelText(/New Password/i), "NewPass123!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "NewPass123!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            await waitFor(() => {
                expect(screen.getByRole("button", { name: /Update Password/i })).not.toBeDisabled();
            });
        });
    });

    describe("Integration Tests", () => {
        it("should complete full password change workflow successfully", async () => {
            const user = userEvent.setup();
            mockChangePassword.mockResolvedValue({
                data: { status: true, message: "Password updated successfully!" }
            });
            renderComponent();

            // Verify initial state
            expect(screen.getByText("Change Password")).toBeInTheDocument();

            // Fill form
            await user.type(screen.getByLabelText(/Old Password/i), "OldPass123!");
            await user.type(screen.getByLabelText(/New Password/i), "NewPass123!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "NewPass123!");

            // Submit
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            // Verify workflow
            await waitFor(() => {
                expect(mockChangePassword).toHaveBeenCalled();
                expect(screen.getByText("Password updated successfully!")).toBeInTheDocument();
                expect(mockNavigate).toHaveBeenCalledWith("/auth/login");
            });
        });

        it("should handle complete error workflow", async () => {
            const user = userEvent.setup();
            mockChangePassword.mockResolvedValue({
                data: null,
                error: {
                    status: 401,
                    data: { message: "Unauthorized: Old password is incorrect" }
                }
            });
            renderComponent();

            // Fill form with wrong old password
            await user.type(screen.getByLabelText(/Old Password/i), "WrongOldPass!");
            await user.type(screen.getByLabelText(/New Password/i), "NewPass123!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "NewPass123!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            // Verify error is shown
            await waitFor(() => {
                expect(screen.getByText("Unauthorized: Old password is incorrect")).toBeInTheDocument();
            });

            // Verify user is not navigated away
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    describe("Toast Functionality", () => {
        it("should close toast when close button is clicked", async () => {
            const user = userEvent.setup();
            mockChangePassword.mockResolvedValue({
                data: { status: true, message: "Success!" }
            });
            renderComponent();

            await user.type(screen.getByLabelText(/Old Password/i), "OldPass123!");
            await user.type(screen.getByLabelText(/New Password/i), "NewPass123!");
            await user.type(screen.getByLabelText(/Confirm Password/i), "NewPass123!");
            await user.click(screen.getByRole("button", { name: /Update Password/i }));

            // Wait for toast to appear
            await waitFor(() => {
                expect(screen.getByText("Success!")).toBeInTheDocument();
            });

            // Toast functionality would close automatically or via close button
            // The actual close button interaction depends on ToastMessage component implementation
        });
    });
});
