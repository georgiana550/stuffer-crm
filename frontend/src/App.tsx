import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Courses from "./app/components/Courses";
import HomePage from "./app/components/HomePage";
import Notify from "./app/components/Notify";
import Profile from "./app/components/Profile";
import Register from "./app/components/Register";
import { Pages } from "./app/components/constants";
import Login from "./app/components/Login";
import Leads from "./app/components/Leads";
import { ThemeProvider, createTheme } from "@mui/material";

const router = createBrowserRouter([
  {
    path: Pages.HOMEPAGE,
    element: <HomePage />,
  },
  {
    path: Pages.REGISTER,
    element: <Register />,
  },
  {
    path: Pages.LOGIN,
    element: <Login />,
  },
  {
    path: Pages.PROFILE,
    element: <Profile />,
  },
  {
    path: Pages.COURSES,
    element: <Courses />,
  },
  {
    path: Pages.LEADS,
    element: <Leads />,
  },
]);
const theme = createTheme({
  typography: {
    fontFamily: [
      "Montserrat",
      "Zen Maru Gothic",
      "Alexandria",
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
        <Notify />
      </ThemeProvider>
    </>
  );
}

export default App;
