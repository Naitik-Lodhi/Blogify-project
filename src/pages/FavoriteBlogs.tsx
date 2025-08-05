import { useState } from "react";
import { Box, Typography, Grid, Button as MuiButton } from "@mui/material";
import { useViewContext } from "../context/ViewModeContext";
import { useBlogContext } from "../context/BlogContext";
import BlogCard from "../components/BlogCard";
import { useAuth } from "../context/AuthContext";

const BLOGS_PER_PAGE = 6;

const FavoriteBlogs = () => {
  const { view } = useViewContext();
  const [visibleCount, setVisibleCount] = useState(BLOGS_PER_PAGE);
  const { blogs } = useBlogContext();
  const { user } = useAuth();

  // ✅ Block access if not logged in
  if (!user) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", mt: 5, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Please log in to view your favorite blogs.
        </Typography>
      </Box>
    );
  }

  const favBlogs = blogs.filter((b) => b.isFavorite);
  const hasMore = visibleCount < favBlogs.length;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, mt: 4 }}>
      <Typography variant="h5" mb={2}>
        Favorite Blogs
      </Typography>

      {favBlogs.length === 0 ? (
        <Typography>No favorite blogs yet.</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {favBlogs.slice(0, visibleCount).map((blog) => (
              <Grid
                item
                key={blog.id}
                xs={12}
                sm={view === "grid" ? 6 : 12}
                md={view === "grid" ? 4 : 12}
              >
                <BlogCard
                  blog={blog}
                  viewMode={view}
                  showEditButtons={false}
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
    </Box>
  );
};

export default FavoriteBlogs;
