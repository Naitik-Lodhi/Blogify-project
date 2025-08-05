import React, { createContext, useContext, useEffect, useState } from "react";
import type { Blog } from "../types/blog";
import dummyBlogs from "../data/dummyBlogs.json"; 

interface BlogContextType {
  blogs: Blog[];
  refreshBlogs: () => void;
  addBlog: (blog: Blog) => void;
  updateBlog: (blog: Blog) => void;
  deleteBlog: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  // ✅ Step 2: Load blogs from localStorage or dummy JSON
  const refreshBlogs = () => {
    const stored = JSON.parse(localStorage.getItem("blogs") || "[]");

    const hasUserAddedBlogs = localStorage.getItem("hasUserAddedBlogs") === "true";

    if (!hasUserAddedBlogs && stored.length === 0) {
      localStorage.setItem("blogs", JSON.stringify(dummyBlogs));
      setBlogs(dummyBlogs);
    } else {
      setBlogs(stored);
    }
  };

  useEffect(() => {
    refreshBlogs();
  }, []);

  // ✅ Step 3: Mark user has added real blog
  const addBlog = (blog: Blog) => {
    const updated = [blog, ...blogs];
    setBlogs(updated);
    localStorage.setItem("blogs", JSON.stringify(updated));
    localStorage.setItem("hasUserAddedBlogs", "true");
  };

  const updateBlog = (blog: Blog) => {
    const updated = blogs.map((b) => (b.id === blog.id ? blog : b));
    setBlogs(updated);
    localStorage.setItem("blogs", JSON.stringify(updated));
  };

  const deleteBlog = (id: string) => {
    const updated = blogs.filter((b) => b.id !== id);
    setBlogs(updated);
    localStorage.setItem("blogs", JSON.stringify(updated));
  };

  const toggleFavorite = (id: string) => {
    const updated = blogs.map((b) =>
      b.id === id ? { ...b, isFavorite: !b.isFavorite } : b
    );
    setBlogs(updated);
    localStorage.setItem("blogs", JSON.stringify(updated));
  };

  return (
    <BlogContext.Provider
      value={{ blogs, refreshBlogs, addBlog, updateBlog, deleteBlog, toggleFavorite }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context) throw new Error("useBlogContext must be used within BlogProvider");
  return context;
};
