import { TopBar } from "@/components/layout/TopBar";
import Dashboard from "@/screen/Dashboard";

export default function Home() {

  return (
    <div className="min-h-screen bg-background flex">
      <Dashboard />
    </div>
  );
}