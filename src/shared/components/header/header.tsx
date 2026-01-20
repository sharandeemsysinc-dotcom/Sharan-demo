import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";

import styles from "./header.module.scss";
import { useNavigate } from "react-router-dom";

/* 🔹 RTK QUERY MUTATIONS */
import { useGetClientByIdMutation } from "../../../app/interfaces/admin/client/service/Client";
import { useGetCoachByIdMutation } from "../../../app/interfaces/admin/coach/service/Coach";
import { useSelector } from "react-redux";
import { selectCurrentScope } from "../../../app/stores/authSlice";

const Header = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileImg, setProfileImg] = useState<string | null>(null);

  /* 🔹 RTK MUTATION TRIGGERS */
  const [getClientById] = useGetClientByIdMutation();
  const [getCoachById] = useGetCoachByIdMutation();

  /* 🔹 AUTH DATA */
  const scope = useSelector(selectCurrentScope);

  /* 🔹 LOGOUT */
  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/auth/login", { replace: true });
  };

  /* FETCH PROFILE IMAGE */
  useEffect(() => {
    if (!scope) return;

    const fetchProfile = async () => {
      const res =
        scope === "client"
          ? await getClientById({}).unwrap()
          : await getCoachById({}).unwrap();

      setProfileImg(res?.data?.image_url || null);
    };

    fetchProfile();
  }, [scope]);

  const openMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box className={styles.headerWrapper}>
      {/* FAQ */}
      <Tooltip title="FAQ">
        <IconButton className={styles.iconButton}>
          <HelpOutlineIcon className={isMobile ? styles.iconMobile : styles.icon} />
        </IconButton>
      </Tooltip>

      {/* Notifications */}
      <Tooltip title="Notifications">
        <IconButton className={styles.iconButton}>
          <NotificationsNoneIcon className={isMobile ? styles.iconMobile : styles.icon} />
        </IconButton>
      </Tooltip>

      {/* Profile */}
      <IconButton className={styles.profileBox} onClick={openMenu}>
        {profileImg ? (
          <img src={profileImg} alt="Profile" className={styles.profileImg} />
        ) : (
          <AccountCircleIcon className={styles.profileFallbackIcon} />
        )}
      </IconButton>

      {/* Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {scope !== 'Admin' && (
        <MenuItem
          onClick={() => {
            closeMenu();
            navigate("/profile");
          }}
        >
          <ListItemIcon>
            <PersonOutlineIcon fontSize="small" />
          </ListItemIcon>
           <ListItemText>Profile</ListItemText>
        </MenuItem>)}

        <MenuItem
          onClick={() => {
            closeMenu();
            logout();
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Header;
