import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuSub
} from "../../components/ui/dropdown-menu";

import { useAuth } from "../lib/AuthProvider";

import { Bell, Zap, Settings, User, LogOut, Menu, X } from "lucide-react";
import { FaUserFriends } from "react-icons/fa";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Features", path: "/features" },
  { name: "Leaderboard", path: "/leaderboard" },
  { name: "About", path: "/about-us" },
];

export default function Navigation() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: "1", title: "Riya sent a challenge", time: "2h" },
    { id: "2", title: "Leaderboard updated", time: "1d" },
  ]);

  const unreadCount = notifications.length;

  function markRead(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }
  const streak = {
    best: 40,
    days: 30,
  }
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="w-full bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 h-14 flex items-center justify-between">

          {/* LEFT — LOGO ONLY */}
          <Link to="/" className="flex items-center">
            <img src="/icons/_Transparent_logo.png" className="w-28" alt="Codamigos" />
          </Link>

          {/* RIGHT — LINKS + SEPARATOR + QUICK ACCESS */}
          <div className="flex items-center gap-6">

            {/* LINKS */}
            <nav className="hidden md:flex items-center gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end
                  className={({ isActive }) =>
                    `text-sm px-2 py-1 rounded transition ${isActive ? "text-white bg-white/10" : "text-white/70 hover:text-white"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* SEPARATOR */}
            <div className="hidden md:block h-6 w-px bg-white/15" />

            {/* QUICK ACCESS CLUSTER */}
            <div className="flex items-center gap-2">
              <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-md hover:bg-white/10 relative">
                    <Bell className="w-5 h-5 text-white" />

                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-[1px] rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-80 bg-black/90 border border-white/10 text-white backdrop-blur-xl shadow-xl"
                >
                  {/* HEADER */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                    <span className="text-sm font-semibold text-white">Notifications</span>

                    <div className="flex items-center gap-2">
                      {notifications.length > 0 && (
                        <button
                          onClick={() => setNotifications([])}
                          className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 rounded"
                        >
                          Clear
                        </button>
                      )}

                      <button
                        onClick={() => setNotifOpen(false)}
                        className="text-white/70 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-white/60">No notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <DropdownMenuItem
                          key={n.id}
                          className="flex items-center justify-between w-full hover:bg-white/10 py-3 px-3 cursor-default"
                          onSelect={(e) => e.preventDefault()} // prevent auto-close
                        >
                          {/* LEFT SIDE */}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{n.title}</span>
                            <span className="text-[11px] text-white/50">{n.time}</span>
                          </div>

                          {/* BUTTON */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markRead(n.id);
                            }}
                            className="text-[11px] px-2 py-1 bg-white/10 rounded hover:bg-white/20"
                          >
                            mark
                          </button>
                        </DropdownMenuItem>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>


              {/* STREAK (BUTTON) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-2 py-1 rounded-md hover:bg-white/10 flex items-center gap-2">
                    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-amber-400 text-black text-xs">
                      <Zap className="w-4 h-4" />
                    </span>

                    <span className="hidden md:block text-white text-sm">
                      {streak.days}d
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-black/90 text-white backdrop-blur-xl border border-white/10 rounded-md px-3 py-2"
                >
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/80">Current</span>
                      <span className="font-medium">{streak.days}d</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-white/80">Best</span>
                      <span className="font-medium">{streak.best}d</span>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>


              {/* SETTINGS DROPDOWN */}
              {/* ACCOUNT DROPDOWN */}
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center rounded-md hover:bg-white/10 p-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/avatars/${userData?.avatarUrl}`} />
                        <AvatarFallback>
                          {userData?.displayName?.slice(0, 2) ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-black/90 border border-white/10 text-white backdrop-blur-xl"
                  >
                    <DropdownMenuLabel className="text-white/90">
                      {userData?.displayName}
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {/* PROFILE */}
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="w-4 h-4 mr-2" /> Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => navigate("/myamigos")}>
                      <FaUserFriends className="w-4 h-4 mr-2" /> Amigos
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-white/70 text-xs uppercase tracking-wider">
                         <Settings /> Settings
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={() => navigate("/settings")}>
                            General Settings
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => navigate("/help")}>
                            Help & Docs
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => navigate("/auth")}
                  className="bg-white text-black hover:bg-white/90"
                >
                  Login
                </Button>
              )}

            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileOpen((s) => !s)}
              className="md:hidden p-2 rounded-md hover:bg-white/10"
            >
              {!mobileOpen ? (
                <Menu className="w-6 h-6 text-white" />
              ) : (
                <X className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
