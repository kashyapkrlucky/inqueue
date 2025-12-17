// src/components/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="flex flex-row h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
         
          <Outlet />
         
      </main>
    </div>
  );
}
