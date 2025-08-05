// Home.tsx
import { useEffect, useState } from "react";
import { Box, Typography, Grid, Button as MuiButton } from "@mui/material";
import BlogCard from "../components/BlogCard";
import { useAuth } from "../context/AuthContext";
import { useViewContext } from "../context/ViewModeContext";
import { useSearchContext } from "../context/SearchContext";
import type { Blog } from "../types/blog";
import BlogModal from "../components/BlogModal";
import { useBlogFilter } from "../context/BlogFilterContext";
import { useCreateBlog } from "../context/CreateBlogContext";
import { useFeedback } from "../context/FeedbackContext";
import { useBlogContext } from "../context/BlogContext";

const BLOGS_PER_PAGE = 6;

const Home = () => {
  const { query } = useSearchContext();
  const { view } = useViewContext();
  const { user } = useAuth();
  const { filter } = useBlogFilter();
  const { showMessage } = useFeedback();
  const [visibleCount, setVisibleCount] = useState(BLOGS_PER_PAGE);
  const { openModal, setOpenModal, editingBlog, setEditingBlog } =
    useCreateBlog();
  const { blogs, addBlog, updateBlog, refreshBlogs } = useBlogContext();

  useEffect(() => {
    refreshBlogs();
    setVisibleCount(BLOGS_PER_PAGE);
    // eslint-disable-next-line
  }, [query, filter]);

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
    refreshBlogs();
  };

  const filteredBlogs = blogs
    .filter((b) => {
      if (filter === "your") return b.authorId === user?.id;
      if (filter === "favorites")
        return b.isFavorite && b.authorId !== user?.id;
      return true;
    })
    .filter((b) => {
      if (!query.trim()) return true;
      return (
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.content.toLowerCase().includes(query.toLowerCase()) ||
        b.category.toLowerCase().includes(query.toLowerCase())
      );
    });

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBlogs.length;

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", px: 2, mt: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Recently Added Blogs</Typography>
      </Box>

      {filteredBlogs.length === 0 ? (
        <Typography>No blogs found.</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {visibleBlogs.map((blog) => (
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
                  showEditButtons={filter === "your"} // 👈 This is the key
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

export default Home;
