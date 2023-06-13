import Login from "./pages/Login";
import Register from "./pages/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Handler from "./pages/Handler";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";
import User from "./pages/User";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/user/:id",
    element: <User />,
  },
  {
    path: "/upload",
    element: <Upload />,
  },
  {
    path: "/upload/imageEditor",
    element: <Upload />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },

  {
    path: "/",
    element: <Handler />,
  },
]);

function App() {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
