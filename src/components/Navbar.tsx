import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Popover,
  Typography,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  ViewList,
  ViewModule,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useThemeContext } from "../context/ThemeContext";
import { useViewContext } from "../context/ViewModeContext";
import { useAuth } from "../context/AuthContext";
import { useSearchContext } from "../context/SearchContext";
import { useBlogFilter } from "../context/BlogFilterContext";
import { useNavigate } from "react-router-dom";
import { useCreateBlog } from "../context/CreateBlogContext";

const Navbar = () => {
  const { toggleColorMode, mode } = useThemeContext();
  const { view, toggleView } = useViewContext();
  const { user, logout } = useAuth();
  const { query, setQuery } = useSearchContext();
  const { filter, setFilter } = useBlogFilter();
  const { setOpenModal, setEditingBlog } = useCreateBlog();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Popover state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const id = open ? "user-popover" : undefined;

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    handlePopoverClose();
    navigate("/");
  };

  const openCreateBlogModal = () => {
    setEditingBlog(undefined);
    setOpenModal(true);
    setDrawerOpen(false);
  };

  useEffect(() => {
    if (!isMobile) {
      setDrawerOpen(false);
    }
  }, [isMobile]);

  return (
    <>
      <Box
        component="nav"
        position="sticky"
        top={0}
        zIndex={1100}
        bgcolor="background.paper"
        borderBottom={1}
        borderColor="divider"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
          px: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Left: Mobile menu icon */}
        <Box sx={{ flexBasis: "auto" }}>
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Box>

        {/* Center: Navigation Filter Links */}
        {!isMobile && (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              gap: 1,
              flexWrap: "wrap",
              minWidth: 200,
            }}
          >
            <Button
              variant={filter === "all" ? "contained" : "text"}
              onClick={() => setFilter("all")}
            >
              All Blogs
            </Button>
            {user && (
              <>
                <Button
                  variant={filter === "your" ? "contained" : "text"}
                  onClick={() => setFilter("your")}
                >
                  Your Blogs
                </Button>
                <Button
                  variant={filter === "favorites" ? "contained" : "text"}
                  onClick={() => setFilter("favorites")}
                >
                  Favorite Blogs
                </Button>
              </>
            )}
          </Box>
        )}

        {/* Right: Search bar and actions */}
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "flex-end",
              minWidth: 250,
            }}
          >
            <TextField
              placeholder="Search blogs..."
              size="small"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ minWidth: 200 }}
            />

            <Tooltip
              title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            >
              <IconButton onClick={toggleColorMode}>
                {mode === "light" ? <Brightness4 /> : <Brightness7 />}
              </IconButton>
            </Tooltip>

            <Tooltip
              title={`Switch to ${view === "grid" ? "list" : "grid"} view`}
            >
              <IconButton onClick={toggleView}>
                {view === "grid" ? <ViewList /> : <ViewModule />}
              </IconButton>
            </Tooltip>

            {user && (
              <Button variant="contained" onClick={openCreateBlogModal}>
                + Create Blog
              </Button>
            )}

            {user ? (
              <>
                <Avatar
                  onClick={handleAvatarClick}
                  sx={{
                    cursor: "pointer",
                    bgcolor: "primary.main",
                    width: 36,
                    height: 36,
                    fontWeight: "bold",
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </Avatar>

                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <Box sx={{ p: 2, minWidth: 220 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {user?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {user?.email}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                      Password: {"•".repeat(user?.password.length || 8)}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </Box>
                </Popover>
              </>
            ) : (
              <Button variant="outlined" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }} role="presentation">
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setFilter("all");
                  setDrawerOpen(false);
                }}
              >
                <ListItemText primary="All Blogs" />
              </ListItemButton>
            </ListItem>
            {user && (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setFilter("your");
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemText primary="Your Blogs" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setFilter("favorites");
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemText primary="Favorite Blogs" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={openCreateBlogModal}>
                    <ListItemText
                      primary="+ Create Blog"
                      primaryTypographyProps={{ fontWeight: "bold" }}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>

          <Divider />

          <Box display="flex" gap={1} mt={2}>
            <Tooltip
              title={`Switch to ${view === "grid" ? "list" : "grid"} view`}
            >
              <IconButton onClick={toggleView}>
                {view === "grid" ? <ViewList /> : <ViewModule />}
              </IconButton>
            </Tooltip>
          </Box>

          <Box mt={2}>
            {user ? (
              <>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Avatar
                    onClick={handleAvatarClick}
                    sx={{
                      cursor: "pointer",
                      bgcolor: "primary.main",
                      width: 36,
                      height: 36,
                      fontWeight: "bold",
                    }}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                  <Typography>{user?.name}</Typography>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    handleLogout();
                    setDrawerOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  navigate("/login");
                  setDrawerOpen(false);
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
