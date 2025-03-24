"use client"

import Link from "next/link"
import { SiteLogo } from "@/components/ui/SiteLogo";
import { useState, useEffect } from "react";
import { LogoutButton } from "@/components/LogoutButton"; // Bruker absolutt importsti

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Sjekk innloggingsstatus når komponenten lastes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        setIsLoggedIn(data.authenticated);
      } catch (error) {
        console.error("Failed to check authentication status:", error);
        setIsLoggedIn(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <SiteLogo className="/* Dark mode støtte */" style={{ width: "90px", height: "45px" }} />
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                type="button" 
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                onClick={toggleMenu}
              >
                <span className="sr-only">Åpne meny</span>
                {isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex space-x-8">
              <Link className="text-gray-700 hover:text-gray-900" href="/store">
                Nettbutikk
              </Link>
              <Link className="text-gray-700 hover:text-gray-900" href="/blogg">
                Blogg
              </Link>
              <Link className="text-gray-700 hover:text-gray-900" href="/om-oss">
                Om oss
              </Link>
              <Link className="text-gray-700 hover:text-gray-900" href="/kontakt-oss">
                Kontakt oss
              </Link>
            </nav>
            
            {/* Login/Logout Button - Desktop */}
            <div className="hidden md:block">
              {isLoggedIn ? (
                <LogoutButton className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" />
              ) : (
                <Link className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" href="/signin">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <Link className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded" href="/store">
              Nettbutikk
            </Link>
            <Link className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded" href="/blogg">
              Blogg
            </Link>
            <Link className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded" href="/om-oss">
              Om oss
            </Link>
            <Link className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded" href="/kontakt-oss">
              Kontakt oss
            </Link>
            {isLoggedIn ? (
              <LogoutButton className="block w-full text-left px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600" />
            ) : (
              <Link className="block px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" href="/signin">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
      
      {/* This div provides spacing to ensure content doesn't go under the header */}
      <div className="h-16"></div>
    </>
  );
};