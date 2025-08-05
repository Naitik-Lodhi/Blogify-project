import { createContext, useContext, useEffect, useState } from "react";
import type { Blog } from "../types/blog";
import dummyData from "../data/dummyBlogs.json"; // ✅ Your dummy JSON
import { useAuth } from "./AuthContext";

interface BlogContextType {
  blogs: Blog[];
  addBlog: (blog: Blog) => void;
  updateBlog: (blog: Blog) => void;
  toggleFavorite: (id: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);

  // ✅ Load from localStorage or dummy on first load
  useEffect(() => {
    const stored = localStorage.getItem("blogs");
    if (stored) {
      const parsed: Blog[] = JSON.parse(stored).map((b) => ({
        ...b,
        isFavorite: b.isFavorite ?? false, // ensure field exists
      }));
      setBlogs(parsed);
    } else {
      const initialBlogs = dummyData.map((b) => ({
        ...b,
        isFavorite: b.isFavorite ?? false,
      }));
      setBlogs(initialBlogs);
      localStorage.setItem("blogs", JSON.stringify(initialBlogs));
    }
  }, []);

  const saveBlogs = (updated: Blog[]) => {
    setBlogs(updated);
    localStorage.setItem("blogs", JSON.stringify(updated));
  };

  const addBlog = (blog: Blog) => {
    const blogWithDefaults = {
      ...blog,
      isFavorite: blog.isFavorite ?? false,
    };
    const updated = [blogWithDefaults, ...blogs];
    saveBlogs(updated);
  };

  const updateBlog = (blog: Blog) => {
    const updatedBlog = {
      ...blog,
      isFavorite: blog.isFavorite ?? false,
    };
    const updated = blogs.map((b) => (b.id === blog.id ? updatedBlog : b));
    saveBlogs(updated);
  };

  const toggleFavorite = (id: string) => {
    const updated = blogs.map((b) =>
      b.id === id ? { ...b, isFavorite: !b.isFavorite } : b
    );
    saveBlogs(updated);
  };

  return (
    <BlogContext.Provider
      value={{
        blogs,
        addBlog,
        updateBlog,
        toggleFavorite,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context) throw new Error("useBlogContext must be used within provider");
  return context;
};
