//Import Packages
import * as React from "react";
import { Box, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, useMediaQuery, Collapse, } from "@mui/material";
import { styled, type Theme, type CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

//Import Files
import logo from "../../../assets/images/logo.webp";
import sidebar from "./Sidebar.module.scss";
import { selectCurrentScope } from "../../../app/stores/authSlice";
import { navItems } from "../../constant";

const drawerWidth = 270;
const miniDrawerWidth = 56; // Width for mobile mini sidebar

// OPEN style
const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

// CLOSED style for mobile mini sidebar
const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: miniDrawerWidth,
});

const DrawerHeader = styled("div")(({ theme }) => ({
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})<{
    open?: boolean;
}>(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open
        ? {
            ...openedMixin(theme),
            "& .MuiDrawer-paper": openedMixin(theme),
        }
        : {
            ...closedMixin(theme),
            "& .MuiDrawer-paper": closedMixin(theme),
        }),
}));

// Helper function to check if a menu item or any of its children is active
const isMenuItemActive = (item: any, locationPathname: string): boolean => {
    // If item has a path, check if it matches
    if (item.path) {
        return locationPathname === item.path || locationPathname.startsWith(item.path + "/");
    }

    // If item has children, check if any child is active
    if (Array.isArray(item.children)) {
        return item.children.some((child: any) =>
            locationPathname === child.path || locationPathname.startsWith(child.path + "/")
        );
    }

    return false;
};

// Helper function to check if it's a parent menu with active child
const isParentWithActiveChild = (item: any, locationPathname: string): boolean => {
    if (!Array.isArray(item.children)) return false;
    return item.children.some((child: any) =>
        locationPathname === child.path || locationPathname.startsWith(child.path + "/")
    );
};

// Helper function to check if item itself is active (not children)
const isItemItselfActive = (item: any, locationPathname: string): boolean => {
    return item.path && (locationPathname === item.path || locationPathname.startsWith(item.path + "/"));
};

