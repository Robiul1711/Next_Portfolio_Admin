import Dashboard from "@/components/admin/Dashboard";
import AdminLayout from "@/layout/AdminLayout";
import Layout from "@/layout/Layout";
import ForgotPassword from "@/pages/AuthPages/ForgotPassword";
import Login from "@/pages/AuthPages/Login";
import ResetPassword from "@/pages/AuthPages/ResetPassword";
import Signup from "@/pages/AuthPages/Signup";
import PostBlogPrompt from "@/pages/Blog/PostBlogPrompt";
import ShowAllBlog from "@/pages/Blog/ShowAllBlog";
import AllContacts from "@/pages/ContactList/AllContacts";
import ContactCMS from "@/pages/ContactList/ContactCMS";
import AddProjects from "@/pages/ProjectPage/AddProjects";
import AllProject from "@/pages/ProjectPage/AllProject";
import SkillsManagement from "@/pages/Skills/SkillsManagement";
import ExperienceManagement from "@/pages/Experience/ExperienceManagement";
import ResumeCMS from "@/pages/Resume/ResumeCMS";

import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
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
        path: "/dashboard/skills",
        element: <SkillsManagement />,
      },
      {
        path: "/dashboard/experiences",
        element: <ExperienceManagement />,
      },
      {
        path: "/dashboard/all-contacts",
        element: <AllContacts />,
      },
      {
        path: "/dashboard/contact-cms",
        element: <ContactCMS />,
      },
      {
        path: "/dashboard/resume",
        element: <ResumeCMS />,
      },
      {
        path: "/dashboard/add-blogs",
        element: <PostBlogPrompt />,
      },
      {
        path: "/dashboard/all-blogs",
        element: <ShowAllBlog />,
      },
    ],
  },
]);

export default router;
