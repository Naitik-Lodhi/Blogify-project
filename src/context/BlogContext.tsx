import React, { createContext, useContext, useEffect, useState } from "react";
import type { Blog } from "../types/blog";

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

  // Load blogs from localStorage
  const refreshBlogs = () => {
    const stored = JSON.parse(localStorage.getItem("blogs") || "[]");
    setBlogs(stored);
  };

  useEffect(() => {
    const stored = localStorage.getItem("blogs");

    if (!stored || stored === "[]") {
      fetch("/dummyBlogs.json")
        .then((res) => res.json())
        .then((data) => {
          console.log("Loaded dummy data:", data);
          localStorage.setItem("blogs", JSON.stringify(data));
          setBlogs(data);
        })
        .catch((err) => {
          console.error("Failed to load dummy data:", err);
        });
    } else {
      setBlogs(JSON.parse(stored));
    }
  }, []);

  const addBlog = (blog: Blog) => {
    const updated = [blog, ...blogs];
    setBlogs(updated);
    localStorage.setItem("blogs", JSON.stringify(updated));
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
      value={{
        blogs,
        refreshBlogs,
        addBlog,
        updateBlog,
        deleteBlog,
        toggleFavorite,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context)
    throw new Error("useBlogContext must be used within BlogProvider");
  return context;
};
