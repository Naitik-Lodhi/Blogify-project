import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Blog } from "../types/blog";
import { useFeedback } from "../context/FeedbackContext";
import { useBlogContext } from "../context/BlogContext";

const DEFAULT_IMAGE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUwCJYSnbBLMEGWKfSnWRGC_34iCCKkxePpg&s";

interface Props {
  blog: Blog;
  viewMode?: "grid" | "list";
  onEditClick?: (blog: Blog) => void;
  onFavoriteToggle?: () => void;
  showEditButtons?: boolean;
}

const BlogCard = ({
  blog,
  viewMode = "grid",
  onEditClick,
  showEditButtons = false,
}: Props) => {
  const { user } = useAuth();
  const isAuthor = user?.id === blog.authorId;
  const [authorName, setAuthorName] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string>(blog.image || DEFAULT_IMAGE);
  const { showMessage } = useFeedback();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { toggleFavorite, deleteBlog } = useBlogContext();

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const author = users.find((u: any) => u.id === blog.authorId);
    setAuthorName(author?.name || "Unknown Author");
  }, [blog.authorId]);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(blog.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    deleteBlog(blog.id);
  };

  const handleConfirmDelete = () => {
    deleteBlog(blog.id);
    setConfirmOpen(false);
    showMessage("Blog deleted", "success");
  };

  return (
    <>
      <Card
        component={Link}
        to={`/blog/${blog.id}`}
        sx={{
          textDecoration: "none",
          display: viewMode === "list" ? "flex" : "block",
          flexDirection: viewMode === "list" ? "row" : "column",
          height: viewMode === "list" ? "250px" : "auto",
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
          "&:hover": {
            boxShadow: 6,
          },
          transition: "box-shadow 0.3s ease-in-out",
        }}
      >
        <CardMedia
          component="img"
          image={imageSrc}
          alt={blog.title}
          onError={() => setImageSrc(DEFAULT_IMAGE)} // fallback for broken image
          sx={{
            height: "250px",
            width: viewMode === "list" ? "300px" : "100%",
            objectFit: "cover",
            flexShrink: 0,
          }}
        />

        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="h6" fontWeight="bold" noWrap>
                {blog.title}
              </Typography>
              {user && (
                <Tooltip title={blog.isFavorite ? "Remove Favorite" : "Add to Favorites"}>
                <IconButton
                  onClick={handleFavoriteToggle}
                  color="error"
                  size="small"
                >
                  {blog.isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Tooltip>
            )}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              By <strong>{authorName}</strong> • {blog.category} •{" "}
              {new Date(blog.date).toLocaleDateString()}
            </Typography>

            <Typography
              variant="body1"
              paragraph
              sx={{
                mt: 1,
                display: "-webkit-box",
                WebkitLineClamp: viewMode === "list" ? 3 : 5,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {blog.content}
            </Typography>
          </Box>

          {isAuthor && showEditButtons && (
            <Box mt={1} display="flex" gap={1} flexWrap="wrap">
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  onEditClick?.(blog);
                }}
              >
                Edit
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Blog</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this blog? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BlogCard;
