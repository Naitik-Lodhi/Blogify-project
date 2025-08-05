import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import LoadingSpinner from "./components/LoadingSpinner";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const CreateBlog = lazy(() => import("./pages/CreateBlog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));
const YourBlogs = lazy(() => import("./pages/YourBlogs"));
const FavoriteBlogs = lazy(() => import("./pages/FavoriteBlogs"));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/edit/:id" element={<CreateBlog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/your-blogs" element={<YourBlogs />} />
          <Route path="/favorites" element={<FavoriteBlogs />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
