export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div className="min-h-screen bg-[#212121]">{children}</div>;
  }