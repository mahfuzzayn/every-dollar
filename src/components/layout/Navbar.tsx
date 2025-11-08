"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X as XIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const navLinks = [
    { href: "/", label: "Manage Expenses" },
    { href: "/visuals", label: "Visuals" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className="w-full border-b-4 bg-white sticky top-0 z-50"
      style={{
        borderColor: 'var(--neo-border)',
        boxShadow: '0 4px 0px 0px var(--shadow-color)',
      }}
    >
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-black tracking-tight">Every<span className="text-primary">Dollar</span></h1>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden border-4 flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XIcon className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>


          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-bold border-4 transition-all",
                  isActive(link.href)
                    ? "bg-primary/50 text-black/80"
                    : "bg-white text-black hover:bg-accent hover:translate-x-[-2px] hover:translate-y-[-2px]"
                )}
                style={{
                  borderColor: 'var(--neo-border)',
                  boxShadow: isActive(link.href)
                    ? '4px 4px 0px 0px var(--shadow-color)'
                    : '4px 4px 0px 0px var(--shadow-color)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.href)) {
                    e.currentTarget.style.boxShadow = '6px 6px 0px 0px var(--shadow-color)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.href)) {
                    e.currentTarget.style.boxShadow = '4px 4px 0px 0px var(--shadow-color)';
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 md:h-12 md:w-12 cursor-pointer border-2 flex-shrink-0"
                  style={{ borderColor: 'var(--neo-border)' }}
                  aria-label="User menu"
                >
                  <Avatar className="h-10 w-10 md:h-12 md:w-12">
                    <AvatarFallback className="text-xs md:text-sm">{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-black leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground font-medium">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t-4 bg-white w-full absolute left-0 top-full"
          style={{
            borderColor: 'var(--neo-border)',
            boxShadow: '0 4px 0px 0px var(--shadow-color)',
          }}
        >
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 text-sm font-bold border-4 transition-all w-full",
                  isActive(link.href)
                    ? "bg-primary/50 text-black/80"
                    : "bg-white text-black hover:bg-accent"
                )}
                style={{
                  borderColor: 'var(--neo-border)',
                  boxShadow: '4px 4px 0px 0px var(--shadow-color)',
                }}
              >
                {link.label}
              </Link>
            ))}
            {/* Mobile User Info */}
            <div className="pt-4 border-t-4 px-4" style={{ borderColor: 'var(--neo-border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-black leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground font-medium">
                    {user.email}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-4 font-bold"
                onClick={logout}
                style={{ borderColor: 'var(--neo-border)' }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

