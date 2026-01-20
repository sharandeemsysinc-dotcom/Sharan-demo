import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Coach } from "../UI/Coach";
import { vi } from "vitest";

// Mock API Hooks
const mockRefetch = vi.fn();
const mockApproveReject = vi.fn();
const mockDelete = vi.fn();
const mockEnableDisable = vi.fn();

const mockData = {
    status: true,
    data: {
        items: [
            { id: 1, full_name: "Coach One", email: "c1@test.com", mobile: "123", coaching_hours: 50, status: 1 },
            { id: 2, full_name: "Coach Two", email: "c2@test.com", mobile: "456", coaching_hours: 200, status: 0 },
        ],
        totalCount: 20,
    },
};

vi.mock("../service/Coach", () => ({
    useGetAllCoachQuery: vi.fn(() => ({
        data: mockData,
        isLoading: false,
        refetch: mockRefetch,
    })),
    useApproveRejectCoachMutation: vi.fn(() => [mockApproveReject]),
    useDeleteCoachMutation: vi.fn(() => [mockDelete]),
    useEnableDisableCoachMutation: vi.fn(() => [mockEnableDisable]),
}));

// Mock Router
vi.mock("react-router-dom", () => ({
    useLocation: () => ({
        pathname: "/admin/coach", // Default to Manage Menu
    }),
}));

// Mock Child Components
vi.mock("../../../../../shared/components/table/Table", () => ({
    Table: ({ title, actions, rows, component }: any) => (
        <div data-testid="mock-table">
            <h2>{title}</h2>
            <div>{component}</div>
            {rows?.map((row: any) => (
                <div key={row.id} data-testid="table-row">
                    <span>{row.full_name}</span>
                    {actions.map((action: any, idx: number) => {
                        if (action.show && !action.show(row)) return null;
                        return (
                            <button key={idx} onClick={() => action.onClick(row)} aria-label={action.tooltip}>
                                {action.tooltip}
                            </button>
                        )
                    })}
                </div>
            ))}
        </div>
    ),
}));

vi.mock("../../../../../shared/components/pagination/Pagination", () => ({
    default: ({ page, onPageChange }: any) => (
        <button onClick={() => onPageChange(page + 1, 10)}>Next Page</button>
    ),
}));

vi.mock("../../../../../shared/components/dialog/Dialog", () => ({
    default: ({ open, title, buttons, component }: any) =>
        open ? (
            <div data-testid="mock-dialog">
                <h3>{title}</h3>
                {component}
                {buttons.map((btn: any, idx: number) => (
                    <button key={idx} onClick={btn.onClick}>
                        {btn.label}
                    </button>
                ))}
            </div>
        ) : null,
}));

vi.mock("../../../../../shared/components/formFields/InputTextArea", () => ({
    default: ({ onChange, placeholder }: any) => <textarea placeholder={placeholder} onChange={onChange} />
}))

vi.mock("../../../../../shared/components/toastMessage/ToastMessage", () => ({
    default: () => <div />
}))

vi.mock("../../../../../shared/components/formFields/InputText", () => ({
    default: ({ onChange, placeholder }: any) => <input placeholder={placeholder} onChange={onChange} />
}))

vi.mock("../../../../../shared/components/button/Button", () => ({
    default: ({ onClick, children }: any) => <button onClick={onClick}>{children}</button>
}))

// Mock Icons
vi.mock("@mui/icons-material/CheckCircleOutlined", () => ({ default: () => <span data-testid="icon-approve" /> }));
vi.mock("@mui/icons-material/CancelOutlined", () => ({ default: () => <span data-testid="icon-reject" /> }));
vi.mock("@mui/icons-material/RemoveRedEyeOutlined", () => ({ default: () => <span data-testid="icon-view" /> }));
vi.mock("@mui/icons-material/Delete", () => ({ default: () => <span data-testid="icon-delete" /> }));
vi.mock("@mui/icons-material/LockOpenOutlined", () => ({ default: () => <span data-testid="icon-enable" /> }));
vi.mock("@mui/icons-material/LockOutlined", () => ({ default: () => <span data-testid="icon-disable" /> }));
vi.mock("@mui/icons-material/ManageSearch", () => ({ default: () => <span data-testid="icon-search" /> }));
vi.mock("@mui/icons-material/LoginOutlined", () => ({ default: () => <span data-testid="icon-login" /> }));

// Mock MUI
vi.mock("@mui/material", () => ({
    Box: ({ children, className }: any) => <div className={className}>{children}</div>,
    Typography: ({ children, className }: any) => <span className={className}>{children}</span>,
    TextField: (props: any) => <input {...props} />,
    InputAdornment: ({ children }: any) => <span>{children}</span>,
}));

describe("Coach Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders Coach Management title correctly", () => {
        render(<Coach />);
        expect(screen.getByText("Coach Management")).toBeInTheDocument();
        expect(screen.getByText("Coaches")).toBeInTheDocument();
    });

    it("renders table data correctly", () => {
        render(<Coach />);
        expect(screen.getByText("Coach One")).toBeInTheDocument();
        expect(screen.getByText("Coach Two")).toBeInTheDocument();
    });

    it("handles Delete action", async () => {
        mockDelete.mockReturnValue({ unwrap: () => Promise.resolve({ status: true, message: "Deleted" }) });

        render(<Coach />);

        const deleteBtns = screen.getAllByLabelText("Delete Coach");
        fireEvent.click(deleteBtns[0]);

        expect(screen.getByTestId("mock-dialog")).toBeInTheDocument();
        expect(screen.getByText("Delete Coach")).toBeInTheDocument();

        // Use more specific selector for the Delete button in the dialog
        const confirmDeleteBtn = screen.getByRole('button', { name: 'Delete' });
        console.log("Clicking confirm delete button");
        fireEvent.click(confirmDeleteBtn);

        await waitFor(() => {
            console.log("Waiting for mockDelete");
            expect(mockDelete).toHaveBeenCalledWith(1);
        });
    });

    it("handles Disable action", async () => {
        mockEnableDisable.mockReturnValue({ unwrap: () => Promise.resolve({ status: true, message: "Disabled" }) });

        render(<Coach />);

        const disableBtn = screen.getByLabelText("Disable Coach");
        fireEvent.click(disableBtn);

        await waitFor(() => {
            expect(mockEnableDisable).toHaveBeenCalledWith({ id: 1, data: { status: 0 } });
        });
    });

    it("handles Enable action", async () => {
        mockEnableDisable.mockReturnValue({ unwrap: () => Promise.resolve({ status: true, message: "Enabled" }) });

        render(<Coach />);

        const enableBtn = screen.getByLabelText("Enable Coach");
        fireEvent.click(enableBtn);

        await waitFor(() => {
            expect(mockEnableDisable).toHaveBeenCalledWith({ id: 2, data: { status: 1 } });
        });
    });
});
