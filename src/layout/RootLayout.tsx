// components/layout/RootLayout.tsx
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Box, Container } from "@mui/material";

const RootLayout = () => {
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={(theme) => ({
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      })}
    >
      {!isAuthPage && (
        <>
          <Header />
          <Navbar />
        </>
      )}
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>
      {!isAuthPage && <Footer />}
    </Box>
  );
};

export default RootLayout;
