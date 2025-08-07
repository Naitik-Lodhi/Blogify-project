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
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
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

  const [showIntro, setShowIntro] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [resetTimer, setResetTimer] = useState<NodeJS.Timeout | null>(null);

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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
            You can test features by creating multiple user accounts —
            <strong>Signup</strong> and <strong>Login</strong> are fully functional.
            <br />
            <br />
            The blogs you currently see are <strong>dummy data</strong> from a JSON file.
            <br />
            <br />
            <strong>If you're a returning user</strong> and want to reset the website like new —
            you can clear all local data with one click.
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
              localStorage.removeItem("users");
              localStorage.removeItem("blogs");
              localStorage.removeItem("favorites");
              localStorage.removeItem("loggedInUser");
              localStorage.removeItem("hideIntroPopup");

              logout();
              setFilter("all");
              refreshBlogs();
              setShowIntro(false);
              setResetDialogOpen(true);

              let timeLeft = 3;
              setCountdown(timeLeft);

              const timer = setInterval(() => {
                timeLeft--;
                setCountdown(timeLeft);
                if (timeLeft === 0) {
                  clearInterval(timer);
                  location.reload();
                }
              }, 1000);

              setResetTimer(timer);
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

      {/* 🔄 Resetting Dialog */}
      <Dialog open={resetDialogOpen}>
        <DialogTitle sx={{ fontWeight: "bold", fontSize: 20 }}>
          🔄 Resetting Blogify...
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 1,
            minWidth: 300,
          }}
        >
          <CircularProgress size={48} thickness={4} color="primary" />
          <motion.div
            key={countdown}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ fontSize: "2.2rem", fontWeight: "bold" }}
          >
            {countdown}
          </motion.div>
          <Typography variant="body2" align="center" color="text.secondary">
            Site will refresh in <strong>{countdown}</strong> seconds...
          </Typography>
          <MuiButton
            variant="outlined"
            color="error"
            onClick={() => {
              if (resetTimer) clearInterval(resetTimer);
              setResetDialogOpen(false);
              showMessage("Reset canceled", "info");
            }}
          >
            Cancel Reset
          </MuiButton>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Home;
