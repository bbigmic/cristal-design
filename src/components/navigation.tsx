"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { CartDropdown } from "@/components/cart/CartDropdown";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/cristal-design-logo.png"
              alt="CRISTAL DESIGN Logo"
              width={60}
              height={60}
              className="object-contain"
            />
            <span className="text-xl font-bold text-gray-900">CRISTAL DESIGN</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Strona główna
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
              Produkty
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              O nas
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Kontakt
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <CartDropdown />
            {status === "loading" ? (
              <div className="w-20 h-10 bg-gray-200 rounded animate-pulse"></div>
            ) : session ? (
              <>
                <span className="text-sm text-gray-700">
                  Cześć, {session.user?.name || session.user?.email}
                </span>
                {(session.user as { role?: string })?.role === "ADMIN" && (
                  <Button asChild>
                    <Link href="/admin">Panel Admin</Link>
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => signOut()}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Wyloguj</span>
                </Button>
              </>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/login">Zaloguj się</Link>
              </Button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-2">
            <CartDropdown />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Strona główna
              </Link>
              <Link
                href="/products"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Produkty
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                O nas
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Kontakt
              </Link>
              <div className="pt-4 border-t">
                <div className="flex items-center space-x-3 px-3 py-2 mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    {status === "loading" ? (
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ) : session ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {session.user?.name || session.user?.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {(session.user as { role?: string })?.role === "ADMIN" ? "Administrator" : "Użytkownik"}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">Nie zalogowany</div>
                    )}
                  </div>
                </div>
                
                {status === "loading" ? (
                  <div className="w-full h-10 bg-gray-200 rounded animate-pulse mb-2"></div>
                ) : session ? (
                  <>
                    {(session.user as { role?: string })?.role === "ADMIN" && (
                      <Button asChild className="w-full mb-2">
                        <Link href="/admin">Panel Admin</Link>
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={() => signOut()}
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Wyloguj</span>
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login">Zaloguj się</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
