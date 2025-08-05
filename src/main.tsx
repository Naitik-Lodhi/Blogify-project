// Importing the core React library which is needed to work with JSX and React components
import React from "react";

// Importing the ReactDOM library to render the app into the DOM
import ReactDOM from "react-dom/client";

// Importing BrowserRouter from react-router-dom to enable client-side routing
import { BrowserRouter } from "react-router-dom";

// Importing the main App component that contains the core UI and routing logic
import App from "./App";

// Importing custom context providers used for managing global state
import { ViewModeProvider } from "./context/ViewModeContext"; // Manages view mode state (e.g., list or grid view)
import { ThemeContextProvider } from "./context/ThemeContext"; // Manages theming (e.g., dark/light mode)
import { AuthProvider } from "./context/AuthContext"; // Manages authentication state and user session
import { SearchProvider } from "./context/SearchContext"; // Manages search functionality and state
import { BlogFilterProvider } from "./context/BlogFilterContext";
import { CreateBlogProvider } from "./context/CreateBlogContext";
import { BlogProvider } from "./context/BlogContext";
import { FeedbackProvider } from "./context/FeedbackContext";
import { FavoriteProvider } from "./context/FavoriteContext";

// Create a root rendering context and render the React component tree into the HTML element with id="root"
ReactDOM.createRoot(document.getElementById("root")!).render(
  // React.StrictMode is a development tool that helps highlight potential issues in an application
  <React.StrictMode>
    <FeedbackProvider>
      <BlogProvider>
        {/* AuthProvider wraps the app to provide authentication context globally */}
        <AuthProvider>
          <CreateBlogProvider>
            {/* ThemeContextProvider wraps below components to allow theme management */}
            <ThemeContextProvider>
              {/* ViewModeProvider allows switching between different layout views across the app */}
              <ViewModeProvider>
                {/* BrowserRouter enables routing using the HTML5 history API */}
                <BrowserRouter>
                  {/* SearchProvider makes search state accessible to components within the app */}
                  <SearchProvider>
                    {/* App is the root component that defines the UI and routing */}
                    <BlogFilterProvider>
                      <FavoriteProvider>
                        <App />
                      </FavoriteProvider>
                    </BlogFilterProvider>
                  </SearchProvider>
                </BrowserRouter>
              </ViewModeProvider>
            </ThemeContextProvider>
          </CreateBlogProvider>
        </AuthProvider>
      </BlogProvider>
    </FeedbackProvider>
  </React.StrictMode>
);
