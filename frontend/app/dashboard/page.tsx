import { ProtectedRoute } from "@/lib/protected-routes";
import Dashboard from "@/screen/Dashboard";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
