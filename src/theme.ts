// src/theme.ts
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: { main: "#0969da" },
    secondary: { main: "#6e7781" },
    error: { main: "#cf222e" },
    success: { main: "#1a7f37" },
    warning: { main: "#9a6700" },
    background: { default: "#ffffff", paper: "#ffffff" },
    divider: "#d0d7de",
    text: { primary: "#24292f", secondary: "#57606a" },
  },
  shape: { borderRadius: 6 },
  typography: {
    // ↑ default is 14 — bump to 16 for readability
    fontSize: 16,
    fontFamily: [
      "-apple-system","BlinkMacSystemFont","Segoe UI","Roboto","Helvetica","Arial",
      "Apple Color Emoji","Segoe UI Emoji"
    ].join(","),
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { root: { border: "1px solid #d0d7de" } } },
    MuiCard: { styleOverrides: { root: { border: "1px solid #d0d7de" } } },
    MuiButton: { styleOverrides: { root: { boxShadow: "none" } } },
    MuiTextField: { defaultProps: { size: "small", variant: "outlined" } },
    MuiAppBar: { styleOverrides: { root: { backgroundColor: "#24292f" } } },
    MuiLink: { styleOverrides: { root: { color: "#0969da" } } },
    MuiContainer: { defaultProps: { maxWidth: "lg" } },
  },
});
