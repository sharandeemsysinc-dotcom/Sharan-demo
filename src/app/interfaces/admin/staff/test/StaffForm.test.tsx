import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { vi } from "vitest";

import { StaffForm } from "../UI/StaffForm";

// ---- Mock variables ----
const mockSaveStaff = vi.fn();
const mockUpdateStaff = vi.fn();
let shouldReturnStaff = false;

// ---- Mock RTK Query ----
vi.mock("../service/staffs", () => ({
  useSaveStaffMutation: () => [mockSaveStaff, { isLoading: false }],
  useUpdateStaffMutation: () => [mockUpdateStaff, { isLoading: false }],
  useGetStaffByIdQuery: () =>
    shouldReturnStaff
      ? {
          data: {
            name: "Existing User",
            email: "existing@mail.com",
            mobile: "9999999999",
            image_url: "",
          },
          isSuccess: true,
        }
      : { data: null, isSuccess: false },
}));

// ---- Mock Navigation ----
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ---- Test store ----
const createTestStore = () =>
  configureStore({
    reducer: {},
  });

const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <Provider store={createTestStore()}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );

// ----------- TESTS -------------
describe("StaffForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    shouldReturnStaff = false;
  });

  test("renders form and submit button", () => {
    renderWithProviders(<StaffForm />);
    expect(screen.getByText(/Basic Information/i)).toBeInTheDocument();

    // Pick the button with label "Submit" specifically
    const submitButton = screen.getAllByRole("button").find(btn =>
      btn.textContent?.toLowerCase().includes("submit")
    );
    expect(submitButton).toBeInTheDocument();
  });

  test("should call saveStaff when submitting valid form", async () => {
    renderWithProviders(<StaffForm />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@mail.com" },
    });

    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "9876543210" },
    });

    const submitButton = screen.getAllByRole("button").find(btn =>
      btn.textContent?.toLowerCase().includes("submit")
    )!;
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSaveStaff).toHaveBeenCalledTimes(1);
    });
  });

  test("should NOT call mutation when required fields are empty", async () => {
    renderWithProviders(<StaffForm />);

    const submitButton = screen.getAllByRole("button").find(btn =>
      btn.textContent?.toLowerCase().includes("submit")
    )!;
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSaveStaff).not.toHaveBeenCalled();
    });
  }); 
});
