import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import { AuthForm } from "./components/AuthForm";
import { DashboardLayout } from "./components/DashboardLayout";
import { ThemeProvider } from "./components/ui/ThemeProvider";
import "./App.css";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <AuthForm />}
        />
        <Route
          path="/dashboard"
          element={user ? <DashboardLayout /> : <Navigate to="/" />}
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
