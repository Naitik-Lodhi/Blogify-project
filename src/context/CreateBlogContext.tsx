// context/CreateBlogContext.tsx
import { createContext, useContext, useState } from "react";
import type { Blog } from "../types/blog";

const CreateBlogContext = createContext<any>(null);

export const CreateBlogProvider = ({ children }: { children: React.ReactNode }) => {
  const [openModal, setOpenModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | undefined>(undefined);

  return (
    <CreateBlogContext.Provider
      value={{ openModal, setOpenModal, editingBlog, setEditingBlog }}
    >
      {children}
    </CreateBlogContext.Provider>
  );
};

export const useCreateBlog = () => useContext(CreateBlogContext);
