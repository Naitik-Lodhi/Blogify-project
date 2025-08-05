// components/layout/Header.tsx
import { AppBar, Toolbar, Typography } from "@mui/material";

const Header = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Blogify
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
