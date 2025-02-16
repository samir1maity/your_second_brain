import { ProtectedRoute } from "@/lib/protected-routes";
import Dashboard from "@/screen/Dashboard";

export default function Home() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
