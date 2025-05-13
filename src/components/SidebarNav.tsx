import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Home, Kanban } from 'lucide-react'

export function SidebarNav() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} bg-background border-r`}>
      <div className="h-full flex flex-col p-4">
        <Button variant="ghost" className="mb-4" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '→' : '←'}
        </Button>

        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" /> {!collapsed && 'Home'}
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Kanban className="mr-2 h-4 w-4" /> {!collapsed && 'Board'}
          </Button>
        </nav>
      </div>
    </aside>
  )
}
