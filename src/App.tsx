import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import { AuthForm } from "./components/AuthForm";
import { DashboardLayout } from "./components/DashboardLayout";
import { Home } from "./components/Home";
import Profile from "./components/Profile";
import { SidebarLayout } from "./components/SidebarLayout";
import { ThemeProvider } from "./components/ui/ThemeProvider";
import "./App.css";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        {/* Public route */}
        <Route
          path="/auth"
          element={user ? <Navigate to="/home" /> : <AuthForm />}
        />

        {/* Protected routes */}
        <Route
          element={user ? <SidebarLayout /> : <Navigate to="/auth" />}
        >
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<DashboardLayout />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Default route */}
        <Route path="*" element={<Navigate to={user ? "/home" : "/auth"} />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
