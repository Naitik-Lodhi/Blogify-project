import { createContext, useContext, useMemo, useState, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
  type PaletteMode,
} from "@mui/material";

const ThemeContext = createContext({
  toggleColorMode: () => {},
  mode: "light" as PaletteMode,
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  // ✅ Check localStorage first, fallback to system preference
  const getInitialMode = (): PaletteMode => {
    const stored = localStorage.getItem("themeMode");
    if (stored === "light" || stored === "dark") return stored;
    return prefersDark ? "dark" : "light";
  };

  const [mode, setMode] = useState<PaletteMode>(getInitialMode);

  // ✅ Save to localStorage on theme change
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === "dark" ? "#121212" : "#fafafa",
            paper: mode === "dark" ? "#1e1e1e" : "#fff",
          },
        },
        typography: {
          allVariants: {
            color: mode === "dark" ? "#fff" : "#000",
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ toggleColorMode, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
