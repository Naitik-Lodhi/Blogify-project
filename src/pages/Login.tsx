import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login: loginWithContext } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({ email: "" });
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (field: "email" | "password", value: string) => {
    setForm({ ...form, [field]: value });

    if (field === "email") {
      setFormErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Invalid email format",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formErrors.email) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u: any) => u.email === form.email && u.password === form.password
    );

    if (!user) {
      setError("Invalid credentials");
      return;
    }

    loginWithContext(user);
    navigate("/");
  };

  const commonFieldStyles = {
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
          boxShadow: "0 8px 32px rgba(31,38,135,0.37)",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" mb={3} sx={{ fontWeight: "bold", color: "#2575fc" }}>
          Welcome Back
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={form.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={!!formErrors.email}
            helperText={formErrors.email}
            required
            sx={commonFieldStyles}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            required
            sx={commonFieldStyles}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography color="error" sx={{ mt: 1, mb: 1 }}>
              {error}
            </Typography>
          )}

          <Button fullWidth variant="contained" type="submit" sx={{ mt: 3, backgroundColor: "#2575fc" }}>
            Login
          </Button>

          <Button fullWidth onClick={() => navigate("/signup")} sx={{ mt: 2, color: "#2575fc" }}>
            New here? Sign up
          </Button>

          <Button onClick={() => navigate("/")} sx={{ mt: 1, color: "#2575fc" }}>
            ← Back to Home
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
