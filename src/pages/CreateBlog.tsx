import {
  Box,
  Button,
  TextField,
  Typography,
  Input,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Blog } from "../types/blog";
import { useBlogContext } from "../context/BlogContext";

const CreateBlog = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogs, addBlog, updateBlog } = useBlogContext();

  const initialState: Blog = {
    id: crypto.randomUUID(),
    title: "",
    content: "",
    category: "",
    authorId: user?.id ?? "",
    date: new Date().toISOString(),
    image: "",
    isFavorite: false, // ✅ ADD THIS LINE
  };

  const [blog, setBlog] = useState<Blog>(initialState);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      const existing = blogs.find((b) => b.id === id);
      if (existing && existing.authorId === user?.id) {
        setBlog(existing);
      } else {
        navigate("/"); // Prevent editing others' blogs
      }
    } else {
      setBlog({
        ...initialState,
        id: crypto.randomUUID(),
        authorId: user?.id ?? "",
      });
    }
    // eslint-disable-next-line
  }, [id, blogs, user]);

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
        const scaleFactor = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleFactor;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7); // 70% quality
        setBlog((prev) => ({ ...prev, image: compressedBase64 }));
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!blog.title.trim() || !blog.content.trim() || !blog.category.trim()) {
      setError("Title, content, and category are required.");
      return;
    }
    setError("");
    if (id) {
      updateBlog(blog);
    } else {
      addBlog(blog);
    }
    setBlog({
      ...initialState,
      id: crypto.randomUUID(),
      authorId: user?.id ?? "",
    });
    navigate("/");
  };

  if (!user)
    return <Typography>Login required to create/edit blogs.</Typography>;

  return (
    <Box maxWidth="600px" mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>
        {id ? "Edit Blog" : "Create Blog"}
      </Typography>
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
        multiline
        rows={6}
        margin="normal"
        value={blog.content}
        onChange={(e) => setBlog({ ...blog, content: e.target.value })}
      />
      <Select
        fullWidth
        displayEmpty
        value={blog.category}
        onChange={(e) => setBlog({ ...blog, category: e.target.value })}
        sx={{ my: 2 }}
      >
        <MenuItem value="">Select Category</MenuItem>
        <MenuItem value="Tech">Tech</MenuItem>
        <MenuItem value="Lifestyle">Lifestyle</MenuItem>
        <MenuItem value="Education">Education</MenuItem>
      </Select>
      <Input type="file" onChange={handleImageUpload} sx={{ my: 2 }} />
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
      <Button variant="contained" onClick={handleSubmit}>
        {id ? "Update Blog" : "Publish Blog"}
      </Button>
    </Box>
  );
};

export default CreateBlog;
