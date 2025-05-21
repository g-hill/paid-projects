import { CardBoard } from "./CardBoard"

export function DashboardLayout() {
  return (
    <div className="flex flex-col">


      {/* Content below the nav */}
      <div className="content-container flex flex-1 overflow-hidden">
        <main className="flex-1 p-6">
          <CardBoard />
        </main>
      </div>
    </div>
  )
}
