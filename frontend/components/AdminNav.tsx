"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';

const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'About', path: '/section/about' },
    { name: 'Experiences', path: '/section/experiences' },
    { name: 'Projects', path: '/section/projects' },
    { name: 'Skills', path: '/section/skills' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed inset-y-0 left-0 bg-gray-900 text-white w-64 flex-col z-50">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Menu</h2>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`block p-2 rounded transition-colors ${
                    pathname === item.path ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Sheet with Hamburger Icon */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-gray-900 text-white p-4">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold">Menu</h2>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`block p-2 rounded transition-colors ${
                      pathname === item.path ? 'bg-gray-700' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminNav;