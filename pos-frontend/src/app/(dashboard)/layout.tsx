import Sidebar from "../../components/layout/sidebar";
import Topbar from "../../components/layout/topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-background text-foreground h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Right side */}
      <div className="flex flex-1 flex-col">

        {/* Header (fixed) */}
        <Topbar />

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>
    </div>
  );
}
