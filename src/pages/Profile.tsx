// pages/Profile.tsx
import { Box, Typography, Paper } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  if (!user) return null;

  return (
    <Box maxWidth="500px" mx="auto" mt={6}>
      <Typography variant="h4" mb={3}>Your Profile</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1"><strong>Name:</strong> {user.name}</Typography>
        <Typography variant="body1" mt={1}><strong>Email:</strong> {user.email}</Typography>
        {/* <Typography variant="body1" mt={1}><strong>Password:</strong> {user.password}</Typography> */}
        <Typography variant="body1" mt={1}><strong>Password:</strong> ********</Typography>
      </Paper>
    </Box>
  );
};

export default Profile;
