"use client";
import AdminNav from "@/components/AdminNav";
import React from "react";
import "../../globals.css";
import { ReactQueryProvider } from "@/app/provider/react-query-provider";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const authenticated = false;
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
         { authenticated && <AdminNav />}
          {/* Main Content Area */}
          <main className="flex-1 pt-0 px-4 sm:px-6 lg:mx-auto lg:max-w-3xl md:ml-[256px]">
          <ReactQueryProvider>{children}</ReactQueryProvider>
          </main>
        </div>
      </body>
    </html>
  );
};

export default AdminLayout;