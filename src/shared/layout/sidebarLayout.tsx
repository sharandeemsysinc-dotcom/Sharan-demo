import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import layout from './layout.module.css'
import { DynamicSidebarHover } from "../components/sidebar/sidebar";
import Header from "../components/header/header";

export default function Layout() {
  return (
    <Box sx={{ display: "flex" }}>
      <DynamicSidebarHover />

      <Box component="main" className={layout.main} sx={{ flexGrow: 1, p: 3 }}>
        <Header />
        <Outlet />
      </Box>
    </Box>
  );
}
