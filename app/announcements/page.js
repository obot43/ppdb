"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/app/contexts/AuthContext";
import { MegaphoneIcon } from '@heroicons/react/24/outline';

export default function Page() {
  const { user, loading } = useAuth();
  const [reg, setReg] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    const fetchReg = async () => {
      setFetching(true);
      const q = query(collection(db, "registrations"), where("email", "==", user.email));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setReg({ id: snap.docs[0].id, ...snap.docs[0].data() });
      }
      setFetching(false);
    };
    fetchReg();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-xl bg-white/80 rounded-3xl shadow-2xl p-8 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-blue-800 mb-8 flex items-center gap-2">
          <MegaphoneIcon className="w-7 h-7 text-blue-500" />
          Hasil Seleksi PPDB
        </h1>
        {loading || fetching ? (
          <div className="text-center text-blue-600 py-12">Memuat data...</div>
        ) : !user?.email ? (
          <div className="text-center text-red-500 py-12">Silakan login untuk melihat hasil seleksi Anda.</div>
        ) : !reg ? (
          <div className="text-center text-gray-500 py-12">Data pendaftaran Anda tidak ditemukan.</div>
        ) : (
          <div className={`rounded-xl border p-6 shadow-lg text-center ${reg.status === 'Diterima' ? 'border-green-300 bg-green-50' : reg.status === 'Ditolak' ? 'border-red-300 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
            <div className="mb-2 text-lg font-bold text-blue-900">{reg.nama}</div>
            <div className="mb-2 text-sm text-blue-700">NISN: {reg.nisn}</div>
            <div className="mb-4 text-blue-700">Status Seleksi:</div>
            <span className={`inline-block px-4 py-2 rounded-full text-base font-semibold ${reg.status === 'Diterima' ? 'bg-green-100 text-green-800' : reg.status === 'Ditolak' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {reg.status}
            </span>
            {reg.status === 'Diterima' && (
              <div className="mt-6 text-green-700 font-medium">Selamat! Anda dinyatakan <b>DITERIMA</b> sebagai siswa baru. Silakan cek email untuk info selanjutnya.</div>
            )}
            {reg.status === 'Ditolak' && (
              <div className="mt-6 text-red-700 font-medium">Mohon maaf, Anda <b>TIDAK LOLOS</b> seleksi tahun ini.</div>
            )}
            {reg.status === 'Menunggu Verifikasi' && (
              <div className="mt-6 text-yellow-700 font-medium">Pendaftaran Anda masih dalam proses verifikasi.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
