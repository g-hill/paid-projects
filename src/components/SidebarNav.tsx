import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Kanban, User } from "lucide-react";

export function SidebarNav() {
  const [collapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", icon: Home, path: "/home" },
    { label: "Board", icon: Kanban, path: "/dashboard" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <aside
      className={`transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } `}
    >
      <div className="navbar-container p-4">

        <nav className="space-y-2">
          {navItems.map(({ label, icon: Icon, path }) => (
            <Button
              key={label}
              variant="ghost"
              className={`w-full justify-start ${
                location.pathname === path ? "bg-muted" : ""
              }`}
              onClick={() => navigate(path)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {!collapsed && label}
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
