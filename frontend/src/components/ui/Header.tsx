"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { SiteLogo } from "@/components/ui/SiteLogo";
import { LogoutButton } from "@/components/LogoutButton";
import { useAuth } from "@/lib/context/AuthContext";
import { getUserProfile, getUserCredentials } from "@/lib/data/services/userProfile";
import { getProfileImageUrl } from "@/lib/data/services/profileSections/publicProfileService";

export const Header = () => {
  // State for UI controls
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  
  // State for user data
  const [profileData, setProfileData] = useState<any>(null);
  const [username, setUsername] = useState("");
  
  // Auth context
  const { isAuthenticated} = useAuth();
  const pathname = usePathname();

  // Check if we're on dashboard page
  const isDashboard = pathname?.startsWith("/dashboard");

  // Fetch user profile data whenever auth state changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchProfileData = async () => {
      if (!isAuthenticated) return;
      
      try {
        // Then fetch user data
        const credentials = await getUserCredentials();
        const profile = await getUserProfile();
        
        // Only update state if component is still mounted
        if (isMounted) {
          setUsername(credentials.username);
          setProfileData(profile);
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };
    
    fetchProfileData();
    
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setProfileDropdown(false);
  }, [pathname]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileDropdown) {
        const target = e.target;
        if (!target.closest('[data-dropdown]')) {
          setProfileDropdown(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [profileDropdown]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  // Force refresh profile data when opening dropdown
  const handleProfileClick = async (e) => {
    e.stopPropagation();
    if (!profileDropdown) {
      try {
        const credentials = await getUserCredentials();
        const profile = await getUserProfile();
        
        setUsername(credentials.username);
        setProfileData(profile);
      } catch (error) {
        console.error("Failed to refresh profile data:", error);
      }
    }
    setProfileDropdown(!profileDropdown);
  };

  // Get profile image with fallback
  const profileImageUrl = profileData 
    ? getProfileImageUrl(profileData) 
    : "/profileIcons/avatar-default.svg";
  
  // Get display name with fallback
  const displayName = profileData?.publicProfile?.displayName || username || "BrukerNavn";

  // Navigation items
  const navItems = [
    { name: "Aktiviteter", href: "/aktiviteter" },
    { name: "Nettbutikk", href: "/nettbutikk" },
    { name: "Blogg", href: "/blogg" },
    { name: "Om oss", href: "/om-oss" },
    { name: "Kontakt oss", href: "/kontakt-oss" }
  ];

  // Check if a route is active
  const isActive = (path) => {
    if (path === "/dashboard" && pathname?.startsWith("/dashboard")) {
      return true;
    }
    return pathname === path;
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#e5d1c5] shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <SiteLogo style={{ width: "90px", height: "45px" }} />
              </Link>
            </div>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-gray-800 hover:text-gray-900 px-3 py-2 text-sm font-medium ${
                    isActive(item.href) ? "border-b-2 border-blue-500" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Login or Avatar - Desktop */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                <div className="relative" data-dropdown="true">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center space-x-1 focus:outline-none"
                    aria-expanded="false"
                    aria-label="Åpne brukermeny"
                    data-dropdown="true"
                  >
                      <Image
                        src={profileImageUrl}
                        alt="Profilbilde"
                        width={34}
                        height={34}
                        className="object-cover w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden"
                        data-dropdown="true"
                      />
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-dropdown="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" data-dropdown="true"></path>
                    </svg>
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdown && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                      data-dropdown="true"
                    >
                      <div className="px-4 py-2 text-gray-800 border-b border-gray-200 flex items-center gap-2" data-dropdown="true">
                        <span className="truncate" data-dropdown="true">{displayName}</span>
                      </div>
                      
                      {/* Min side - disabled when on dashboard */}
                      {isDashboard ? (
                        <div
                          className="block px-4 py-2 text-sm text-gray-400 cursor-default"
                          data-dropdown="true"
                        >
                          Min side
                        </div>
                      ) : (
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          data-dropdown="true"
                        >
                          Min side
                        </Link>
                      )}
                      
                      <div className="border-t border-gray-200 pt-1" data-dropdown="true">
                        <LogoutButton className="block w-full text-left px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="flex items-center space-x-1 text-gray-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>Logg inn</span>
                </Link>
              )}
            </div>

            {/* Mobile menu button - FIXED FOR HYDRATION */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                aria-expanded="false"
                aria-label="Åpne meny"
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
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
              {/* Mobile profile section */}
              {isAuthenticated && (
                <div className="px-3 py-2 border-b border-gray-200 mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                      <Image
                        src={profileImageUrl}
                        alt="Profilbilde"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium text-gray-800">{displayName}</span>
                  </div>
                </div>
              )}

              {/* Navigation links */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded ${
                    isActive(item.href) ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Min side - disabled when on dashboard */}
              {isAuthenticated && (
                isDashboard ? (
                  <div
                    className="block px-3 py-2 text-gray-400 rounded cursor-default bg-gray-50"
                  >
                    Min side
                  </div>
                ) : (
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
                  >
                    Min side
                  </Link>
                )
              )}

              {/* Login/Logout button */}
              {isAuthenticated ? (
                <LogoutButton className="block w-full text-left px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600" />
              ) : (
                <Link
                  href="/signin"
                  className="block px-3 py-2 text-center text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Logg inn
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Spacing to prevent content from going under header */}
      <div className="h-16"></div>
    </>
  );
};