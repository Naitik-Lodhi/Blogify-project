import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login: loginWithContext } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<"Weak" | "Medium" | "Strong">("Weak");

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getPasswordStrength = (password: string): "Weak" | "Medium" | "Strong" => {
    const lengthCheck = password.length >= 6;
    const uppercaseCheck = /[A-Z]/.test(password);
    const numberCheck = /[0-9]/.test(password);
    const specialCharCheck = /[!@#$%^&*]/.test(password);

    const score = [lengthCheck, uppercaseCheck, numberCheck, specialCharCheck].filter(Boolean).length;

    if (score <= 1) return "Weak";
    if (score === 2 || score === 3) return "Medium";
    return "Strong";
  };

  const validatePassword = (password: string) => {
    const lengthCheck = password.length >= 6;
    const uppercaseCheck = /[A-Z]/.test(password);
    const numberCheck = /[0-9]/.test(password);
    const specialCharCheck = /[!@#$%^&*]/.test(password);
    return lengthCheck && uppercaseCheck && numberCheck && specialCharCheck;
  };

  const handleInputChange = (field: "email" | "password", value: string) => {
    setForm({ ...form, [field]: value });

    if (field === "email") {
      setFormErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Invalid email format",
      }));
    }

    if (field === "password") {
      setFormErrors((prev) => ({
        ...prev,
        password: validatePassword(value)
          ? ""
          : "Password must be at least 6 chars, include uppercase, number, special char.",
      }));
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Stop if any validation error
    if (formErrors.email || formErrors.password) return;

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

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "Weak":
        return "error";
      case "Medium":
        return "warning";
      case "Strong":
        return "success";
    }
  };

  const getStrengthValue = () => {
    switch (passwordStrength) {
      case "Weak":
        return 30;
      case "Medium":
        return 60;
      case "Strong":
        return 100;
    }
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
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={!!formErrors.email}
            helperText={formErrors.email}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={!!formErrors.password}
            helperText={formErrors.password}
            required
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

          {form.password && (
            <>
              <Typography
                variant="caption"
                sx={{ display: "block", textAlign: "left", mt: 1 }}
                color={getStrengthColor()}
              >
                Strength: {passwordStrength}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={getStrengthValue()}
                color={getStrengthColor()}
                sx={{ height: 8, borderRadius: 2, mt: 0.5, mb: 2 }}
              />
            </>
          )}

          {error && (
            <Typography
              color="error"
              sx={{ mt: 1, mb: 1, fontWeight: "medium" }}
            >
              {error}
            </Typography>
          )}

          <Button fullWidth variant="contained" type="submit" sx={{ mt: 3 }}>
            Login
          </Button>

          <Button fullWidth onClick={() => navigate("/signup")} sx={{ mt: 2 }}>
            New here? Sign up
          </Button>

          <Button onClick={() => navigate("/")} sx={{ mt: 1 }}>
            ← Back to Home
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
