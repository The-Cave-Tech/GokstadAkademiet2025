import Link from "next/link"
import { SiteLogo } from "./SiteLogo";

export const Header = () => {
  return (
    <header className="bg-white shadow">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
              <SiteLogo className="/* Dark mode støtte */" style={{ width: "90px", height: "45px" }} />
          </Link>
        </div>
        {/* Navigation Links */}
        <nav className="flex space-x-8">
        <Link className="text-gray-700 hover:text-gray-900" href="/om-oss">
            Om oss
          </Link>
          <Link className="text-gray-700 hover:text-gray-900" href="/kontakt-oss">
            Kontakt oss
          </Link>
          <Link className="text-gray-700 hover:text-gray-900" href="/store">
            Nettbutikk
          </Link>
          <Link className="text-gray-700 hover:text-gray-900" href="/blogg">
            Blogg
          </Link>
         
        </nav>
        {/* Login Button */}
        <div>
          <Link className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" href="/login">
              Login
          </Link>
        </div>
      </div>
    </div>
  </header>
);
};