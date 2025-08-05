import { createContext, useContext, useState } from "react";

type ViewMode = "grid" | "list";

const ViewContext = createContext({
  view: "grid" as ViewMode,
  toggleView: () => {},
});

export const useViewContext = () => useContext(ViewContext);

export const ViewModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [view, setView] = useState<ViewMode>("grid");

  const toggleView = () => {
    setView(prev => (prev === "grid" ? "list" : "grid"));
  };

  return (
    <ViewContext.Provider value={{ view, toggleView }}>
      {children}
    </ViewContext.Provider>
  );
};
