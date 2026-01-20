// DynamicSidebarHover.test.tsx
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

// --- Mocks ---
// Mock the asset import used in the component
vi.mock("../../../assets/images/logo.webp", () => ({ default: "logo-path" }));

// Mock CSS Module (Sidebar.module.scss)
vi.mock("./Sidebar.module.scss", () => ({
  default: {
    logoContainer: "logoContainer",
    logo: "logo",
    userContainer: "userContainer",
    avatarBackground: "avatarBackground",
    dot1: "dot1",
    dot2: "dot2",
    dot3: "dot3",
    dot4: "dot4",
    dot5: "dot5",
    profileName: "profileName",
    profileMail: "profileMail",
    menuLabel: "menuLabel",
    menuItems: "menuItems",
    open: "open",
    active: "active",
    menuButton: "menuButton",
    menuButtonOpen: "menuButtonOpen",
    menuButtonActive: "menuButtonActive",
    menuLabelItems: "menuLabelItems",
    menuLabelItemsOpen: "menuLabelItemsOpen",
    error: "error",
  }
}));

// Mock UserAvatar component to keep test simple
vi.mock("../avatar/Avatar", () => {
  return {
    __esModule: true,
    default: ({ size, name, src }: any) => (
      <img alt={`avatar-${name}`} src={src} data-size={size} />
    ),
  };
});

// Mock react-redux useSelector
const mockUseSelector = vi.fn();
vi.mock("react-redux", async () => {
  const actual = await vi.importActual<any>("react-redux");
  return {
    ...actual,
    useSelector: (fn: any) => mockUseSelector(fn),
  };
});

// Mock react-router-dom: useNavigate and useLocation
const mockNavigate = vi.fn();
let mockPathname = "/";
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: mockPathname }),
  };
});

// Mock navItems module referenced by the component
vi.mock("../../constant", () => {
  const SignalCellularAltIcon = () => <span data-testid="icon-signal" />;
  const GridOnIcon = () => <span data-testid="icon-grid" />;
  const PeopleAltIcon = () => <span data-testid="icon-people" />;
  const Diversity3Icon = () => <span data-testid="icon-div3" />;
  const Diversity2Icon = () => <span data-testid="icon-div2" />;
  const GroupAddIcon = () => <span data-testid="icon-group" />;
  const DvrIcon = () => <span data-testid="icon-dvr" />;
  const AssignmentTurnedInIcon = () => <span data-testid="icon-assign" />;
  const HistoryIcon = () => <span data-testid="icon-history" />;
  const TuneIcon = () => <span data-testid="icon-tune" />;
  const ExitToAppIcon = () => <span data-testid="icon-exit" />;

  return {
    navItems: {
      adminMenuItems: [
        { path: "/admin/dashboad", label: "Dashboard", icon: <SignalCellularAltIcon /> },
        { path: "/admin/staff", label: "Staff", icon: <GridOnIcon /> },
        { path: "/admin/employee", label: "Employees", icon: <PeopleAltIcon /> },
      ],
      staffMenuItems: [
        { path: "/partner/dashboard", label: "Dashboard", icon: <SignalCellularAltIcon /> },
        { path: "/partner/products", label: "Products", icon: <GridOnIcon /> },
      ],
      coachMenuItems: [
        { path: "/employee/products", label: "Products", icon: <GridOnIcon /> },
      ],
      clientMenuItems: [
        { path: "/employee/products", label: "Products", icon: <GridOnIcon /> },
      ],
    },
  };
});

// --- Import the component under test AFTER mocks are declared ---
import DynamicSidebarHover from "./Sidebar";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  mockPathname = "/";
});

