import { SidebarNav } from "./SidebarNav"
import { CardBoard } from "./CardBoard"
import { TopNav } from "./TopNav"

export function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation */}
      <header className="w-full border-b bg-background px-6 py-3 shadow-sm">
        <TopNav />
      </header>

      {/* Content below the nav */}
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav />
        <main className="flex-1 p-6 overflow-auto bg-muted/0">
          <CardBoard />
        </main>
      </div>
    </div>
  )
}
