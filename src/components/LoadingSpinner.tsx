import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <CircularProgress
        size={60}
        thickness={5}
        sx={{
          color: "primary.main",
          animationDuration: "1500ms",
        }}
      />
      <Typography variant="h6" color="textSecondary">
        Loading, please wait...
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