describe("DynamicSidebarHover", () => {
  test("renders closed by default (logo/user info not visible)", () => {
    // set scope to Admin
    mockUseSelector.mockReturnValue("Admin");
    const { container } = render(<DynamicSidebarHover />);

    // Logo should not be in the document when closed
    const logo = screen.queryByAltText("Logo");
    expect(logo).toBeNull();

    // User avatar (mocked) should not be present
    const avatar = screen.queryByAltText("avatar-profile");
    expect(avatar).toBeNull();

    // Menu items text should exist in DOM (ListItemText still rendered), but
    // their visible label might be hidden by CSS. We'll ensure they are present in the tree.
    expect(container.textContent).toContain("Dashboard");
    expect(container.textContent).toContain("Staff");
    expect(container.textContent).toContain("Employees");
  });

  test("opens on mouse enter and shows logo, user card and menu heading", async () => {
    const user = userEvent.setup();
    mockUseSelector.mockReturnValue("Admin");
    const { container } = render(<DynamicSidebarHover />);

    // Find the MUI Drawer root element
    const drawer = container.querySelector(".MuiDrawer-root")!;
    expect(drawer).toBeTruthy();

    // Hover (open)
    await user.hover(drawer);

    // Now the logo and user info should be visible
    const logo = await screen.findByAltText("Logo");
    expect(logo).toBeInTheDocument();

    const profileName = screen.getByText("Mark Joseph");
    expect(profileName).toBeInTheDocument();

    const menuHeading = screen.getByText("Main Menu");
    expect(menuHeading).toBeInTheDocument();
  });

  test("collapses on mouse leave (logo and user info hidden again)", async () => {
    const user = userEvent.setup();
    mockUseSelector.mockReturnValue("Admin");
    const { container } = render(<DynamicSidebarHover />);

    const drawer = container.querySelector(".MuiDrawer-root")!;
    // open
    await user.hover(drawer);
    expect(await screen.findByAltText("Logo")).toBeInTheDocument();

    // leave
    await user.unhover(drawer);

    // logo should be gone
    expect(screen.queryByAltText("Logo")).toBeNull();
    // user info should be gone
    expect(screen.queryByText("Mark Joseph")).toBeNull();
  });

  test("renders admin menu when scope is Admin", async () => {
    const user = userEvent.setup();
    mockUseSelector.mockReturnValue("Admin");
    const { container } = render(<DynamicSidebarHover />);
    // open sidebar
    const drawer = container.querySelector(".MuiDrawer-root")!;
    await user.hover(drawer);

    // Expect admin items to be in the document
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Staff")).toBeInTheDocument();
    expect(screen.getByText("Employees")).toBeInTheDocument();
  });

  test("renders staff menu when scope is Staff", async () => {
    const user = userEvent.setup();
    mockUseSelector.mockReturnValue("Staff");
    const { container } = render(<DynamicSidebarHover />);
    const drawer = container.querySelector(".MuiDrawer-root")!;
    await user.hover(drawer);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    // Should not see Admin items
    expect(screen.queryByText("Employees")).toBeNull();
  });

  test("renders coach menu when scope is Coach", async () => {
    const user = userEvent.setup();
    mockUseSelector.mockReturnValue("Coach");
    const { container } = render(<DynamicSidebarHover />);
    const drawer = container.querySelector(".MuiDrawer-root")!;
    await user.hover(drawer);

    expect(screen.getByText("Products")).toBeInTheDocument();
    // Should not see Admin items
    expect(screen.queryByText("Staff")).toBeNull();
  });

  test("renders admin menu by default when scope is unknown", async () => {
    const user = userEvent.setup();
    mockUseSelector.mockReturnValue("UnknownScope");
    const { container } = render(<DynamicSidebarHover />);
    const drawer = container.querySelector(".MuiDrawer-root")!;
    await user.hover(drawer);

    // Should fallback to Admin items
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Staff")).toBeInTheDocument();
    expect(screen.getByText("Employees")).toBeInTheDocument();
  });

  test("clicking a menu item calls navigate with correct path", async () => {
    const user = userEvent.setup();
    mockUseSelector.mockReturnValue("Admin");
    const { container } = render(<DynamicSidebarHover />);

    // open
    const drawer = container.querySelector(".MuiDrawer-root")!;
    await user.hover(drawer);

    const staffButton = screen.getByText("Staff").closest("[role='button']");
    expect(staffButton).toBeTruthy();

    // click
    await user.click(staffButton!);
    expect(mockNavigate).toHaveBeenCalledWith("/admin/staff");
  });

  test("active route highlighting is applied when location matches", async () => {
    const user = userEvent.setup();
    // set location to a route for Employees
    mockPathname = "/admin/employee";
    mockUseSelector.mockReturnValue("Admin");

    const { container } = render(<DynamicSidebarHover />);
    const drawer = container.querySelector(".MuiDrawer-root")!;
    await user.hover(drawer);

    // Find the Employees button and check its class includes the 'active' class from css module
    const employeesButton = screen.getByText("Employees").closest("[role='button']");
    expect(employeesButton).toBeTruthy();
    expect(employeesButton!.className).toContain("active");
  });
});
