import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Register from "./ClientRegister";
import { vi } from "vitest";

// Mock child components to simplify testing
vi.mock("../../../../shared/components/formFields/InputText", () => ({
    default: ({ name, label, control, errors, ...props }: any) => (
        <div>
            <label htmlFor={name}>{label}</label>
            <input id={name} name={name} {...props} onChange={(e) => control.register(name).onChange(e)} />
            {errors[name] && <span>{errors[name].message}</span>}
        </div>
    ),
}));

vi.mock("../../../../shared/components/formFields/InputNumber", () => ({
    default: ({ name, label, control, errors, ...props }: any) => (
        <div>
            <label htmlFor={name}>{label}</label>
            <input id={name} name={name} {...props} onChange={(e) => control.register(name).onChange(e)} />
            {errors[name] && <span>{errors[name].message}</span>}
        </div>
    ),
}));

vi.mock("../../../../shared/components/formFields/InputAutoComplete", () => ({
    default: ({ name, label, control, errors, ...props }: any) => (
        <div>
            <label htmlFor={name}>{label}</label>
            <input id={name} name={name} {...props} onChange={(e) => control.register(name).onChange(e)} />
            {errors[name] && <span>{errors[name].message}</span>}
        </div>
    ),
}));

vi.mock("../../../../shared/components/formFields/InputSelect", () => ({
    default: ({ name, label, control, errors, ...props }: any) => (
        <div>
            <label htmlFor={name}>{label}</label>
            <input id={name} name={name} {...props} onChange={(e) => control.register(name).onChange(e)} />
            {errors[name] && <span>{errors[name].message}</span>}
        </div>
    ),
}));

vi.mock("../../../../shared/components/formFields/InputFileUpload", () => ({
    default: ({ name, label, control, errors, ...props }: any) => (
        <div>
            <label htmlFor={name}>{label}</label>
            <input id={name} name={name} {...props} onChange={(e) => control.register(name).onChange(e)} />
            {errors[name] && <span>{errors[name].message}</span>}
        </div>
    ),
}));

vi.mock("../../../../shared/components/formFields/InputCheckbox", () => ({
    default: ({ name, label, control, errors, options, ...props }: any) => (
        <div>
            <label>{label}</label>
            {options?.map((opt: any) => (
                <div key={opt.value}>
                    <label htmlFor={`${name}-${opt.value}`}>{opt.label}</label>
                    <input type="checkbox" id={`${name}-${opt.value}`} name={name} value={opt.value} {...props} onChange={(e) => control.register(name).onChange(e)} />
                </div>
            ))}
            {errors[name] && <span>{errors[name].message}</span>}
        </div>
    ),
}));

vi.mock("../../../../shared/components/formFields/InputRadio", () => ({
    default: ({ name, label, control, errors, options, ...props }: any) => (
        <div>
            <label>{label}</label>
            {options?.map((opt: any) => (
                <div key={opt.value}>
                    <label htmlFor={`${name}-${opt.value}`}>{opt.label}</label>
                    <input type="radio" id={`${name}-${opt.value}`} name={name} value={opt.value} {...props} onChange={(e) => control.register(name).onChange(e)} />
                </div>
            ))}
            {errors[name] && <span>{errors[name].message}</span>}
        </div>
    ),
}));


describe("ClientRegister Component", () => {
    it("should validate Step 1 fields before moving to Step 2", async () => {
        render(<Register />);
        const user = userEvent.setup();

        // Try to click Next without filling fields
        const nextButton = screen.getByText("Next");
        await user.click(nextButton);

        // Expect validation errors
        expect(await screen.findByText("Full Name is required")).toBeInTheDocument();
        expect(screen.getByText("Email is required")).toBeInTheDocument();

        // Should still be on Step 1
        expect(screen.getByText("Enter Your Basic Information")).toBeInTheDocument();
    });

    it("should move to Step 2 when Step 1 is valid", async () => {
        render(<Register />);
        const user = userEvent.setup();

        // Fill Step 1 fields
        await user.type(screen.getByLabelText("Full Name"), "John Doe");
        await user.type(screen.getByLabelText("Email"), "john@example.com");
        await user.type(screen.getByLabelText("Mobile"), "1234567890");
        await user.type(screen.getByLabelText("City"), "New York");
        await user.type(screen.getByLabelText("Time Zone"), "UTC"); // Mocked as input
        await user.type(screen.getByLabelText("LinkedIn"), "https://linkedin.com/in/johndoe");
        await user.type(screen.getByLabelText("Website/portfolio"), "https://johndoe.com");

        // Mock file upload as text input
        await user.type(screen.getByLabelText("Add Photo"), "profile.jpg");

        const nextButton = screen.getByText("Next");
        await user.click(nextButton);

        // Debug errors
        // screen.debug(); 

        // Should be on Step 2
        await waitFor(() => {
            const errorMessages = screen.queryAllByText(/required/i);
            if (errorMessages.length > 0) {
                console.log("Validation errors found:", errorMessages.map(e => e.textContent));
            }
            expect(screen.getByText("Role and Coaching Goals")).toBeInTheDocument();
        });
    });
});
