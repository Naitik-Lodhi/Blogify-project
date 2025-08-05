import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { useEffect } from "react";
import { useBlogContext } from "../context/BlogContext";

const BlogDetail = () => {
  const { id } = useParams();
  const { blogs } = useBlogContext();
  const navigate = useNavigate();

  const blog = blogs.find((b) => b.id === id);

  useEffect(() => {
    if (!blog) navigate("/");
    // eslint-disable-next-line
  }, [blog]);

  if (!blog) return <Typography mt={4}>Loading blog...</Typography>;

  return (
    <Box maxWidth="700px" mx="auto" mt={4}>
      <Button sx={{ mb: 3 }} onClick={() => navigate(-1)}>
        ← Back
      </Button>
      {blog.image && (
        <Box mb={2}>
          <img
            src={blog.image}
            alt={blog.title}
            style={{ width: "100%", borderRadius: 8 }}
          />
        </Box>
      )}

      <Typography variant="h4" mb={1}>
        {blog.title}
      </Typography>

      <Typography variant="subtitle2" color="text.secondary" mb={2}>
        {blog.category} • {new Date(blog.date).toLocaleDateString()}
      </Typography>

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
