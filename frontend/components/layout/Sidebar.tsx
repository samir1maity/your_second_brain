import { BarChart2, Home, Settings, Users, X } from "lucide-react";

export type SidebarProps = {
  sidebarOpen: boolean; 
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>; 
};

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: "Dashboard" },
    { icon: Users, label: "Users" },
    { icon: BarChart2, label: "Analytics" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-[#171717] text-white p-4 transform transition-transform duration-300 ease-in-out z-30 
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      <nav>
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-card transition-colors"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