// FINAL COMPONENT
export const DynamicSidebarHover = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const scope = useSelector(selectCurrentScope);

    const isDesktop = useMediaQuery("(min-width:992px)");

    // Sidebar open state - always open on desktop
    const [open, setOpen] = React.useState(isDesktop);

    // Mobile drawer open state
    const [mobileOpen, setMobileOpen] = React.useState(false);

    // Hover Menu State (for desktop)
    const [hoveredMenu, setHoveredMenu] = React.useState<string | null>(null);

    // Expanded menus state (for mobile temporary drawer)
    const [expandedMenus, setExpandedMenus] = React.useState<Set<string>>(new Set());

    // Auto set sidebar based on screen size
    React.useEffect(() => {
        if (isDesktop) {
            setOpen(true); // always open on desktop
            setMobileOpen(false); // close mobile drawer
        } else {
            setOpen(false); // mini sidebar on mobile
        }
    }, [isDesktop]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
        // Clear expanded menus when closing mobile drawer
        if (mobileOpen) {
            setExpandedMenus(new Set());
        }
    };

    const handleMenuItemClick = () => {
        if (!isDesktop) {
            setMobileOpen(false);
            setExpandedMenus(new Set()); // Clear expanded menus
        }
    };

    const isActiveRoute = (itemPath: string) => {
        return location.pathname === itemPath || location.pathname.startsWith(itemPath + "/");
    };

    const getMenuItems = () => {
        if (scope === "Admin") return navItems.adminMenuItems;
        else if (scope === "Staff") return navItems.staffMenuItems;
        else if (scope === "Coach") return navItems.coachMenuItems;
        else return navItems.clientMenuItems;
    };

    const menuItems = getMenuItems();

    // Toggle expanded menu on mobile
    const handleToggleMenu = (menuLabel: string) => {
        const newExpandedMenus = new Set(expandedMenus);
        if (newExpandedMenus.has(menuLabel)) {
            newExpandedMenus.delete(menuLabel);
        } else {
            newExpandedMenus.add(menuLabel);
        }
        setExpandedMenus(newExpandedMenus);
    };

    // Check if a menu item should show children on desktop
    const shouldShowChildrenOnDesktop = (item: any) => {
        const isParentActive = isParentWithActiveChild(item, location.pathname);
        return hoveredMenu === item.label || isParentActive;
    };

    // Check if a menu item should show children on mobile
    const shouldShowChildrenOnMobile = (item: any) => {
        const isParentActive = isParentWithActiveChild(item, location.pathname);
        return expandedMenus.has(item.label) || isParentActive;
    };

    return (
        <Box className={sidebar.sidebarWrapper}>

            {/* MOBILE MENU BUTTON — positioned in the mini sidebar */}
            {!isDesktop && (
                <Box className={sidebar.mobileMenuButtonContainer}>
                    <IconButton
                        onClick={handleDrawerToggle}
                        className={sidebar.mobileMenuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
            )}

            {/* PERMANENT DRAWER - Different behavior for desktop/mobile */}
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    '& .MuiDrawer-paper': {
                        zIndex: 1100,
                    },
                }}
            >
                <DrawerHeader
                    className={open ? sidebar.desktopOpen : sidebar.desktopClosed}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: open ? "16px" : "8px 0",
                        gap: "8px",
                    }}
                >
                    {/* Show menu button ONLY in closed mini mode */}
                    {!open && !isDesktop && (
                        <IconButton onClick={handleDrawerToggle}>
                            <MenuIcon />
                        </IconButton>
                    )}

                    {/* Show logo */}
                    {open ? (
                        <Box className={sidebar.logoContainer}>
                            <img src={logo} alt="Logo" className={sidebar.logo} />
                        </Box>
                    ) : (
                        <Box className={sidebar.logoMini}>
                            <img src={logo} alt="Logo" />
                        </Box>
                    )}
                </DrawerHeader>


                <Divider />

                <List className={`${open ? "py-1" : ""} ${sidebar.items}`}>
                    {menuItems.map((item: any, index: number) => {
                        const hasChildren = Array.isArray(item.children);
                        const isParentActive = hasChildren &&
                            isParentWithActiveChild(item, location.pathname);
                        const isItemActive = isItemItselfActive(item, location.pathname);
                        const isMenuItemActiveFlag = isMenuItemActive(item, location.pathname);

                        // For standalone menus (no children): active when their path matches
                        // For parent menus: active in closed state only if any child is active
                        // In open state, parent menus should NOT be active (only submenus)
                        const shouldShowActive = !hasChildren
                            ? isItemActive // Standalone menu: active when its path matches
                            : !open && isParentActive; // Parent menu: active only in closed state when child is active

                        return (
                            <Box
                                key={index}
                                onMouseEnter={() => hasChildren && open && setHoveredMenu(item.label)}
                                onMouseLeave={() => hasChildren && open && setHoveredMenu(null)}
                            >
                                <ListItem disablePadding className={sidebar.listItemBlock}>
                                    <ListItemButton
                                        onClick={() => {
                                            if (hasChildren) {
                                                if (isDesktop) {
                                                    // On desktop with hover, clicking parent doesn't navigate
                                                    return;
                                                } else {
                                                    // On mobile mini sidebar, clicking parent opens the temporary drawer
                                                    setMobileOpen(true);
                                                    // If parent is active, expand it automatically
                                                    if (isParentActive) {
                                                        setTimeout(() => {
                                                            handleToggleMenu(item.label);
                                                        }, 100);
                                                    }
                                                }
                                            } else {
                                                navigate(item.path);
                                                if (!isDesktop) {
                                                    setMobileOpen(true);
                                                }
                                            }
                                        }}
                                        className={`${sidebar.menuItems} ${open ? sidebar.open : ""} 
                                        ${shouldShowActive ? sidebar.active : ""}`}
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: open ? 3 : 2,
                                        }}
                                    >
                                        <ListItemIcon
                                            className={`${sidebar.menuButton} ${open ? sidebar.menuButtonOpen : ""} 
                                            ${shouldShowActive ? sidebar.menuButtonActive : ""}`}
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 2 : 'auto',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>

                                        {open && (
                                            <>
                                                <ListItemText
                                                    primary={item.label}
                                                    className={`${sidebar.menuLabelItems} ${open ? sidebar.menuLabelItemsOpen : ""}`}
                                                    sx={{ opacity: open ? 1 : 0 }}
                                                />

                                                {hasChildren && (
                                                    <ListItemIcon className={sidebar.arrowIcon}>
                                                        {shouldShowChildrenOnDesktop(item) ? (
                                                            <ExpandMoreIcon />
                                                        ) : (
                                                            <ChevronRightIcon />
                                                        )}
                                                    </ListItemIcon>
                                                )}
                                            </>
                                        )}
                                    </ListItemButton>
                                </ListItem>

                                {/* Children only visible when sidebar is open (desktop hover) */}
                                {open && hasChildren && shouldShowChildrenOnDesktop(item) && (
                                    <List className={sidebar.nestedList}>
                                        {item.children.map((child: any, cIndex: number) => (
                                            <ListItem key={cIndex} disablePadding>
                                                <ListItemButton
                                                    onClick={() => navigate(child.path)}
                                                    className={`${sidebar.subMenuItems} ${isActiveRoute(child.path) ? sidebar.active : ""}`}
                                                    sx={{
                                                        pl: 3,
                                                        width:20
                                                    }}
                                                >
                                                    <ListItemIcon
                                                        className={`${sidebar.subMenuButton} ${isActiveRoute(child.path) ? sidebar.menuButtonActive : ""}`}
                                                        sx={{
                                                            minWidth: 35,
                                                        }}
                                                    >
                                                        {child.icon}
                                                    </ListItemIcon>

                                                    <ListItemText
                                                        primary={child.label}
                                                        className={`${sidebar.menuLabelItems} ${open ? sidebar.menuLabelItemsOpen : ""}`}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Box>
                        );
                    })}
                </List>
                <Divider />
            </Drawer>

            {/* TEMPORARY MOBILE DRAWER - Opens OVER the outlet */}
            {!isDesktop && (
                <MuiDrawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => {
                        setMobileOpen(false);
                        setExpandedMenus(new Set()); // Clear expanded menus
                    }}
                    ModalProps={{
                        keepMounted: true, // Better mobile performance
                    }}
                    className={sidebar.mobileDrawer}
                >
                    <DrawerHeader className={sidebar.mobileDrawerHeader}>
                        <Box className={sidebar.logoContainer}>
                            <img src={logo} alt="Logo" className={sidebar.logo} />
                        </Box>
                    </DrawerHeader>

                    <Divider />

                    <List className={`py-1 ${sidebar.items}`}>
                        {menuItems.map((item: any, index: number) => {
                            const hasChildren = Array.isArray(item.children);
                            const isParentActive = hasChildren &&
                                isParentWithActiveChild(item, location.pathname);
                            const isExpanded = shouldShowChildrenOnMobile(item);
                            const isItemActive = isItemItselfActive(item, location.pathname);

                            return (
                                <Box key={index}>
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            onClick={() => {
                                                if (hasChildren) {
                                                    // Toggle expand/collapse for parent menu
                                                    handleToggleMenu(item.label);
                                                } else {
                                                    // Navigate for non-parent menu items
                                                    navigate(item.path);
                                                    handleMenuItemClick();
                                                }
                                            }}
                                            className={`${sidebar.menuItems} ${sidebar.open} 
                                            ${isItemActive ? sidebar.active : ""}`}
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: 'initial',
                                                px: 3,
                                            }}
                                        >
                                            <ListItemIcon
                                                className={`${sidebar.menuButton} ${sidebar.menuButtonOpen} 
                                                ${isItemActive ? sidebar.menuButtonActive : ""}`}
                                                sx={{
                                                    minWidth: 0,
                                                    mr: 2,
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {item.icon}
                                            </ListItemIcon>

                                            <ListItemText
                                                primary={item.label}
                                                className={`${sidebar.menuLabelItems} ${sidebar.menuLabelItemsOpen}`}
                                            />

                                            {hasChildren && (
                                                <ListItemIcon className={sidebar.arrowIcon}>
                                                    {isExpanded ? (
                                                        <ExpandMoreIcon />
                                                    ) : (
                                                        <ChevronRightIcon />
                                                    )}
                                                </ListItemIcon>
                                            )}
                                        </ListItemButton>
                                    </ListItem>

                                    {/* Show children on mobile only when expanded */}
                                    {hasChildren && (
                                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                            <List className={sidebar.nestedList}>
                                                {item.children.map((child: any, cIndex: number) => (
                                                    <ListItem key={cIndex} disablePadding>
                                                        <ListItemButton
                                                            onClick={() => {
                                                                navigate(child.path);
                                                                handleMenuItemClick();
                                                            }}
                                                            className={`${sidebar.subMenuItems} ${isActiveRoute(child.path) ? sidebar.active : ""}`}
                                                            sx={{
                                                                pl: 3,
                                                            }}
                                                        >
                                                            <ListItemIcon
                                                                className={`${sidebar.subMenuButton} ${isActiveRoute(child.path) ? sidebar.menuButtonActive : ""}`}
                                                                sx={{
                                                                    minWidth: 35,
                                                                }}
                                                            >
                                                                {child.icon}
                                                            </ListItemIcon>

                                                            <ListItemText
                                                                primary={child.label}
                                                                className={`${sidebar.menuLabelItems} ${sidebar.menuLabelItemsOpen}`}
                                                            />
                                                        </ListItemButton>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Collapse>
                                    )}
                                </Box>
                            );
                        })}
                    </List>
                    <Divider />
                </MuiDrawer>
            )}

            {/* DrawerHeader for spacing on desktop */}
            {isDesktop && <DrawerHeader />}
        </Box>
    );
}