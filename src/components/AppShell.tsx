import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  AppBar, Toolbar, IconButton, TextField, Box, Container, Drawer,
  List, ListItemButton, ListItemText, Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";

function NavList({ onClick }: { onClick?: () => void }) {
  return (
    <List sx={{ width: 260 }}>
      {[
        { to: "/dashboard", label: "Dashboard" },
        { to: "/doctors", label: "Doctors" },
        { to: "/patients", label: "Patients" },
        { to: "/receptions", label: "Receptions" }
      ].map(i => (
        <ListItemButton key={i.to} component={Link} to={i.to} onClick={onClick}>
          <ListItemText primary={i.label} />
        </ListItemButton>
      ))}
    </List>
  );
}

export default function AppShell() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: "#fff", color: "#000", borderBottom: "1px solid #eee" }}
      >
        <Toolbar sx={{ gap: 1 }}>
          {/* Mobile menu */}
          <IconButton
            onClick={() => setOpen(true)}
            sx={{ display: { xs: "inline-flex", sm: "none" }, color: "inherit" }}
            aria-label="Open navigation"
          >
            <MenuIcon />
          </IconButton>

          {/* Brand */}
          <Box
            component={Link}
            to="/"
            sx={{ color: "inherit", textDecoration: "none", fontWeight: 700, mr: 2 }}
          >
            MedPortal
          </Box>

          {/* Search */}
          <Box sx={{ flex: 1, maxWidth: 520, display: { xs: "none", sm: "block" } }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#1e63ff" },
                  "&:hover fieldset": { borderColor: "#1e63ff" },
                  "&.Mui-focused fieldset": { borderColor: "#1e63ff", borderWidth: 2 }
                },
                "& input": { color: "#000" },
                "& input::placeholder": { color: "#666", opacity: 1 }
              }}
            />
          </Box>

          {/* Right-aligned actions */}
          <Box
            sx={{
              ml: "auto",
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 1
            }}
          >
            <Button color="inherit" component={Link} to="/doctors">Doctors</Button>
            <Button color="inherit" component={Link} to="/patients">Patients</Button>
            <Button color="inherit" component={Link} to="/receptions">Receptions</Button>
            <IconButton aria-label="Account" sx={{ color: "inherit" }}>
              <AccountCircle />
            </IconButton>
          </Box>

          {/* Show account icon on mobile too (optional) */}
          <IconButton
            aria-label="Account"
            sx={{ display: { xs: "inline-flex", sm: "none" }, color: "inherit" }}
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer open={open} onClose={() => setOpen(false)} sx={{ display: { sm: "none" } }}>
        <Box sx={{ p: 2 }}>
          <NavList onClick={() => setOpen(false)} />
        </Box>
      </Drawer>

      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </>
  );
}
