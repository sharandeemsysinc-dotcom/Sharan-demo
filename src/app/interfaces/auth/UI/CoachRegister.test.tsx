// CoachRegister.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import CoachRegister from "./CoachRegister";
import { Controller } from "react-hook-form";
import { useCreateCoachMutation } from "../../admin/coach/service/Coach";

// ---- Mock RTK Query Mutation ----
vi.mock("../../../../app/interfaces/admin/coach/service/Coach", () => ({
  useCreateCoachMutation: vi.fn(),
}));

// ---- Mock child components (Stepper & Input components) ----
vi.mock(
  "../../../../shared/components/stepper/Stepper",
  () => ({
    default: ({ steps, activeStep, onNext, onBack }: any) => (
      <div>
        {steps[activeStep]?.content}
        <button onClick={onBack}>Back</button>
        <button onClick={onNext}>Next</button>
      </div>
    ),
  })
);

vi.mock("../../../../shared/components/formFields/InputText", () => ({
  default: ({ name, control, label, placeholder, errors }: any) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div>
          <input
            {...field}
            aria-label={label || name}
            placeholder={placeholder}
            data-testid={name}
          />
          {errors?.[name] && <span data-testid={`error-${name}`}>{errors[name].message}</span>}
        </div>
      )}
    />
  ),
}));

vi.mock("../../../../shared/components/formFields/InputCheckbox", () => ({
  default: ({ name, control, label, errors }: any) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div>
          <div
            data-testid={name}
            onClick={() => {
              field.onChange(["Test Option"]);
            }}
          >
            {label}
          </div>
          {errors?.[name] && <span data-testid={`error-${name}`}>{errors[name].message}</span>}
        </div>
      )}
    />
  ),
}));

vi.mock("../../../../shared/components/formFields/InputRadio", () => ({
  default: ({ name, control, label, errors }: any) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div>
          <div
            data-testid={name}
            onClick={() => {
              if (name === "coaching_hours") {
                field.onChange(1);
              } else {
                field.onChange("Test Option");
              }
            }}
          >
            {label}
          </div>
          {errors?.[name] && <span data-testid={`error-${name}`}>{errors[name].message}</span>}
        </div>
      )}
    />
  ),
}));

vi.mock("../../../../shared/components/formFields/InputFileUpload", () => ({
  default: ({ name, control, errors }: any) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div>
          <input
            type="file"
            data-testid={name}
            onChange={(e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              if (name === "image_url") {
                field.onChange(files[0]);
              } else {
                field.onChange(files);
              }
            }}
          />
          {errors?.[name] && <span data-testid={`error-${name}`}>{errors[name].message}</span>}
        </div>
      )}
    />
  ),
}));

// Mock Toast and Loader
vi.mock("../../../../shared/components/toastMessage/ToastMessage", () => ({
  default: () => <div data-testid="toast" />
}));
vi.mock("../../../../shared/components/loader/Loader", () => ({
  default: () => <div>Loading...</div>
}));

// -------------------------------
//        TEST SUITE
// -------------------------------
describe("CoachRegister Component", () => {
  const mutate = vi.fn();

  beforeEach(() => {
    mutate.mockReset();
    mutate.mockReturnValue({ unwrap: () => Promise.resolve({ message: "Success" }) });
    (useCreateCoachMutation as any).mockReturnValue([mutate, { isLoading: false }]);
  });

  const setup = () => {
    return render(
      <BrowserRouter>
        <CoachRegister />
      </BrowserRouter>
    );
  };

  test("renders component with header", () => {
    setup();
    expect(screen.getByText("Coach Management")).toBeInTheDocument();
  });

  test("validates Step 1 and goes to next step", async () => {
    setup();
    const user = userEvent.setup();

    // Fill required Step 1 fields
    await user.type(screen.getByTestId("full_name"), "John Doe");
    await user.type(screen.getByTestId("email"), "test@test.com");
    await user.type(screen.getByTestId("mobile"), "1234567890");
    await user.type(screen.getByTestId("linked_url"), "https://linkedin.com/in/test");
    await user.type(screen.getByTestId("timezone"), "IST");

    await user.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(screen.getByText("Credentials Experience")).toBeInTheDocument();
    });
  });

  test("file upload works correctly", async () => {
    setup();
    const user = userEvent.setup();

    const fileInput = screen.getByTestId("image_url") as HTMLInputElement;

    const file = new File(["hello"], "photo.png", { type: "image/png" });

    await user.upload(fileInput, file);

    expect(fileInput.files![0].name).toBe("photo.png");
  });

  test("submits form successfully", async () => {
    setup();
    const user = userEvent.setup();

    // STEP 1
    await user.type(screen.getByTestId("full_name"), "John Doe");
    await user.type(screen.getByTestId("email"), "test@test.com");
    await user.type(screen.getByTestId("mobile"), "9999999999");
    await user.type(screen.getByTestId("linked_url"), "https://linkedin.com/test");
    await user.type(screen.getByTestId("timezone"), "IST");

    await user.click(screen.getByText("Next"));

    // STEP 2
    await user.click(screen.getByTestId("coaching_credentials"));
    await user.click(screen.getByTestId("coaching_hours"));
    await user.click(screen.getByTestId("industries"));
    await user.click(screen.getByTestId("leadership_levels"));

    await user.click(screen.getByText("Next"));

    // STEP 3
    await user.click(screen.getByTestId("clients_situation"));
    await user.click(screen.getByTestId("coaching_style"));

    await user.click(screen.getByText("Next"));

    // STEP 4
    await user.click(screen.getByTestId("session_rates"));
    await user.type(screen.getByTestId("coaching_boundaries"), "No unethical practices");
    await user.type(screen.getByTestId("collaboration_interest"), "Yes");

    await user.click(screen.getByText("Next")); // Submit



    await waitFor(() => {
      expect(mutate).toHaveBeenCalled();
    });
  }, 15000);

  test("Back button works correctly", async () => {
    setup();
    const user = userEvent.setup();

    // Verify we are on Step 1
    expect(screen.getByText("Basic Information")).toBeInTheDocument();

    // Fill Step 1 to move to next step
    await user.type(screen.getByTestId("full_name"), "John Doe");
    await user.type(screen.getByTestId("email"), "test@test.com");
    await user.type(screen.getByTestId("mobile"), "1234567890");
    await user.type(screen.getByTestId("linked_url"), "https://linkedin.com/in/test");
    await user.type(screen.getByTestId("timezone"), "IST");

    await user.click(screen.getByText("Next"));

    // Verify we are on Step 2
    await waitFor(() => {
      expect(screen.getByText("Credentials Experience")).toBeInTheDocument();
    });

    // Click Back
    await user.click(screen.getByText("Back"));

    // Verify we are back on Step 1
    expect(screen.getByText("Basic Information")).toBeInTheDocument();
  }, 15000);
});
