import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import { getUser } from "../api/AuthService";
import { useColorMode } from "../theme/ThemeModeProvider";

function getGreeting(hour: number) {
  if (hour >= 5 && hour < 12) {
    return "Morning,";
  }
  if (hour >= 12 && hour < 17) {
    return "Afternoon,";
  }
  if (hour >= 17 && hour < 21) {
    return "Evening,";
  }
  return "Working late?";
}

type NavbarProps = {
  onLogout: () => void;
};

function getInitials(firstName: string, lastName: string) {
  const first = firstName.trim().charAt(0);
  const last = lastName.trim().charAt(0);
  return `${first}${last}`.toUpperCase();
}

export const Navbar = ({ onLogout }: NavbarProps) => {
  const { mode, toggleColorMode } = useColorMode();
  const [displayName, setDisplayName] = useState("");
  const [initials, setInitials] = useState("");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const now = new Date();
  const greeting = getGreeting(now.getHours());
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(now);

  useEffect(() => {
    let cancelled = false;

    void getUser().then(
      (user) => {
        if (cancelled) {
          return;
        }
        const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
        setDisplayName(name);
        setInitials(getInitials(user.firstName ?? "", user.lastName ?? ""));
      },
      () => {
        if (cancelled) {
          return;
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    onLogout();
  };

  const handleToggleColorMode = () => {
    handleCloseMenu();
    toggleColorMode();
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          py: 1.5,
          minHeight: 72,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.8 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              fontSize: "1rem",
              fontWeight: 700,
            //   color: "#fff",
            }}
          >
            {initials || <PersonIcon fontSize="medium" />}
          </Avatar>
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
              {greeting}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, lineHeight: 1.3 }}
            >
              {displayName || " "}
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.75, display: "block", lineHeight: 1.7 }}
            >
              {formattedDate}
            </Typography>
          </Box>
        </Box>

        <IconButton
          color="inherit"
          edge="end"
          aria-label="open menu"
          aria-controls={menuAnchor ? "navbar-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={menuAnchor ? "true" : undefined}
          onClick={handleOpenMenu}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="navbar-menu"
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleToggleColorMode}>
            {mode === "dark" ? "Light mode" : "Dark mode"}
          </MenuItem>
          <MenuItem onClick={handleLogout}>Log out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
