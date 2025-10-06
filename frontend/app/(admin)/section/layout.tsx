"use client";
import AdminNav from "@/components/AdminNav";
import React from "react";
import "../../globals.css";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <AdminNav />
          {/* Main Content Area */}
          <main className="flex-1 pt-0 px-4 sm:px-6 lg:mx-auto lg:max-w-3xl md:ml-[256px]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
};

export default AdminLayout;