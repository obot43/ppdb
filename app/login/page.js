"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Swal from 'sweetalert2';
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const showAlert = (type, title, text) => {
    Swal.fire({
      icon: type,
      title: title,
      text: text,
      showConfirmButton: true,
      confirmButtonColor: '#2563eb', // blue-600
      background: '#ffffff',
      customClass: {
        title: 'text-gray-800',
        content: 'text-gray-600',
        confirmButton: 'bg-blue-600 hover:bg-blue-700'
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Login logic
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Show success toast
          Swal.fire({
            icon: 'success',
            title: 'Login Berhasil!',
            text: 'Anda akan diarahkan ke halaman utama...',
            timer: 1500,
            showConfirmButton: false,
            background: '#ffffff',
            customClass: {
              title: 'text-gray-800',
              content: 'text-gray-600'
            }
          });

          // Save user data and update auth state
          login(data.user);

          // Redirect based on role
          if (data.user.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/registration");
          }
        } else {
          showAlert('error', 'Login Gagal', data.message || 'Terjadi kesalahan saat login');
        }
      } else {
        // Register logic
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            role: "user",
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Show success message
          await Swal.fire({
            icon: 'success',
            title: 'Registrasi Berhasil!',
            text: 'Silakan login dengan akun baru Anda',
            confirmButtonColor: '#14b8a6',
            background: '#ffffff',
            customClass: {
              title: 'text-gray-800',
              content: 'text-gray-600',
              confirmButton: 'bg-teal-500 hover:bg-teal-600'
            }
          });

          // Reset form and switch to login
          setFormData({
            email: "",
            password: "",
            fullName: "",
          });
          setIsLogin(true);
        } else {
          showAlert('error', 'Registrasi Gagal', data.message || 'Terjadi kesalahan saat registrasi');
        }
      }
    } catch (err) {
      console.error("Error:", err);
      showAlert('error', 'Terjadi Kesalahan', 'Silakan coba lagi nanti');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({
      email: formData.email,
      password: "",
      fullName: formData.fullName,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo & Branding */}
        <Link href="/" className="flex justify-center mb-8">
          <span className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl shadow-lg flex items-center justify-center">
              <AcademicCapIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              PPDB 2025
            </span>
          </span>
        </Link>

        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-blue-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {isLogin ? "Selamat Datang Kembali!" : "Bergabung dengan Kami"}
            </h2>
            <p className="mt-2 text-gray-600">
              {isLogin 
                ? "Masuk ke akun Anda untuk melanjutkan" 
                : "Buat akun baru untuk mulai berbelanja"}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Nama Lengkap Field - Only for Register */}
              {!isLogin && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-blue-700">
                    Nama Lengkap
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    minLength={3}
                    className="mt-1 block w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm"
                    placeholder="Masukkan nama lengkap"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-blue-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="mt-1 block w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm"
                  placeholder="••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? "Masuk..." : "Mendaftar..."}
                </span>
              ) : isLogin ? (
                "Masuk Sekarang"
              ) : (
                "Daftar Sekarang"
              )}
            </button>
          </form>
        </div>

        <button
          onClick={toggleMode}
          disabled={loading}
          className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none disabled:opacity-50 transition-colors"
        >
          {isLogin
            ? "Belum punya akun? Daftar sekarang"
            : "Sudah punya akun? Masuk"}
        </button>
      </div>
    </div>
  );
}