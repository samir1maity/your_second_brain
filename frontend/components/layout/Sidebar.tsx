import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"

const navItems = [
  { name: "Dashboard", icon: Settings2, active: true },
  { name: "Analytics", icon: Settings2 },
  { name: "Shop Analyzer", icon: Settings2 },
  { name: "Sales Report", icon: Settings2 },
  { name: "Transactions", icon: Settings2 },
]

export function Sidebar() {
  return (
    <div className="flex flex-col flex-grow gap-y-5 overflow-y-auto border-r bg-background px-6 pb-4">
      <div className="flex h-16 items-center gap-2">
        <div className="rounded-lg bg-primary/10 p-2">
          <div className="h-6 w-6 rounded-sm bg-primary" />
        </div>
        <span className="text-xl font-semibold">Salepol</span>
      </div>
      <nav className="flex flex-1 flex-col">
        <div className="space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={`w-full justify-start gap-2 ${item.active ? "" : "text-muted-foreground"}`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Button>
          ))}
        </div>
      </nav>
    </div>
  )
}

