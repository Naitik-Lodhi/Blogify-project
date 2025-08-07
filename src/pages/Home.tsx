// Home.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button as MuiButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
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
import { useFavorites } from "../context/FavoriteContext";
import { logout } from "../services/authService";

const BLOGS_PER_PAGE = 6;

const Home = () => {
  const { query } = useSearchContext();
  const { view } = useViewContext();
  const { user } = useAuth();
  const { filter, setFilter } = useBlogFilter();
  const { showMessage } = useFeedback();
  const [visibleCount, setVisibleCount] = useState(BLOGS_PER_PAGE);
  const { openModal, setOpenModal, editingBlog, setEditingBlog } =
    useCreateBlog();
  const { blogs, addBlog, updateBlog, refreshBlogs } = useBlogContext();
  const { favoriteIds } = useFavorites();

  // Intro Popup state
  const [showIntro, setShowIntro] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    refreshBlogs();
    setVisibleCount(BLOGS_PER_PAGE);
    // eslint-disable-next-line
  }, [query, filter]);

  useEffect(() => {
    if (!user && (filter === "your" || filter === "favorites")) {
      setFilter("all");
    }
  }, [user]);

  // Show welcome popup if first time
  useEffect(() => {
    const alreadyHidden = localStorage.getItem("hideIntroPopup");
    if (!alreadyHidden) {
      setShowIntro(true);
    }
  }, []);

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
      if (filter === "favorites") return favoriteIds.includes(b.id);
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
                  showEditButtons={filter === "your"}
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

      {/* 🎉 Welcome Popup */}
      <Dialog open={showIntro} onClose={() => setShowIntro(false)}>
        <DialogTitle sx={{ fontWeight: "bold", fontSize: 20 }}>
          📝 Welcome to <span style={{ color: "#2575fc" }}>Blogify</span>!
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ fontSize: 15, lineHeight: 1.6 }}>
            This website uses your browser's <strong>localStorage</strong> as
            the database.
            <br />
            <br />
            You can test features by creating multiple user accounts —{" "}
            <strong>Signup</strong> and <strong>Login</strong> are fully
            functional.
            <br />
            <br />
            The blogs you currently see are <strong>dummy data</strong> from a
            JSON file.
            <br />
            <br />
            <strong>If you're a returning user</strong> and want to reset the
            website like new — you can clear all local data with one click.
          </DialogContentText>

          <FormControlLabel
            control={
              <Checkbox
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
            }
            label="Don't show this again"
            sx={{ mt: 2 }}
          />

          <MuiButton
            variant="outlined"
            color="error"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => {
              // Clear data
              localStorage.removeItem("users");
              localStorage.removeItem("blogs");
              localStorage.removeItem("favorites");
              localStorage.removeItem("loggedInUser");
              localStorage.removeItem("hideIntroPopup");

              // Reset contexts

              logout(); // AuthContext
              setFilter("all");
              refreshBlogs(); // BlogContext

              // Close popup
              setShowIntro(false);

              // ✅ Show snackbar
              showMessage("Local data cleared. Reloaded as guest.", "success");
            }}
          >
            Clear Local Data & Reset Site
          </MuiButton>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <MuiButton
            variant="contained"
            onClick={() => {
              if (dontShowAgain) {
                localStorage.setItem("hideIntroPopup", "true");
              }
              setShowIntro(false);
            }}
          >
            Got it!
          </MuiButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
