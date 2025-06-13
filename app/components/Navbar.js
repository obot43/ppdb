"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import {
  AcademicCapIcon,
  UserGroupIcon,
  ClipboardIcon,
  MegaphoneIcon,
  DocumentCheckIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon, // Tambahkan ini sebagai MenuIcon
  XMarkIcon, // Tambahkan ini sebagai XIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Menu untuk admin PPDB
  const renderAdminLinks = () => (
    <>
      <NavLink href="/admin" icon={<AcademicCapIcon className="w-5 h-5" />} text="Dashboard" />
      <NavLink href="/admin/students" icon={<UserGroupIcon className="w-5 h-5" />} text="Kelola Pendaftar" />
      <NavLink href="/admin/registrations" icon={<ClipboardIcon className="w-5 h-5" />} text="Data Pendaftaran" />
    </>
  );

  // Menu untuk user (calon murid/orang tua)
  const renderUserLinks = () => (
    <>
      <NavLink href="/registration" icon={<UserGroupIcon className="w-5 h-5" />} text="Daftar" />
      <NavLink href="/my-registration" icon={<ClipboardIcon className="w-5 h-5" />} text="Status Pendaftaran" />
      <NavLink href="/announcements" icon={<MegaphoneIcon className="w-5 h-5" />} text="Pengumuman" />
      <NavLink href="/requirements" icon={<DocumentCheckIcon className="w-5 h-5" />} text="Persyaratan" />
      <NavLink href="/profile" icon={<Cog6ToothIcon className="w-5 h-5" />} text="Profil" />
    </>
  );

  if (loading) {
    return (
      <nav className="backdrop-blur-lg bg-white/80 border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="backdrop-blur-lg bg-white/80 border-b border-blue-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isLoggedIn ? (user?.role === 'admin' ? '/admin' : '/registration') : '/'} 
                className="flex-shrink-0">
            <span className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-700 rounded-lg shadow-lg flex items-center justify-center">
                <UserGroupIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-700">
                PPDB Online
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {isLoggedIn ? (
              <>
                {user?.role === 'admin' ? renderAdminLinks() : renderUserLinks()}
                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-blue-900">
                    {user?.role === 'admin' ? '✨ Admin: ' : ''}
                    {user?.fullName || user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-full text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="px-6 py-2 rounded-full text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 transition-all duration-200"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            {isLoggedIn ? (
              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
              >
                {open ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 rounded-full text-sm font-medium text-white bg-blue-700"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu untuk PPDB */}
      {isLoggedIn && (
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            open ? "block" : "hidden"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-lg border-t border-gray-200">
            {user?.role === 'admin' ? (
              <>
                <MobileNavLink
                  href="/admin"
                  icon={<AcademicCapIcon className="w-5 h-5" />}
                  text="Dashboard"
                  onClick={() => setOpen(false)}
                />
                <MobileNavLink
                  href="/admin/students"
                  icon={<UserGroupIcon className="w-5 h-5" />}
                  text="Kelola Pendaftar"
                  onClick={() => setOpen(false)}
                />
                <MobileNavLink
                  href="/admin/registrations"
                  icon={<ClipboardIcon className="w-5 h-5" />}
                  text="Data Pendaftaran"
                  onClick={() => setOpen(false)}
                />
              </>
            ) : (
              <>
                <MobileNavLink
                  href="/registration"
                  icon={<UserGroupIcon className="w-5 h-5" />}
                  text="Daftar"
                  onClick={() => setOpen(false)}
                />
                <MobileNavLink
                  href="/my-registration"
                  icon={<ClipboardIcon className="w-5 h-5" />}
                  text="Status Pendaftaran"
                  onClick={() => setOpen(false)}
                />
                <MobileNavLink
                  href="/announcements"
                  icon={<MegaphoneIcon className="w-5 h-5" />}
                  text="Pengumuman"
                  onClick={() => setOpen(false)}
                />
                <MobileNavLink
                  href="/requirements"
                  icon={<DocumentCheckIcon className="w-5 h-5" />}
                  text="Persyaratan"
                  onClick={() => setOpen(false)}
                />
                <MobileNavLink
                  href="/profile"
                  icon={<Cog6ToothIcon className="w-5 h-5" />}
                  text="Profil"
                  onClick={() => setOpen(false)}
                />
              </>
            )}
            {/* Mobile User Menu */}
            <div className="pt-4 mt-2 border-t border-gray-200">
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-gray-700">
                  {user?.role === 'admin' ? '✨ Admin: ' : ''}
                  {user?.fullName || user?.username}
                </p>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-full transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Update NavLink styling
function NavLink({ href, icon, text }) {
  return (
    <Link
      href={href}
      className="flex items-center px-3 py-2 text-sm font-medium text-blue-900 hover:text-blue-700 transition-colors duration-200"
    >
      <span className="text-blue-700">{icon}</span>
      <span className="ml-2">{text}</span>
    </Link>
  );
}

function MobileNavLink({ href, icon, text, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-blue-900 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
    >
      <span className="text-blue-700">{icon}</span>
      <span className="ml-2">{text}</span>
    </Link>
  );
}