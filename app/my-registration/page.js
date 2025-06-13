"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/app/contexts/AuthContext";

export default function RegistrationListPage() {
  const { user, loading: authLoading } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    async function fetchRegistrations() {
      setLoading(true);
      const q = query(
        collection(db, "registrations"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Filter hanya data milik user yang login
      setRegistrations(data.filter((r) => r.email === user.email));
      setLoading(false);
    }
    fetchRegistrations();
  }, [user]);

  if (authLoading || loading)
    return <div className="p-8 text-center">Memuat data...</div>;
  if (!user?.email)
    return (
      <div className="p-8 text-center text-red-500">
        Silakan login untuk melihat data pendaftaran Anda.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow p-8">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Daftar Pendaftaran Siswa Baru
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-blue-50 text-blue-700">
              <th className="py-2 px-3 border">No</th>
              <th className="py-2 px-3 border">Nama</th>
              <th className="py-2 px-3 border">NISN</th>
              <th className="py-2 px-3 border">Asal Sekolah</th>
              <th className="py-2 px-3 border">Status</th>
              <th className="py-2 px-3 border">Tanggal Daftar</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-400">
                  Belum ada data pendaftaran.
                </td>
              </tr>
            )}
            {registrations.map((reg, idx) => (
              <tr key={reg.id} className="hover:bg-blue-50">
                <td className="border px-3 py-2 text-center">{idx + 1}</td>
                <td className="border px-3 py-2">{reg.nama}</td>
                <td className="border px-3 py-2">{reg.nisn}</td>
                <td className="border px-3 py-2">{reg.asalSekolah}</td>
                <td className="border px-3 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs ${
                      reg.status === "Diterima"
                        ? "bg-green-600"
                        : reg.status === "Ditolak"
                        ? "bg-red-600"
                        : "bg-yellow-500"
                    }`}
                  >
                    {reg.status}
                  </span>
                </td>
                <td className="border px-3 py-2">
                  {reg.createdAt?.toDate
                    ? reg.createdAt.toDate().toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}