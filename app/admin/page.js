"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { db } from '@/app/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

function UsersIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersAndRegistrations = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        const regSnap = await getDocs(collection(db, 'registrations'));
        setRegistrations(regSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching users/registrations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsersAndRegistrations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-6 px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
            <div className="flex items-center mt-2">
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full mr-2">Admin</span>
              <span className="text-white/80">Selamat datang, <b>{user?.fullName || 'Admin'}</b></span>
            </div>
          </div>
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'Admin')}&background=4f46e5&color=fff&size=64`}
            alt="Admin Avatar"
            className="w-14 h-14 rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {/* Total Users */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 hover:scale-105 transition-transform duration-200 border-t-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                <UsersIcon className="h-7 w-7 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-green-700">Total Pengguna</dt>
                  <dd className="text-2xl font-bold text-green-900">{users.length}</dd>
                </dl>
              </div>
            </div>
            <div className="mt-4 text-right">
              <span className="text-sm font-medium text-green-600">Data dari register</span>
            </div>
          </div>
          {/* Total Registrations */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 hover:scale-105 transition-transform duration-200 border-t-4 border-indigo-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full">
                <svg className="h-7 w-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm-6 8v-1a4 4 0 014-4h4a4 4 0 014 4v1" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-indigo-700">Total Pendaftar</dt>
                  <dd className="text-2xl font-bold text-indigo-900">{registrations.length}</dd>
                </dl>
              </div>
            </div>
            <div className="mt-4 text-right">
              <span className="text-sm font-medium text-indigo-600">Data dari formulir registration</span>
            </div>
          </div>
        </div>

        {/* Tabel Users */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl mb-10">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Data Pengguna Terdaftar</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Daftar</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-400">Belum ada pengguna terdaftar.</td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 font-semibold text-blue-700">{u.fullName || u.nama}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        u.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabel Registrasi Pendaftar */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Data Pendaftar (Formulir Registration)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NISN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asal Sekolah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Daftar</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-400">Belum ada pendaftar.</td>
                  </tr>
                )}
                {registrations.map((r) => (
                  <tr key={r.id} className="hover:bg-indigo-50 transition">
                    <td className="px-6 py-4 font-semibold text-indigo-700">{r.nama}</td>
                    <td className="px-6 py-4">{r.nisn}</td>
                    <td className="px-6 py-4">{r.email}</td>
                    <td className="px-6 py-4">{r.asalSekolah}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        r.status === 'Menunggu Verifikasi' ? 'bg-yellow-100 text-yellow-800' :
                        r.status === 'Diterima' ? 'bg-green-100 text-green-800' :
                        r.status === 'Ditolak' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : (r.createdAt ? new Date(r.createdAt).toLocaleString() : '-')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}