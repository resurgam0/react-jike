import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import { AuthRoute } from "@/components/AuthRoute";
import {
  createBrowserRouter
} from "react-router-dom";
import Home from "@/pages/Home";
import Article from "@/pages/Article";
import Publish from "@/pages/Publish";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRoute><Layout/></AuthRoute>,
    children: [
        {
            path: '',
            element: <Home/>,
            index: true
        },
        {
            path: 'article',
            element: <Article/>
        },
        {
            path: 'publish',
            element: <Publish/>
        }
    ]
  },
  {
    path: "login",
    element: <Login/>,
  },
]);
export default router
