"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const router = useRouter();
  // const pathname = usePathname();
  const [activeHash, setActiveHash] = useState<string>("");

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experiences", href: "#experience" },
    { name: "Projects", href: "#projects" },    
  ];

  // Update activeHash based on current URL hash
  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash || "#home");
    };
    handleHashChange(); // Set initial hash
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Smooth scroll and hash update handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Adjust for navbar height
        behavior: "smooth",
      });
      // Update URL hash without reloading
      window.history.pushState(null, "", href);
      setActiveHash(href); // Update active state
    }
    setIsOpen(false); // Close mobile menu
  };

  return (
    <div className="sticky top-0 z-50 w-full px-4 sm:px-10 py-2 text-white">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <img src="/images/logo.svg" alt="logo" className="h-8" />

        {/* Desktop Middle Nav */}
        <nav className="hidden md:flex items-center gap-4 bg-neutral-800 px-4 py-2 rounded-[20px] text-gray-900">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`text-sm font-medium transition-colors ${
                activeHash === item.href
                  ? "text-gray-600 bg-white rounded-md px-4 py-2"
                  : "text-gray-400"
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 p-4 bg-black ">
            <div className="flex flex-col space-y-4 mt-10">
              {navItems.map((item) => (
                <SheetClose key={item.name} asChild>
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`text-lg ${
                      activeHash === item.href
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-white hover:text-blue-600'
                    } p-2 rounded-md`}
                  >
                    {item.name}
                  </Link>
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        </div>

        {/* Contact Button (Desktop) */}
        <Button
          asChild
          className="hidden md:block bg-white text-gray-500 hover:cursor-pointer hover:scale-105 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
        >
          <a href="#contact" onClick={(e) => handleNavClick(e, "#contact")}>
            Contact Me
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Navbar;