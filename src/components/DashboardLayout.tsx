import { SidebarNav } from './SidebarNav'
import { CardBoard } from './CardBoard'


export function DashboardLayout() {
  return (
    <><div className="flex h-screen">
            <SidebarNav /><main className="flex-1 p-6 overflow-auto bg-muted/40">
        <CardBoard />
      </main>
    </div>
    </>
  )
}
