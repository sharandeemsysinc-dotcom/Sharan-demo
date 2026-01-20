import React from "react";
import { Avatar, Tooltip } from "@mui/material";
// import avatar from "./Avatar.scss";

type Props = {
  name: string;
  src?: string | null;
  size?: number;
  bgColor?: string;
};

const UserAvatar: React.FC<Props> = ({ name, src, size = 40, bgColor }) => {
  const initials = name.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase();
  return (
    <Tooltip title={name}>
      <Avatar src={src ?? undefined} sx={{ width: size, height: size, bgcolor: bgColor ?? undefined }}>
        {!src && initials}
      </Avatar>
    </Tooltip>
  );
};

export default UserAvatar;
