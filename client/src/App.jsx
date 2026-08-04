import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import BrowseItems from "./pages/BrowseItems";
import ReportItem from "./pages/ReportItem";
import MyItems from "./pages/MyItems";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./components/PublicLayout";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageCategories from "./pages/admin/ManageCategories";
import Analytics from "./pages/admin/Analytics";
import ActivityLogs from "./pages/admin/ActivityLogs";
import ManageAnnouncements from "./pages/admin/ManageAnnouncements";

function App() {
  return (
    <div className="app">
      {/* Header, Navbar, Footer stay on every page — only the routed content changes */}
      <Header />
      <Navbar />

      <main className="app__content">
        <Routes>
          {/* Show login first - protect home and app routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/browse" element={<ProtectedRoute><BrowseItems /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><ReportItem /></ProtectedRoute>} />
          <Route path="/myitems" element={<ProtectedRoute><MyItems /></ProtectedRoute>} />
          <Route path="/moderator" element={<ProtectedRoute allowedRoles={['moderator', 'admin']}><ModeratorDashboard /></ProtectedRoute>} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
    <Routes>
      {/* Admin routes — only AdminLayout, no public Header/Navbar/Footer */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="categories" element={<ManageCategories />} />
        <Route path="announcements" element={<ManageAnnouncements />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="activity" element={<ActivityLogs />} />
      </Route>

      {/* Public routes — wrapped in PublicLayout (Header + Navbar + Footer) */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/browse" element={<ProtectedRoute><BrowseItems /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><ReportItem /></ProtectedRoute>} />
        <Route path="/myitems" element={<ProtectedRoute><MyItems /></ProtectedRoute>} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;