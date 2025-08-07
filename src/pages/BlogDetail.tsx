import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useBlogContext } from "../context/BlogContext";

const BlogDetail = () => {
  const { id } = useParams();
  const { blogs } = useBlogContext();
  const navigate = useNavigate();

  const blog = blogs.find((b) => b.id === id);
   const [authorName, setAuthorName] = useState<string>("");

  useEffect(() => {
    if (!blog) navigate("/");
    // eslint-disable-next-line
  }, [blog]);

  if (!blog) return <Typography mt={4}>Loading blog...</Typography>;
  
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const author = users.find((u: any) => u.id === blog.authorId);
    setAuthorName(author?.name || "Unknown Author");
  }, [blog.authorId]);

  return (
    <Box maxWidth="700px" mx="auto" mt={4}>
      <Button sx={{ mb: 3 }} onClick={() => navigate(-1)}>
        ← Back
      </Button>
      <Typography variant="h4" mb={1}>
        {blog.title}
      </Typography>
      <Box>
        <Typography variant="subtitle1" color="textPrimary" >By: {authorName}</Typography>
        <Typography variant="subtitle2" color="text.secondary" mb={2}>
          {blog.category} • {new Date(blog.date).toLocaleDateString()}
        </Typography>
      </Box>
      {blog.image && (
        <Box mb={2}>
          <img
            src={blog.image}
            alt={blog.title}
            style={{ width: "100%", borderRadius: 8 }}
          />
        </Box>
      )}

      <Typography variant="body1" whiteSpace="pre-wrap">
        {blog.content}
      </Typography>

      <Button sx={{ mt: 3 }} onClick={() => navigate(-1)}>
        ← Back
      </Button>
    </Box>
  );
};

export default BlogDetail;
