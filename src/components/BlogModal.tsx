// BlogModal.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  Input,
} from "@mui/material";
import { useState, useEffect, type ChangeEvent } from "react";
import { type Blog } from "../types/blog";
import { useAuth } from "../context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (newBlog: Blog) => void;
  initialBlog?: Blog; // Optional for editing
}

const BlogModal = ({ open, onClose, onSave, initialBlog }: Props) => {
  const { user } = useAuth();

  const initialState: Blog = {
    id: crypto.randomUUID(),
    title: "",
    content: "",
    category: "",
    authorId: user?.id ?? "",
    date: new Date().toISOString(),
    image: "",
  };

  const [blog, setBlog] = useState<Blog>(initialState);

  // Prefill data if editing, otherwise reset to initial state when modal opens/closes
  useEffect(() => {
    if (open) {
      if (initialBlog) {
        setBlog(initialBlog);
      } else {
        setBlog({ ...initialState, id: crypto.randomUUID(), authorId: user?.id ?? "" });
      }
    }
    // eslint-disable-next-line
  }, [open, initialBlog, user]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 800;
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL("image/jpeg", 0.7);
        setBlog((prev) => ({ ...prev, image: compressed }));
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    onSave(blog);
    setBlog({ ...initialState, id: crypto.randomUUID(), authorId: user?.id ?? "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialBlog ? "Edit Blog" : "Create Blog"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={blog.title}
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
        />
        <TextField
          label="Content"
          fullWidth
          margin="normal"
          multiline
          rows={6}
          value={blog.content}
          onChange={(e) => setBlog({ ...blog, content: e.target.value })}
        />
        <Select
          fullWidth
          value={blog.category}
          onChange={(e) => setBlog({ ...blog, category: e.target.value })}
          displayEmpty
          sx={{ my: 2 }}
        >
          <MenuItem value="">Select Category</MenuItem>
          <MenuItem value="Tech">Tech</MenuItem>
          <MenuItem value="Lifestyle">Lifestyle</MenuItem>
          <MenuItem value="Education">Education</MenuItem>
        </Select>
        <Input type="file" onChange={handleImageUpload} sx={{ my: 2 }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialBlog ? "Update" : "Publish"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlogModal;
