import { createTheme } from "@mui/material/styles";
declare module "@mui/material/Button" { }

const theme = createTheme({
  palette: {
    primary: { main: "#0e9f87" },
    secondary: { main: "#184e74" },

    //Default colors
    white: { main: "#ffffff" },
    black: { main: "#000000" },
    success: { main: "#08671e" },
    error: { main: "#dc3636" },
    warning: { main: "#ff9800" },

    // Add these to make them recognized by the color prop
    customFirst: { main: "#a2a2a2" },
    customSecond: { main: "#26b5d1ff" },
    customThird: { main: "#292828 " },
    logincardbackground: { main: "rgba(255, 255, 255, 0.15)" },
    logincardborder: { main: "rgba(255, 255, 255, 0.25)" },
    focusElement: { main: "#2ccfc4" },
    menuText: { main: "#606979" },
    sidebarBgColor: { main: "#eae7e7c9" },
    starColor: { main: "#faaf00" },
    statusSchedule: { main: "#1890FF" },
    statusRescheduled: { main: "#722ED1" },
    statusPending: { main: "#FAAD14" },
    statusRequested: { main: "#13C2C2" },
    sortIcon: {main: "#34dbce"}
  } as any,

  typography: {
    fontFamily: `"Inter", sans-serif`,
    fontWeightLight: 100,
    fontWeightRegular: 200,
    fontWeightMedium: 300,
    fontWeightBold: 400,

    // Default size uses mobile-first (xs)
    h1: {
      fontWeight: 700,
      fontSize: "1.8rem",
      [`@media (min-width:600px)`]: { fontSize: "2.2rem" },   // sm
      [`@media (min-width:900px)`]: { fontSize: "2.5rem" },   // md
      [`@media (min-width:1200px)`]: { fontSize: "3rem" },    // lg
      [`@media (min-width:1536px)`]: { fontSize: "3.3rem" },  // xl
    },

    h2: {
      fontWeight: 700,
      fontSize: "1.5rem",
      [`@media (min-width:600px)`]: { fontSize: "1.8rem" },
      [`@media (min-width:900px)`]: { fontSize: "2rem" },
      [`@media (min-width:1200px)`]: { fontSize: "2.2rem" },
      [`@media (min-width:1536px)`]: { fontSize: "2.5rem" },
    },

    h3: {
      fontWeight: 600,
      fontSize: "1.25rem",
      [`@media (min-width:600px)`]: { fontSize: "1.5rem" },
      [`@media (min-width:900px)`]: { fontSize: "1.75rem" },
      [`@media (min-width:1200px)`]: { fontSize: "2rem" },
    },

    h4: {
      fontWeight: 600,
      fontSize: "1.1rem",  // xs
      [`@media (min-width:600px)`]: { fontSize: "1.25rem" }, // sm
      [`@media (min-width:900px)`]: { fontSize: "1.5rem" },  // md
      [`@media (min-width:1200px)`]: { fontSize: "1.6rem" }, // lg
    },

    h5: {
      fontWeight: 500,
      fontSize: "1rem",  // xs
      [`@media (min-width:600px)`]: { fontSize: "1.1rem" },  // sm
      [`@media (min-width:900px)`]: { fontSize: "1.25rem" }, // md
      [`@media (min-width:1200px)`]: { fontSize: "1.4rem" }, // lg
    },

    h6: {
      fontWeight: 400,
      fontSize: "0.9rem",  // xs
      [`@media (min-width:600px)`]: { fontSize: "1rem" },    // sm
      [`@media (min-width:900px)`]: { fontSize: "1.1rem" },  // md
      [`@media (min-width:1200px)`]: { fontSize: "1.25rem" },// lg
    },

    body1: {
      fontSize: "0.85rem",
      [`@media (min-width:600px)`]: { fontSize: "0.9rem" },
      [`@media (min-width:900px)`]: { fontSize: "1rem" },
    },

    body2: {
      fontSize: "0.75rem",
      fontWeight: 400,
      [`@media (min-width:600px)`]: { fontSize: "0.875rem" },
      [`@media (min-width:900px)`]: { fontSize: "0.9rem" },
    },

    label: {
      fontSize: "0.7rem",
      color: "#666",
      [`@media (min-width:600px)`]: { fontSize: "0.8rem" },
      [`@media (min-width:900px)`]: { fontSize: "0.875rem" },
    },
  } as any,
});

document.documentElement.style.setProperty("--primary-main", theme.palette.primary.main);
document.documentElement.style.setProperty("--secondary-main", theme.palette.secondary.main);
document.documentElement.style.setProperty("--white-main", theme.palette.common.white);
document.documentElement.style.setProperty("--black-main", theme.palette.common.black);
document.documentElement.style.setProperty("--success-main", theme.palette.success.main);
document.documentElement.style.setProperty("--error-main", theme.palette.error.main);
document.documentElement.style.setProperty("--warning-main", theme.palette.warning.main);
document.documentElement.style.setProperty("--customFirst-main", (theme.palette as any).customFirst.main);
document.documentElement.style.setProperty("--customSecond-main", (theme.palette as any).customSecond.main);
document.documentElement.style.setProperty("--customThird-main", (theme.palette as any).customThird.main);
document.documentElement.style.setProperty("--logincardborder-main  ", (theme.palette as any).logincardborder.main);
document.documentElement.style.setProperty("--logincardbackground-main", (theme.palette as any).logincardbackground.main);
document.documentElement.style.setProperty("--focusElement-main", (theme.palette as any).focusElement.main);
document.documentElement.style.setProperty("--menuText-main", (theme.palette as any).menuText.main);
document.documentElement.style.setProperty("--sidebarBgColor-main", (theme.palette as any).sidebarBgColor.main);
document.documentElement.style.setProperty("--starColor-main", (theme.palette as any).starColor.main);
document.documentElement.style.setProperty("--statusSchedule-main", (theme.palette as any).statusSchedule.main);
document.documentElement.style.setProperty("--statusRescheduled-main", (theme.palette as any).statusRescheduled.main);
document.documentElement.style.setProperty("--statusPending-main", (theme.palette as any).statusPending.main);
document.documentElement.style.setProperty("--statusRequested-main", (theme.palette as any).statusRequested.main);
document.documentElement.style.setProperty("--sortIcon-main", (theme.palette as any).sortIcon.main);
export default theme;