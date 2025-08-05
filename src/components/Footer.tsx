// components/layout/Footer.tsx
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={(theme) => ({
        py: 2,
        textAlign: "center",
        mt: "auto",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
      })}
    >
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} Blogify. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
