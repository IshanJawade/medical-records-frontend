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
        { to: "/receptionists", label: "Receptionists" }
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
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            color="inherit"
            onClick={() => setOpen(true)}
            sx={{ display: { xs: "inline-flex", sm: "none" } }}
            aria-label="Open navigation"
          >
            <MenuIcon />
          </IconButton>

          <Box component={Link} to="/" sx={{ color: "#fff", textDecoration: "none", fontWeight: 700, mr: 2 }}>
            MedPortal
          </Box>

          <Box sx={{ flexGrow: 1, maxWidth: 520, display: { xs: "none", sm: "block" } }}>
            <TextField fullWidth placeholder="Search" />
          </Box>

          <Button color="inherit" component={Link} to="/doctors" sx={{ display: { xs: "none", sm: "inline-flex" } }}>
            Doctors
          </Button>
          <Button color="inherit" component={Link} to="/patients" sx={{ display: { xs: "none", sm: "inline-flex" } }}>
            Patients
          </Button>
          <Button color="inherit" component={Link} to="/receptionists" sx={{ display: { xs: "none", sm: "inline-flex" } }}>
            Receptionists
          </Button>
          <IconButton color="inherit" aria-label="Account">
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
