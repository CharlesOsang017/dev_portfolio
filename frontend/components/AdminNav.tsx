"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, Router } from "lucide-react";
// import { useLogoutMutation } from "@/app/hooks/use-auth";
import { toast } from "sonner";

const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "About", path: "/section/about" },
    { name: "Experiences", path: "/section/experiences" },
    { name: "Projects", path: "/section/projects" },
    { name: "Skills", path: "/section/skills" },
  ];

  // const {mutate: logout, isPending} = useLogoutMutation();

  const handleLogout = () => {
    // logout();
    router.push("/auth/login");
    toast.success("Logout successful");

  };

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed inset-y-0 left-0 bg-gray-900 text-white w-48 flex-col z-50">
        <div className="p-4 border-b border-gray-700">
          <Link href={"/section"}>
          <h2 className="text-2xl font-bold">Admin</h2>
          </Link>
        </div>
        <nav className="flex-1 p-4 flex flex-col">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`block p-2 rounded transition-colors ${
                    pathname === item.path ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-2 rounded hover:bg-gray-700 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Sheet with Hamburger Icon */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-gray-900 text-white p-4">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold">Menu</h2>
          </div>
          <nav className="flex-1 p-4 flex flex-col">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`block p-2 rounded transition-colors ${
                      pathname === item.path ? "bg-gray-700" : "hover:bg-gray-700"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center w-full p-2 rounded hover:bg-gray-700 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminNav;