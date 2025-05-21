// components/SidebarLayout.tsx
import { SidebarNav } from "@/components/SidebarNav";
// import { TopNav } from "@/components/TopNav";
import { Outlet } from "react-router-dom";

export function SidebarLayout() {
  return (
    <div className="flex flex-col">
      {/* <header className="w-full border-b bg-background px-6 py-3 shadow-sm">
        <TopNav />
      </header> */}
      <div className="flex gap-6">
        <SidebarNav />
        <main className="gap-6 flex justify-between">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
