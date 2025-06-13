'use client';
import { useState, useEffect } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({ fullName: '', email: '', role: 'user' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      setStudents(usersSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.role === 'user' || u.role === 'student')
      );
    } catch (error) {
      alert('Gagal mengambil data students');
    }
    setLoading(false);
  };

  const handleRoleChange = async (id, newRole) => {
    setSavingId(id);
    try {
      await updateDoc(doc(db, 'users', id), { role: newRole });
      setStudents(students => students.map(s => s.id === id ? { ...s, role: newRole } : s));
    } catch (error) {
      alert('Gagal mengubah role');
    }
    setSavingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus siswa ini?')) return;
    setSavingId(id);
    try {
      await deleteDoc(doc(db, 'users', id));
      setStudents(students => students.filter(s => s.id !== id));
    } catch (error) {
      alert('Gagal menghapus siswa');
    }
    setSavingId(null);
  };

  const openAddForm = () => {
    setFormMode('add');
    setFormData({ fullName: '', email: '', role: 'user' });
    setEditId(null);
    setShowForm(true);
  };

  const openEditForm = (student) => {
    setFormMode('edit');
    setFormData({ fullName: student.fullName || '', email: student.email || '', role: student.role || 'user' });
    setEditId(student.id);
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return alert('Nama dan email wajib diisi');
    setSavingId('form');
    try {
      if (formMode === 'add') {
        await addDoc(collection(db, 'users'), {
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          createdAt: new Date(),
        });
      } else if (formMode === 'edit' && editId) {
        await updateDoc(doc(db, 'users', editId), {
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
        });
      }
      setShowForm(false);
      fetchStudents();
    } catch (error) {
      alert('Gagal menyimpan data');
    }
    setSavingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-8">Manajemen Siswa (Students)</h1>
        <button
          onClick={openAddForm}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Tambah Siswa
        </button>
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Daftar Siswa</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-400">Memuat data...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-400">Belum ada siswa.</td></tr>
                ) : students.map((s) => (
                  <tr key={s.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 font-semibold text-blue-700">{s.fullName || s.nama}</td>
                    <td className="px-6 py-4">{s.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={s.role}
                        onChange={e => handleRoleChange(s.id, e.target.value)}
                        disabled={savingId === s.id}
                        className="rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="user">User</option>
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => openEditForm(s)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs"
                        disabled={savingId === s.id}
                      >Edit</button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                        disabled={savingId === s.id}
                      >Hapus</button>
                      {savingId === s.id && (
                        <span className="text-indigo-500 animate-pulse ml-2">Menyimpan...</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Form Tambah/Edit */}
        {showForm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              >✕</button>
              <h2 className="text-lg font-bold mb-4">{formMode === 'add' ? 'Tambah Siswa' : 'Edit Siswa'}</h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700">Nama Lengkap</label>
                  <input
                    type="text"
                    name="fullName"
                    className="mt-1 block w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="mt-1 block w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700">Role</label>
                  <select
                    name="role"
                    className="mt-1 block w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.role}
                    onChange={handleFormChange}
                  >
                    <option value="user">User</option>
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={savingId === 'form'}
                  className="w-full py-2 px-4 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {savingId === 'form' ? 'Menyimpan...' : (formMode === 'add' ? 'Tambah' : 'Simpan')}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}