// BlogFilterContext.tsx
import { createContext, useContext, useState } from "react";

type BlogFilter = "all" | "your" | "favorites";

interface BlogFilterContextType {
  filter: BlogFilter;
  setFilter: (f: BlogFilter) => void;
}

const BlogFilterContext = createContext<BlogFilterContextType | undefined>(undefined);

export const BlogFilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filter, setFilter] = useState<BlogFilter>("all");

  return (
    <BlogFilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </BlogFilterContext.Provider>
  );
};

export const useBlogFilter = () => {
  const context = useContext(BlogFilterContext);
  if (!context) throw new Error("useBlogFilter must be used within BlogFilterProvider");
  return context;
};
