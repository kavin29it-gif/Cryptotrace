import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full relative z-10">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 z-0">
          {children}
        </main>
      </div>
    </div>
  );
}
