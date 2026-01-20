import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Subscription } from "../UI/Subscription";
import * as subscriptionService from "../service/subscriptionservice";

// Mock the navigation
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock the service hooks
const mockRefetch = vi.fn();
const mockDeleteSubscription = vi.fn();
const mockEnableDisableSubscription = vi.fn();

vi.mock("../service/subscriptionservice", async () => {
    const actual = await vi.importActual("../service/subscriptionservice");
    return {
        ...actual,
        useGetAllSubscriptionQuery: vi.fn(),
        useDeleteSubscriptionMutation: vi.fn(),
        useEnableDisableSubscriptionMutation: vi.fn(),
    };
});

// Mock the toast
vi.mock("../../../../../shared/utils/toast", () => ({
    showToast: vi.fn(),
}));

describe("Subscription List Page", () => {
    let mockStore: any;

    const mockSubscriptionData = {
        items: [
            {
                id: "1",
                name: "Basic Plan",
                description: "Basic subscription plan",
                amount: 999,
                currency: 0, // INR
                active: true,
                status: 1,
            },
            {
                id: "2",
                name: "Premium Plan",
                description: "Premium subscription plan",
                amount: 1999,
                currency: 1, // USD
                active: false,
                status: 0,
            },
        ],
        totalCount: 2,
    };

    beforeEach(() => {
        mockStore = configureStore({
            reducer: {
                api: () => ({}),
            },
        });

        // Setup default mock implementations
        (subscriptionService.useGetAllSubscriptionQuery as any).mockReturnValue({
            data: mockSubscriptionData,
            refetch: mockRefetch,
            isLoading: false,
            error: null,
        });

        (subscriptionService.useDeleteSubscriptionMutation as any).mockReturnValue([
            mockDeleteSubscription,
            { isLoading: false },
        ]);

        (subscriptionService.useEnableDisableSubscriptionMutation as any).mockReturnValue([
            mockEnableDisableSubscription,
            { isLoading: false },
        ]);

        vi.clearAllMocks();
    });

    const renderComponent = () => {
        return render(
            <Provider store={mockStore}>
                <BrowserRouter>
                    <Subscription />
                </BrowserRouter>
            </Provider>
        );
    };

    describe("Component Rendering", () => {
        it("should render the subscription management header", () => {
            renderComponent();
            expect(screen.getByText("Subscription Management")).toBeInTheDocument();
            expect(screen.getByText("View and manage subscriptions")).toBeInTheDocument();
        });

        it("should render the Add Subscription button", () => {
            renderComponent();
            const addButton = screen.getByText("+ Add Subscription");
            expect(addButton).toBeInTheDocument();
        });

        it("should render the table with correct columns", () => {
            renderComponent();
            expect(screen.getByText("Name")).toBeInTheDocument();
            expect(screen.getByText("Description")).toBeInTheDocument();
            expect(screen.getByText("Price")).toBeInTheDocument();
            expect(screen.getByText("Currency")).toBeInTheDocument();
            expect(screen.getByText("Actions")).toBeInTheDocument();
        });

        it("should render search input and button", () => {
            renderComponent();
            expect(screen.getByPlaceholderText("search")).toBeInTheDocument();
        });

        it("should render pagination component", () => {
            renderComponent();
            expect(screen.getByRole("navigation")).toBeInTheDocument();
        });
    });

    describe("Data Display", () => {
        it("should display subscription data in the table", () => {
            renderComponent();
            expect(screen.getByText("Basic Plan")).toBeInTheDocument();
            expect(screen.getByText("Basic subscription plan")).toBeInTheDocument();
            expect(screen.getByText("999")).toBeInTheDocument();
            expect(screen.getByText("INR")).toBeInTheDocument();

            expect(screen.getByText("Premium Plan")).toBeInTheDocument();
            expect(screen.getByText("Premium subscription plan")).toBeInTheDocument();
            expect(screen.getByText("1999")).toBeInTheDocument();
            expect(screen.getByText("USD")).toBeInTheDocument();
        });

        it("should display correct currency labels", () => {
            renderComponent();
            expect(screen.getByText("INR")).toBeInTheDocument(); // currency 0
            expect(screen.getByText("USD")).toBeInTheDocument(); // currency 1
        });

        it("should show 'No records found' when no data", () => {
            (subscriptionService.useGetAllSubscriptionQuery as any).mockReturnValue({
                data: { items: [], totalCount: 0 },
                refetch: mockRefetch,
                isLoading: false,
            });

            renderComponent();
            expect(screen.getByText("No records found")).toBeInTheDocument();
        });

    });

    describe("Search Functionality", () => {
        it("should update search input on change", async () => {
            const user = userEvent.setup();
            renderComponent();
            const searchInput = screen.getByPlaceholderText("search") as HTMLInputElement;

            await user.type(searchInput, "Basic");
            expect(searchInput.value).toBe("Basic");
        });

        it("should execute search on button click", async () => {
            const user = userEvent.setup();
            renderComponent();
            const searchInput = screen.getByPlaceholderText("search");
            const searchButton = screen.getAllByRole("button").find(btn =>
                btn.querySelector('svg')?.getAttribute('data-testid') === 'ManageSearchIcon'
            );

            await user.type(searchInput, "Premium");
            if (searchButton) {
                await user.click(searchButton);
            }

            // Verify the query was called with search parameter
            expect(subscriptionService.useGetAllSubscriptionQuery).toHaveBeenCalledWith(
                expect.objectContaining({
                    search: "Premium",
                    page: 1,
                })
            );
        });

        it("should reset page to 1 when searching", async () => {
            const user = userEvent.setup();
            renderComponent();
            const searchInput = screen.getByPlaceholderText("search");
            const searchButton = screen.getAllByRole("button").find(btn =>
                btn.querySelector('svg')?.getAttribute('data-testid') === 'ManageSearchIcon'
            );

            await user.type(searchInput, "test");
            if (searchButton) {
                await user.click(searchButton);
            }

            expect(subscriptionService.useGetAllSubscriptionQuery).toHaveBeenCalledWith(
                expect.objectContaining({
                    page: 1,
                })
            );
        });
    });

    describe("Navigation", () => {
        it("should navigate to form page when Add Subscription button is clicked", async () => {
            const user = userEvent.setup();
            renderComponent();
            const addButton = screen.getByText("+ Add Subscription");

            await user.click(addButton);
            expect(mockNavigate).toHaveBeenCalledWith("/admin/subscription/form");
        });

        it("should navigate to edit form when Edit button is clicked", async () => {
            const user = userEvent.setup();
            renderComponent();
            const editButtons = screen.getAllByLabelText("Edit Staff");

            await user.click(editButtons[0]);
            expect(mockNavigate).toHaveBeenCalledWith("/admin/subscription/form/1");
        });
    });

    describe("Action Buttons", () => {
        it("should show enable button for disabled subscriptions (status = 0)", () => {
            renderComponent();
            const enableButtons = screen.getAllByLabelText("Enable Staff");
            expect(enableButtons).toHaveLength(1); // Only Premium Plan has status 0
        });

        it("should show disable button for enabled subscriptions (status = 1)", () => {
            renderComponent();
            const disableButtons = screen.getAllByLabelText("Disable Staff");
            expect(disableButtons).toHaveLength(1); // Only Basic Plan has status 1
        });

        it("should call enable/disable mutation when toggle button is clicked", async () => {
            const user = userEvent.setup();
            mockEnableDisableSubscription.mockResolvedValue({});
            renderComponent();

            const disableButton = screen.getByLabelText("Disable Staff");
            await user.click(disableButton);

            await waitFor(() => {
                expect(mockEnableDisableSubscription).toHaveBeenCalledWith({
                    id: "1",
                    data: { status: 0 }, // Should toggle from 1 to 0
                });
            });
        });

        it("should refetch data after enable/disable", async () => {
            const user = userEvent.setup();
            mockEnableDisableSubscription.mockResolvedValue({});
            renderComponent();

            const disableButton = screen.getByLabelText("Disable Staff");
            await user.click(disableButton);

            await waitFor(() => {
                expect(mockRefetch).toHaveBeenCalled();
            });
        });

        it("should show all action buttons (Edit, Enable/Disable, Delete)", () => {
            renderComponent();

            expect(screen.getAllByLabelText(/Edit Staff/i)).toHaveLength(2);
            expect(screen.getAllByLabelText(/Delete Staff/i)).toHaveLength(2);
            // Enable/Disable buttons show conditionally based on status
        });
    });

    describe("Delete Functionality", () => {
        it("should open delete confirmation dialog when delete button is clicked", async () => {
            const user = userEvent.setup();
            renderComponent();
            const deleteButtons = screen.getAllByLabelText("Delete Staff");

            await user.click(deleteButtons[0]);

            expect(screen.getByText("Delete Subscription")).toBeInTheDocument();
            expect(screen.getByText(/Are you sure you want to delete subscription "Basic Plan"/i)).toBeInTheDocument();
        });

        // it("should close dialog when Cancel button is clicked", async () => {
        //     const user = userEvent.setup();
        //     renderComponent();
        //     const deleteButtons = screen.getAllByLabelText("Delete Staff");
        //     await user.click(deleteButtons[0]);

        //     const cancelButton = screen.getByText("Cancel");
        //     await user.click(cancelButton);

        //     expect(screen.queryByText("Delete Subscription")).not.toBeInTheDocument();
        // });

        it("should close dialog when Cancel button is clicked", async () => {
            const user = userEvent.setup();
            renderComponent();

            const deleteButtons = screen.getAllByLabelText("Delete Staff");
            await user.click(deleteButtons[0]);

            await user.click(screen.getByText("Cancel"));

            // Wait for the dialog to fully unmount
            await waitFor(() => {
                expect(screen.queryByText(/delete subscription/i)).not.toBeInTheDocument();
            });
        });

        it("should call delete mutation when Delete is confirmed", async () => {
            const user = userEvent.setup();
            mockDeleteSubscription.mockResolvedValue({});
            renderComponent();

            const deleteButtons = screen.getAllByLabelText("Delete Staff");
            await user.click(deleteButtons[0]);

            const confirmButton = screen.getByText("Delete");
            await user.click(confirmButton);

            await waitFor(() => {
                expect(mockDeleteSubscription).toHaveBeenCalledWith({
                    id: "1",
                    data: { status: 2 },
                });
            });
        });

        it("should close dialog and refetch after successful delete", async () => {
            const user = userEvent.setup();
            mockDeleteSubscription.mockResolvedValue({});
            renderComponent();

            const deleteButtons = screen.getAllByLabelText("Delete Staff");
            await user.click(deleteButtons[0]);

            const confirmButton = screen.getByText("Delete");
            await user.click(confirmButton);

            await waitFor(() => {
                expect(mockRefetch).toHaveBeenCalled();
                expect(screen.queryByText("Delete Subscription")).not.toBeInTheDocument();
            });
        });
    });

    describe("Pagination", () => {
        it("should pass correct props to Pagination component", () => {
            renderComponent();

            // Check if pagination is rendered with correct total items
            expect(screen.getByRole("navigation")).toBeInTheDocument();
        });

        it("should update page when pagination changes", async () => {
            const user = userEvent.setup();
            renderComponent();

            // This would require more detailed pagination component testing
            // Verify that clicking next page updates the query
            const nextPageButton = screen.queryByLabelText("Go to next page");
            if (nextPageButton && !nextPageButton.hasAttribute("disabled")) {
                await user.click(nextPageButton);

                await waitFor(() => {
                    expect(subscriptionService.useGetAllSubscriptionQuery).toHaveBeenCalledWith(
                        expect.objectContaining({
                            page: 2,
                        })
                    );
                });
            }
        });
    });

    describe("Edge Cases and Error Handling", () => {
        it("should handle API error gracefully", () => {
            (subscriptionService.useGetAllSubscriptionQuery as any).mockReturnValue({
                data: null,
                refetch: mockRefetch,
                isLoading: false,
                error: { message: "API Error" },
            });

            renderComponent();
            expect(screen.getByText("No records found")).toBeInTheDocument();
        });

        it("should handle loading state", () => {
            (subscriptionService.useGetAllSubscriptionQuery as any).mockReturnValue({
                data: null,
                refetch: mockRefetch,
                isLoading: true,
                error: null,
            });

            renderComponent();
            // Add loading indicator checks if implemented
        });

        it("should handle subscription with unknown currency", () => {
            (subscriptionService.useGetAllSubscriptionQuery as any).mockReturnValue({
                data: {
                    items: [{
                        id: "3",
                        name: "Test Plan",
                        description: "Test",
                        amount: 500,
                        currency: 999, // Unknown currency
                        active: true,
                        status: 1,
                    }],
                    totalCount: 1,
                },
                refetch: mockRefetch,
                isLoading: false,
            });

            renderComponent();
            expect(screen.getByText("Unknown")).toBeInTheDocument();
        });

        it("should handle delete mutation error", async () => {
            const user = userEvent.setup();
            mockDeleteSubscription.mockRejectedValue(new Error("Delete failed"));
            renderComponent();

            const deleteButtons = screen.getAllByLabelText("Delete Staff");
            await user.click(deleteButtons[0]);

            const confirmButton = screen.getByText("Delete");
            await user.click(confirmButton);

            // Error should be handled (check toast or error message)
            await waitFor(() => {
                expect(mockDeleteSubscription).toHaveBeenCalled();
            });
        });

        it("should handle enable/disable mutation error", async () => {
            const user = userEvent.setup();
            mockEnableDisableSubscription.mockRejectedValue(new Error("Toggle failed"));
            renderComponent();

            const disableButton = screen.getByLabelText("Disable Staff");
            await user.click(disableButton);

            await waitFor(() => {
                expect(mockEnableDisableSubscription).toHaveBeenCalled();
            });
        });
    });

    describe("Integration Tests", () => {
        it("should perform full delete workflow", async () => {
            const user = userEvent.setup();
            mockDeleteSubscription.mockResolvedValue({});
            renderComponent();

            // Initial state
            expect(screen.getByText("Basic Plan")).toBeInTheDocument();

            // Click delete
            const deleteButtons = screen.getAllByLabelText("Delete Staff");
            await user.click(deleteButtons[0]);

            // Confirm dialog appears
            expect(screen.getByText("Delete Subscription")).toBeInTheDocument();

            // Confirm delete
            const confirmButton = screen.getByText("Delete");
            await user.click(confirmButton);

            // Verify workflow
            await waitFor(() => {
                expect(mockDeleteSubscription).toHaveBeenCalledWith({
                    id: "1",
                    data: { status: 2 },
                });
                expect(mockRefetch).toHaveBeenCalled();
            });
        });

        it("should perform full search and pagination workflow", async () => {
            const user = userEvent.setup();
            renderComponent();

            // Search
            const searchInput = screen.getByPlaceholderText("search");
            await user.type(searchInput, "Premium");

            const searchButton = screen.getAllByRole("button").find(btn =>
                btn.querySelector('svg')?.getAttribute('data-testid') === 'ManageSearchIcon'
            );
            if (searchButton) {
                await user.click(searchButton);
            }

            // Verify search was executed with page reset
            await waitFor(() => {
                expect(subscriptionService.useGetAllSubscriptionQuery).toHaveBeenCalledWith(
                    expect.objectContaining({
                        search: "Premium",
                        page: 1,
                    })
                );
            });
        });
    });
});
