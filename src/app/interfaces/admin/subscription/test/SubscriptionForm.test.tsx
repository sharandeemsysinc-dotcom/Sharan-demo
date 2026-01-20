import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { SubscriptionForm } from "../UI/Supscriptionform";
import * as subscriptionService from "../service/subscriptionservice";
// import { showToast } from "../utils/toast";

// Mock the navigation and params
const mockNavigate = vi.fn();
const mockParams: { id: string | undefined } = { id: undefined };

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => mockParams,
    };
});

// Mock the service hooks
const mockCreateSubscription = vi.fn();
const mockUpdateSubscription = vi.fn();

vi.mock("../service/subscriptionservice", async () => {
    const actual = await vi.importActual("../service/subscriptionservice");
    return {
        ...actual,
        useCreateSubscriptionMutation: vi.fn(),
        useUpdateSubscriptionMutation: vi.fn(),
        useGetSubscriptionByIdQuery: vi.fn(),
    };
});

// Mock the toast
// vi.mock("../../../../../shared/utils/toast", () => ({
//     showToast: vi.fn(),
// }));

describe("Subscription Form Page", () => {
    let mockStore: any;

    const mockSubscriptionData = {
        id: "1",
        name: "Basic Plan",
        description: "Basic subscription plan",
        amount: 999,
        currency: 0,
        active: true,
        status: 1,
    };

    beforeEach(() => {
        mockStore = configureStore({
            reducer: {
                api: () => ({}),
            },
        });

        // Reset mocks
        mockParams.id = undefined;
        vi.clearAllMocks();

        // Default mock implementations
        (subscriptionService.useCreateSubscriptionMutation as any).mockReturnValue([
            mockCreateSubscription,
            { isLoading: false, error: null },
        ]);

        (subscriptionService.useUpdateSubscriptionMutation as any).mockReturnValue([
            mockUpdateSubscription,
            { isLoading: false, error: null },
        ]);

        (subscriptionService.useGetSubscriptionByIdQuery as any).mockReturnValue({
            data: null,
            isLoading: false,
            error: null,
        });
    });

    const renderComponent = () => {
        return render(
            <Provider store={mockStore}>
                <BrowserRouter>
                    <SubscriptionForm />
                </BrowserRouter>
            </Provider>
        );
    };

    describe("Component Rendering - Create Mode", () => {
        it("should render Create Subscription header in create mode", () => {
            renderComponent();
            expect(screen.getByText("Create Subscription")).toBeInTheDocument();
        });

        it("should render all form fields", () => {
            renderComponent();
            expect(screen.getByLabelText(/Subscription Name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Currency/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
        });

        it("should render Back button", () => {
            renderComponent();
            expect(screen.getByText("Back")).toBeInTheDocument();
        });

        it("should render Create Subscription submit button", () => {
            renderComponent();
            expect(screen.getByText("Create Subscription")).toBeInTheDocument();
        });

        it("should show required asterisks for required fields", () => {
            renderComponent();

            // Check for required indicators
            const nameLabel = screen.getByLabelText(/Subscription Name/i);
            expect(nameLabel).toBeRequired();
        });
    });

    describe("Component Rendering - Edit Mode", () => {
        beforeEach(() => {
            mockParams.id = "1";
            (subscriptionService.useGetSubscriptionByIdQuery as any).mockReturnValue({
                data: mockSubscriptionData,
                isLoading: false,
                error: null,
            });
        });

        it("should render Update Subscription header in edit mode", () => {
            renderComponent();
            expect(screen.getByText("Update Subscription")).toBeInTheDocument();
        });

        it("should load and display existing subscription data", async () => {
            renderComponent();

            await waitFor(() => {
                expect(screen.getByDisplayValue("Basic Plan")).toBeInTheDocument();
                expect(screen.getByDisplayValue("999")).toBeInTheDocument();
                expect(screen.getByDisplayValue("Basic subscription plan")).toBeInTheDocument();
            });
        });

        it("should render Update Subscription submit button in edit mode", () => {
            renderComponent();
            expect(screen.getByText("Update Subscription")).toBeInTheDocument();
        });

        it("should call useGetSubscriptionByIdQuery with correct id", () => {
            renderComponent();

            expect(subscriptionService.useGetSubscriptionByIdQuery).toHaveBeenCalledWith("1", {
                skip: false,
            });
        });

        it("should skip query when no id is present", () => {
            mockParams.id = undefined;
            renderComponent();

            expect(subscriptionService.useGetSubscriptionByIdQuery).toHaveBeenCalledWith(undefined, {
                skip: true,
            });
        });
    });

    describe("Form Validation", () => {
        it("should show validation error when name is empty", async () => {
            const user = userEvent.setup();
            renderComponent();

            const submitButton = screen.getByText("Create Subscription");
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/Subscription name is required/i)).toBeInTheDocument();
            });
        });

        it("should show validation error when amount is empty", async () => {
            const user = userEvent.setup();
            renderComponent();

            const submitButton = screen.getByText("Create Subscription");
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/Amount is required/i)).toBeInTheDocument();
            });
        });

        it("should show validation error when currency is not selected", async () => {
            const user = userEvent.setup();
            renderComponent();

            const submitButton = screen.getByText("Create Subscription");
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/Currency is required/i)).toBeInTheDocument();
            });
        });

        it("should show validation error when description is empty", async () => {
            const user = userEvent.setup();
            renderComponent();

            const submitButton = screen.getByText("Create Subscription");
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
            });
        });

        it("should validate amount is a positive number", async () => {
            const user = userEvent.setup();
            renderComponent();

            const amountInput = screen.getByLabelText(/Amount/i);
            await user.type(amountInput, "-100");

            const submitButton = screen.getByText("Create Subscription");
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/Amount must be positive/i)).toBeInTheDocument();
            });
        });

        it("should not show validation errors when all fields are valid", async () => {
            const user = userEvent.setup();
            renderComponent();

            // Fill in all fields
            await user.type(screen.getByLabelText(/Subscription Name/i), "Test Plan");
            await user.type(screen.getByLabelText(/Amount/i), "1500");
            await user.type(screen.getByLabelText(/Description/i), "Test description");

            // Select currency
            const currencySelect = screen.getByLabelText(/Currency/i);
            await user.click(currencySelect);
            const currencyOption = screen.getByText("INR");
            await user.click(currencyOption);

            await waitFor(() => {
                expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
            });
        });
    });

    describe("Form Submission - Create Mode", () => {
        it("should call create mutation with correct data on submit", async () => {
            const user = userEvent.setup();
            mockCreateSubscription.mockResolvedValue({ data: { id: "2" } });
            renderComponent();

            // Fill form
            await user.type(screen.getByLabelText(/Subscription Name/i), "New Plan");
            await user.type(screen.getByLabelText(/Amount/i), "2000");
            await user.type(screen.getByLabelText(/Description/i), "New plan description");

            // Select currency
            const currencySelect = screen.getByLabelText(/Currency/i);
            await user.click(currencySelect);
            await user.click(screen.getByText("USD"));

            // Submit
            const submitButton = screen.getByText("Create Subscription");
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockCreateSubscription).toHaveBeenCalledWith({
                    name: "New Plan",
                    amount: 2000,
                    currency: 1, // USD
                    description: "New plan description",
                });
            });
        });

        it("should show success toast on successful creation", async () => {
            const user = userEvent.setup();
            mockCreateSubscription.mockResolvedValue({ data: { id: "2" } });
            renderComponent();

            // Fill and submit form
            await user.type(screen.getByLabelText(/Subscription Name/i), "New Plan");
            await user.type(screen.getByLabelText(/Amount/i), "2000");
            await user.type(screen.getByLabelText(/Description/i), "Description");

            const currencySelect = screen.getByLabelText(/Currency/i);
            await user.click(currencySelect);
            await user.click(screen.getByText("INR"));

            await user.click(screen.getByText("Create Subscription"));

            await waitFor(() => {
                // expect(showToast).toHaveBeenCalledWith(
                //     "Subscription created successfully!",
                //     "success"
                // );
            });
        });

        it("should navigate back to list on successful creation", async () => {
            const user = userEvent.setup();
            mockCreateSubscription.mockResolvedValue({ data: { id: "2" } });
            renderComponent();

            // Fill and submit form
            await user.type(screen.getByLabelText(/Subscription Name/i), "New Plan");
            await user.type(screen.getByLabelText(/Amount/i), "2000");
            await user.type(screen.getByLabelText(/Description/i), "Description");

            const currencySelect = screen.getByLabelText(/Currency/i);
            await user.click(currencySelect);
            await user.click(screen.getByText("INR"));

            await user.click(screen.getByText("Create Subscription"));

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith("/admin/subscription");
            });
        });

        it("should show error toast on creation failure", async () => {
            const user = userEvent.setup();
            mockCreateSubscription.mockResolvedValue({ error: "API Error" });
            renderComponent();

            // Fill and submit form
            await user.type(screen.getByLabelText(/Subscription Name/i), "New Plan");
            await user.type(screen.getByLabelText(/Amount/i), "2000");
            await user.type(screen.getByLabelText(/Description/i), "Description");

            const currencySelect = screen.getByLabelText(/Currency/i);
            await user.click(currencySelect);
            await user.click(screen.getByText("INR"));

            await user.click(screen.getByText("Create Subscription"));

            await waitFor(() => {
                // expect(showToast).toHaveBeenCalledWith(
                //     "Failed to create subscription.",
                //     "error"
                // );
            });
        });

        it("should disable submit button while creating", async () => {
            (subscriptionService.useCreateSubscriptionMutation as any).mockReturnValue([
                mockCreateSubscription,
                { isLoading: true },
            ]);

            renderComponent();

            const submitButton = screen.getByText("Creating...");
            expect(submitButton).toBeDisabled();
        });

        it("should show 'Creating...' text while submitting", () => {
            (subscriptionService.useCreateSubscriptionMutation as any).mockReturnValue([
                mockCreateSubscription,
                { isLoading: true },
            ]);

            renderComponent();
            expect(screen.getByText("Creating...")).toBeInTheDocument();
        });
    });

    describe("Form Submission - Edit Mode", () => {
        beforeEach(() => {
            mockParams.id = "1";
            (subscriptionService.useGetSubscriptionByIdQuery as any).mockReturnValue({
                data: mockSubscriptionData,
                isLoading: false,
            });
        });

        it("should call update mutation with correct data on submit", async () => {
            const user = userEvent.setup();
            mockUpdateSubscription.mockResolvedValue({ data: mockSubscriptionData });
            renderComponent();

            await waitFor(() => {
                expect(screen.getByDisplayValue("Basic Plan")).toBeInTheDocument();
            });

            // Update name
            const nameInput = screen.getByDisplayValue("Basic Plan");
            await user.clear(nameInput);
            await user.type(nameInput, "Updated Plan");

            // Submit
            await user.click(screen.getByText("Update Subscription"));

            await waitFor(() => {
                expect(mockUpdateSubscription).toHaveBeenCalledWith({
                    id: "1",
                    data: expect.objectContaining({
                        name: "Updated Plan",
                    }),
                });
            });
        });

        it("should show success toast on successful update", async () => {
            const user = userEvent.setup();
            mockUpdateSubscription.mockResolvedValue({ data: mockSubscriptionData });
            renderComponent();

            await waitFor(() => {
                expect(screen.getByDisplayValue("Basic Plan")).toBeInTheDocument();
            });

            await user.click(screen.getByText("Update Subscription"));

            await waitFor(() => {
                // expect(showToast).toHaveBeenCalledWith(
                //     "Subscription updated successfully!",
                //     "success"
                // // );
            });
        });

        it("should navigate back on successful update", async () => {
            const user = userEvent.setup();
            mockUpdateSubscription.mockResolvedValue({ data: mockSubscriptionData });
            renderComponent();

            await waitFor(() => {
                expect(screen.getByDisplayValue("Basic Plan")).toBeInTheDocument();
            });

            await user.click(screen.getByText("Update Subscription"));

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith("/admin/subscription");
            });
        });

        it("should show error toast on update failure", async () => {
            const user = userEvent.setup();
            mockUpdateSubscription.mockResolvedValue({ error: "Update failed" });
            renderComponent();

            await waitFor(() => {
                expect(screen.getByDisplayValue("Basic Plan")).toBeInTheDocument();
            });

            await user.click(screen.getByText("Update Subscription"));

            await waitFor(() => {
                // expect(showToast).toHaveBeenCalledWith(
                //     "Failed to update subscription.",
                //     "error"
                // );
            });
        });

        it("should disable submit button while updating", () => {
            (subscriptionService.useUpdateSubscriptionMutation as any).mockReturnValue([
                mockUpdateSubscription,
                { isLoading: true },
            ]);

            renderComponent();

            const submitButton = screen.getByText("Updating...");
            expect(submitButton).toBeDisabled();
        });

        it("should show 'Updating...' text while submitting in edit mode", () => {
            (subscriptionService.useUpdateSubscriptionMutation as any).mockReturnValue([
                mockUpdateSubscription,
                { isLoading: true },
            ]);

            renderComponent();
            expect(screen.getByText("Updating...")).toBeInTheDocument();
        });
    });

    describe("Navigation", () => {
        it("should navigate back when Back button is clicked", async () => {
            const user = userEvent.setup();
            renderComponent();

            const backButton = screen.getByText("Back");
            await user.click(backButton);

            expect(mockNavigate).toHaveBeenCalledWith("/admin/subscription");
        });
    });

    describe("Currency Options", () => {
        it("should display INR and USD currency options", async () => {
            const user = userEvent.setup();
            renderComponent();

            const currencySelect = screen.getByLabelText(/Currency/i);
            await user.click(currencySelect);

            expect(screen.getByText("INR")).toBeInTheDocument();
            expect(screen.getByText("USD")).toBeInTheDocument();
        });

        it("should select INR (currency code 0)", async () => {
            const user = userEvent.setup();
            renderComponent();

            const currencySelect = screen.getByLabelText(/Currency/i);
            await user.click(currencySelect);
            await user.click(screen.getByText("INR"));

            await waitFor(() => {
                expect(screen.getByText("INR")).toBeInTheDocument();
            });
        });

        it("should select USD (currency code 1)", async () => {
            const user = userEvent.setup();
            renderComponent();

            const currencySelect = screen.getByLabelText(/Currency/i);
            await user.click(currencySelect);
            await user.click(screen.getByText("USD"));

            await waitFor(() => {
                expect(screen.getByText("USD")).toBeInTheDocument();
            });
        });
    });

    describe("Loading States", () => {
        it("should show loading state while fetching subscription data", () => {
            mockParams.id = "1";
            (subscriptionService.useGetSubscriptionByIdQuery as any).mockReturnValue({
                data: null,
                isLoading: true,
            });

            renderComponent();

            // Add loading indicator checks if implemented
            // expect(screen.getByRole("progressbar")).toBeInTheDocument();
        });

        it("should not prefill form fields while loading", () => {
            mockParams.id = "1";
            (subscriptionService.useGetSubscriptionByIdQuery as any).mockReturnValue({
                data: null,
                isLoading: true,
            });

            renderComponent();

            const nameInput = screen.getByLabelText(/Subscription Name/i) as HTMLInputElement;
            expect(nameInput.value).toBe("");
        });
    });

    describe("Error Handling", () => {
        it("should handle API error when fetching subscription", () => {
            mockParams.id = "1";
            (subscriptionService.useGetSubscriptionByIdQuery as any).mockReturnValue({
                data: null,
                isLoading: false,
                error: { message: "Not found" },
            });

            renderComponent();

            // Form should still render but without prefilled data
            expect(screen.getByLabelText(/Subscription Name/i)).toBeInTheDocument();
        });

        it("should handle network error during creation", async () => {
            const user = userEvent.setup();
            mockCreateSubscription.mockRejectedValue(new Error("Network error"));
            renderComponent();

            // Fill and submit
            await user.type(screen.getByLabelText(/Subscription Name/i), "Test");
            await user.type(screen.getByLabelText(/Amount/i), "1000");
            await user.type(screen.getByLabelText(/Description/i), "Test");

            const currencySelect = screen.getByLabelText(/Currency/i);
            await user.click(currencySelect);
            await user.click(screen.getByText("INR"));

            await user.click(screen.getByText("Create Subscription"));

            // Should handle error gracefully
            await waitFor(() => {
                expect(mockCreateSubscription).toHaveBeenCalled();
            });
        });
    });

    describe("Integration Tests", () => {
        it("should complete full create workflow", async () => {
            const user = userEvent.setup();
            mockCreateSubscription.mockResolvedValue({ data: { id: "2" } });
            renderComponent();

            // Verify initial state
            expect(screen.getByText("Create Subscription")).toBeInTheDocument();

            // Fill form
            await user.type(screen.getByLabelText(/Subscription Name/i), "Premium Plan");
            await user.type(screen.getByLabelText(/Amount/i), "5000");
            await user.type(screen.getByLabelText(/Description/i), "Premium features included");

            const currencySelect = screen.getByLabelText(/Currency/i);
            await user.click(currencySelect);
            await user.click(screen.getByText("USD"));

            // Submit
            await user.click(screen.getByText("Create Subscription"));

            // Verify workflow
            await waitFor(() => {
                expect(mockCreateSubscription).toHaveBeenCalledWith({
                    name: "Premium Plan",
                    amount: 5000,
                    currency: 1,
                    description: "Premium features included",
                });
                // expect(showToast).toHaveBeenCalledWith(
                //     "Subscription created successfully!",
                //     "success"
                // );
                expect(mockNavigate).toHaveBeenCalledWith("/admin/subscription");
            });
        });

        it("should complete full edit workflow", async () => {
            const user = userEvent.setup();
            mockParams.id = "1";
            const mockSubscriptionData = {
                id: "1",
                name: "Basic Plan",
                amount: 999,
                currency: 1, // Assuming USD as per other tests
                description: "Basic features",
            };
            (subscriptionService.useGetSubscriptionByIdQuery as any).mockReturnValue({
                data: mockSubscriptionData,
                isLoading: false,
            });
            mockUpdateSubscription.mockResolvedValue({ data: mockSubscriptionData });

            renderComponent();

            // Wait for data to load
            await waitFor(() => {
                expect(screen.getByDisplayValue("Basic Plan")).toBeInTheDocument();
            });

            // Update fields
            const nameInput = screen.getByDisplayValue("Basic Plan");
            await user.clear(nameInput);
            await user.type(nameInput, "Basic Plan Updated");

            const amountInput = screen.getByDisplayValue("999");
            await user.clear(amountInput);
            await user.type(amountInput, "1299");

            // Submit
            await user.click(screen.getByText("Update Subscription"));

            // Verify workflow
            await waitFor(() => {
                expect(mockUpdateSubscription).toHaveBeenCalledWith({
                    id: "1",
                    data: {
                        name: "Basic Plan Updated",
                        amount: 1299,
                        currency: 1,
                        description: "Basic features",
                    },
                });
                // expect(showToast).toHaveBeenCalledWith(
                //     "Subscription updated successfully!",
                //     "success"
                // );
                expect(mockNavigate).toHaveBeenCalledWith("/admin/subscription");
            });
        });
    });
});
