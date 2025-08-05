// YourBlogs.tsx
import { useState } from "react";
import { Box, Typography, Grid, Button as MuiButton } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useViewContext } from "../context/ViewModeContext";
import BlogCard from "../components/BlogCard";
import { useBlogContext } from "../context/BlogContext";
import { useCreateBlog } from "../context/CreateBlogContext";
import BlogModal from "../components/BlogModal";
import { useFeedback } from "../context/FeedbackContext";
import type { Blog } from "../types/blog";

const BLOGS_PER_PAGE = 6;

const YourBlogs = () => {
  const { user } = useAuth();
  const { view } = useViewContext();
  const [visibleCount, setVisibleCount] = useState(BLOGS_PER_PAGE);
  const { openModal, setOpenModal, editingBlog, setEditingBlog } =
    useCreateBlog();
  const { addBlog, updateBlog } = useBlogContext();
  const { showMessage } = useFeedback();
  const { blogs } = useBlogContext();
  const myBlogs = blogs.filter((b) => b.authorId === user?.id);
  const hasMore = visibleCount < myBlogs.length;

  const handleSave = (blog: Blog) => {
    if (editingBlog) {
      updateBlog(blog);
      showMessage("Blog updated", "success");
    } else {
      addBlog(blog);
      showMessage("Blog created", "success");
    }
    setOpenModal(false);
    setEditingBlog(undefined);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, mt: 4 }}>
      <Typography variant="h5" mb={2}>
        Your Blogs
      </Typography>
      {myBlogs.length === 0 ? (
        <Typography>No blogs created yet.</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {myBlogs.map((blog) => (
              <Grid
                size={{
                  xs: 12,
                  sm: view === "grid" ? 6 : 12,
                  md: view === "grid" ? 4 : 12,
                }}
                key={blog.id}
              >
                <BlogCard
                  blog={blog}
                  viewMode={view}
                  showEditButtons={true}
                  onEditClick={(b) => {
                    setEditingBlog(b);
                    setOpenModal(true);
                  }}
                />
              </Grid>
            ))}
          </Grid>
          {hasMore && (
            <Box display="flex" justifyContent="center" mt={3}>
              <MuiButton
                variant="outlined"
                onClick={() => setVisibleCount((c) => c + BLOGS_PER_PAGE)}
              >
                Load More
              </MuiButton>
            </Box>
          )}
        </>
      )}

      {user && (
        <BlogModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setEditingBlog(undefined);
          }}
          onSave={handleSave}
          initialBlog={editingBlog}
        />
      )}
    </Box>
  );
};

export default YourBlogs;
