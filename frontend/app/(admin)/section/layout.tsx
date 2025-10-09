"use client";
import AdminNav from "@/components/AdminNav";
import React from "react";
import "../../globals.css";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <html lang='en'>
        <body>
          <div className='flex min-h-screen'>
            <AdminNav />
            {/* Main Content Area */}
            <main className='flex-1 pt-0 px-4 sm:px-6 lg:mx-auto lg:w-full md:ml-[256px]'>
              {children}
            </main>
          </div>
        </body>
      </html>
    </QueryClientProvider>
  );
};

export default AdminLayout;