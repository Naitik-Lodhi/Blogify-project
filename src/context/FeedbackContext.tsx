import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

interface FeedbackContextType {
  showMessage: (message: string, severity?: "success" | "error" | "info" | "warning") => void;
}

const FeedbackContext = createContext<FeedbackContextType>({
  showMessage: () => {},
});

export const FeedbackProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error" | "info" | "warning">("success");

  const showMessage = (msg: string, sev: "success" | "error" | "info" | "warning" = "success") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = (_: any, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <FeedbackContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => useContext(FeedbackContext);