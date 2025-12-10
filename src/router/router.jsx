import Dashboard from "@/components/admin/Dashboard";
import AdminLayout from "@/layout/AdminLayout";
import Layout from "@/layout/Layout";
import ForgotPassword from "@/pages/AuthPages/ForgotPassword";
import Login from "@/pages/AuthPages/Login";
import ResetPassword from "@/pages/AuthPages/ResetPassword";
import Signup from "@/pages/AuthPages/Signup";
import AllContacts from "@/pages/ContactList/AllContacts";
import ContactCMS from "@/pages/ContactList/ContactCMS";
import AddProjects from "@/pages/ProjectPage/AddProjects";
import AllProject from "@/pages/ProjectPage/AllProject";


import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // {
      //   path: "/",
      //   element: <Signup />,
      // },
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },

    ],
  },
  // Admin routes
  {
    path: "/dashboard",
    element: <AdminLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />, 
      },
      {
        path: "/dashboard/all-project",
        element: <AllProject />, 
      },
      {
        path: "/dashboard/add-project",
        element: <AddProjects />, 
      },
      {
        path: "/dashboard/all-contacts",
        element: <AllContacts />, 
      },
      {
        path: "/dashboard/contact-cms",
        element: <ContactCMS />, 
      },
    ],
  },
]);

export default router;
