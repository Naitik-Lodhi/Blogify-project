import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login: loginWithContext } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("users") || "[]").find(
      (u: any) => u.email === form.email && u.password === form.password
    );

    if (!user) {
      setError("Invalid credentials");
      return;
    }

    loginWithContext(user);
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
          Welcome Back
        </Typography>
        <form onSubmit={handleSubmit}>
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
            <Typography
              color="error"
              sx={{ mt: 1, mb: 1, fontWeight: "medium" }}
            >
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
              background:
                "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                background:
                  "linear-gradient(90deg, #2575fc 0%, #6a11cb 100%)",
                boxShadow: "0 4px 15px rgba(101, 41, 255, 0.6)",
              },
            }}
          >
            Login
          </Button>
          <Button
            fullWidth
            onClick={() => navigate("/signup")}
            sx={{
              mt: 2,
              color: "#2575fc",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            New here? Sign up
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

export default Login;
