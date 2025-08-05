import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login: loginWithContext } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Add `role: "user"` to satisfy the expected User type
    const err = signup({
      ...form,
      role: "user",
    });

    if (err) return setError(err);

    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const newUser = allUsers.find((u: any) => u.email === form.email);
    loginWithContext(newUser);
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          maxWidth: 400,
          p: 4,
          borderRadius: 3,
          backgroundColor: "rgba(255,255,255,0.95)",
          boxShadow:
            "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 15px rgba(31, 38, 135, 0.4)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          mb={3}
          sx={{ fontWeight: "bold", color: "#2575fc", letterSpacing: 1 }}
        >
          Create Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            InputLabelProps={{
              shrink: true,
              sx: { fontSize: "1rem" },
            }}
            sx={{
              "& .MuiInputLabel-root": { color: "#2575fc" },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                color: "#000",
                "& fieldset": {
                  borderColor: "#2575fc",
                },
                "&:hover fieldset": {
                  borderColor: "#6a11cb",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#6a11cb",
                },
              },
              input: {
                color: "#000",
                py: 1,
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            InputLabelProps={{
              shrink: true,
              sx: { fontSize: "1rem" },
            }}
            sx={{
              "& .MuiInputLabel-root": { color: "#2575fc" },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                color: "#000",
                "& fieldset": {
                  borderColor: "#2575fc",
                },
                "&:hover fieldset": {
                  borderColor: "#6a11cb",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#6a11cb",
                },
              },
              input: {
                color: "#000",
                py: 1,
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            InputLabelProps={{
              shrink: true,
              sx: { fontSize: "1rem" },
            }}
            sx={{
              "& .MuiInputLabel-root": { color: "#2575fc" },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                color: "#000",
                "& fieldset": {
                  borderColor: "#2575fc",
                },
                "&:hover fieldset": {
                  borderColor: "#6a11cb",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#6a11cb",
                },
              },
              input: {
                color: "#000",
                py: 1,
              },
            }}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1, mb: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 3,
              py: 1.5,
              background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(90deg, #2575fc 0%, #6a11cb 100%)",
                boxShadow: "0 4px 15px rgba(101, 41, 255, 0.6)",
              },
            }}
          >
            Create Account
          </Button>
          <Button
            fullWidth
            onClick={() => navigate("/login")}
            sx={{
              mt: 2,
              color: "#2575fc",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Already have an account? Log in
          </Button>
          <Button
            onClick={() => navigate("/")}
            sx={{
              mt: 1,
              color: "#666",
              textTransform: "none",
              fontSize: "0.9rem",
              "&:hover": { textDecoration: "underline", color: "#2575fc" },
            }}
          >
            ← Back to Home
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Signup;
