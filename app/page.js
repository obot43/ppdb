"use client";
import { AcademicCapIcon } from '@heroicons/react/24/solid';
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100">
      <div className="max-w-2xl w-full mx-auto bg-white/90 rounded-3xl shadow-2xl p-12 backdrop-blur-md border-t-8 border-blue-500 flex flex-col items-center">
        <div className="flex flex-col items-center gap-6 mb-10">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-400 p-5 rounded-2xl shadow-lg">
            <AcademicCapIcon className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight drop-shadow-lg text-center">PPDB 2025</h1>
          <p className="text-xl text-blue-700 font-medium text-center max-w-lg">
            Portal Penerimaan Peserta Didik Baru<br />
            <span className="text-blue-400 font-normal text-base">Digital • Mudah • Transparan</span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-12">
          <Link href="/login" className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-bold text-lg shadow-xl hover:from-blue-700 hover:to-indigo-600 transition-all text-center">
            Masuk / Daftar
          </Link>
        </div>
        <div className="w-full flex justify-center">
          <div className="w-64 h-44 bg-gradient-to-br from-blue-200/60 to-indigo-200/40 rounded-2xl flex items-center justify-center shadow-inner">
            <AcademicCapIcon className="w-24 h-24 text-blue-300 opacity-40" />
          </div>
        </div>
        <div className="mt-10 text-center text-blue-400 text-sm font-light">
          &copy; {new Date().getFullYear()} PPDB Online. All rights reserved.
        </div>
      </div>
    </div>
  );
}