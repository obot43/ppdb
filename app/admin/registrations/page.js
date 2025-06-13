'use client';
import { useState, useEffect } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    nama: '', nisn: '', email: '', alamat: '', asalSekolah: '', status: 'Menunggu Verifikasi'
  });
  const [editId, setEditId] = useState(null);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'registrations'));
      setRegistrations(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      alert('Gagal mengambil data registrasi');
    }
    setLoading(false);
  };

  const openAddForm = () => {
    setFormMode('add');
    setFormData({ nama: '', nisn: '', email: '', alamat: '', asalSekolah: '', status: 'Menunggu Verifikasi' });
    setEditId(null);
    setShowForm(true);
  };

  const openEditForm = (reg) => {
    setFormMode('edit');
    setFormData({
      nama: reg.nama || '',
      nisn: reg.nisn || '',
      email: reg.email || '',
      alamat: reg.alamat || '',
      asalSekolah: reg.asalSekolah || '',
      status: reg.status || 'Menunggu Verifikasi',
    });
    setEditId(reg.id);
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.nisn || !formData.email) return alert('Nama, NISN, dan email wajib diisi');
    setSavingId('form');
    try {
      if (formMode === 'add') {
        await addDoc(collection(db, 'registrations'), {
          ...formData,
          createdAt: new Date(),
        });
      } else if (formMode === 'edit' && editId) {
        await updateDoc(doc(db, 'registrations', editId), {
          ...formData,
        });
      }
      setShowForm(false);
      fetchRegistrations();
    } catch (error) {
      alert('Gagal menyimpan data');
    }
    setSavingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data pendaftar ini?')) return;
    setSavingId(id);
    try {
      await deleteDoc(doc(db, 'registrations', id));
      setRegistrations(registrations => registrations.filter(r => r.id !== id));
    } catch (error) {
      alert('Gagal menghapus data');
    }
    setSavingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-8">Manajemen Pendaftar (Registration)</h1>
        <button
          onClick={openAddForm}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Tambah Pendaftar
        </button>
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Daftar Pendaftar</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NISN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asal Sekolah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-400">Memuat data...</td></tr>
                ) : registrations.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-400">Belum ada pendaftar.</td></tr>
                ) : registrations.map((r) => (
                  <tr key={r.id} className="hover:bg-indigo-50 transition">
                    <td className="px-6 py-4 font-semibold text-indigo-700">{r.nama}</td>
                    <td className="px-6 py-4">{r.nisn}</td>
                    <td className="px-6 py-4">{r.email}</td>
                    <td className="px-6 py-4">{r.alamat}</td>
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
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => openEditForm(r)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs"
                        disabled={savingId === r.id}
                      >Edit</button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                        disabled={savingId === r.id}
                      >Hapus</button>
                      {savingId === r.id && (
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
              <h2 className="text-lg font-bold mb-4">{formMode === 'add' ? 'Tambah Pendaftar' : 'Edit Pendaftar'}</h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700">Nama</label>
                  <input
                    type="text"
                    name="nama"
                    className="mt-1 block w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.nama}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700">NISN</label>
                  <input
                    type="text"
                    name="nisn"
                    className="mt-1 block w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.nisn}
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
                  <label className="block text-sm font-medium text-blue-700">Alamat</label>
                  <input
                    type="text"
                    name="alamat"
                    className="mt-1 block w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.alamat}
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700">Asal Sekolah</label>
                  <input
                    type="text"
                    name="asalSekolah"
                    className="mt-1 block w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.asalSekolah}
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700">Status</label>
                  <select
                    name="status"
                    className="mt-1 block w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.status}
                    onChange={handleFormChange}
                  >
                    <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                    <option value="Diterima">Diterima</option>
                    <option value="Ditolak">Ditolak</option>
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