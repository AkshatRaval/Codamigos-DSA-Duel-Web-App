import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { FaUserFriends } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Features", path: "/features" },
  { name: "Leaderboard", path: "/leaderboard" },
  { name: "About", path: "/about-us" },
];
import { useAuth } from "../lib/AuthProvider";
import { LogOut, User } from "lucide-react";

export default function Navigation() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { currentUser, userData, logout } = useAuth();
  // console.log(userData);

  return (
    <header className="w-full md:bg-background fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-20">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
              <img
                src="/icons/_Transparent_logo.png"
                alt="Codamigos"
                className="w-28"
              />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-[#ffffffb3] hover:text-white transition-all"
              >
                {link.name}
              </Link>
            ))}

            <div className="h-6 w-px bg-white/10 mx-2" />

            <div className="hidden lg:block ">
              {currentUser ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Avatar>
                        <AvatarImage src={`/avatars/${userData?.avatarUrl}`} />
                        <AvatarFallback>Waiting</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>{userData?.displayName}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('profile')}><User /> Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('myamigos')}><FaUserFriends />Amigos</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => logout()}>
                       <LogOut /> Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  variant="default"
                  className="cursor-pointer"
                  onClick={() => navigate("/auth")}
                >
                  Login
                </Button>
              )}
            </div>
          </nav>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/90 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              {/* icon */}
              {!open ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden transition-transform duration-200 ease-in-out origin-top ${open ? "scale-y-100" : "scale-y-0 pointer-events-none"
          }`}
      >
        <div className="bg-[#07080a]/80 backdrop-blur-sm border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-20 py-6 flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className="text-white/90 text-lg font-medium px-2 py-2 rounded hover:bg-white/5 transition"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              <Button
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                className="w-full"
              >
                Login
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  navigate("/signup");
                }}
                className="w-full"
              >
                Signup
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
