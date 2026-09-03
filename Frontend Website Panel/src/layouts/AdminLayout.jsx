import Sidebar from "../components/admin/Sidebar";

/**
 * AdminLayout — Layout untuk role: super_admin, content_admin, marketing
 * Sidebar gelap di kiri + content area scrollable di kanan
 * Pada mobile: sidebar berupa drawer overlay + hamburger button
 */
export default function AdminLayout({ children }) {
  return (
    <div
      className="flex h-screen overflow-hidden font-sans"
      style={{ background: "#0A0D14" }}
    >
      <Sidebar />
      <div
        className="flex-1 h-screen overflow-y-auto custom-scrollbar pt-16 lg:pt-0"
        style={{ background: "#0F1117" }}
      >
        {children}
      </div>
    </div>
  );
}
