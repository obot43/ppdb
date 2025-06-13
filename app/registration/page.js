"use client";
import { useState } from "react";

export default function RegistrationPage() {
  const [form, setForm] = useState({
    nama: "",
    nisn: "",
    email: "",
    alamat: "",
    asalSekolah: "",
    dokumenKK: null,
    dokumenIjazah: null,
    dokumenSKHUN: null,
    dokumenFoto: null,
  });
  const [preview, setPreview] = useState({
    dokumenKK: null,
    dokumenIjazah: null,
    dokumenSKHUN: null,
    dokumenFoto: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
      setPreview({
        ...preview,
        [name]: URL.createObjectURL(files[0]),
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("nama", form.nama);
    formData.append("nisn", form.nisn);
    formData.append("email", form.email);
    formData.append("alamat", form.alamat);
    formData.append("asalSekolah", form.asalSekolah);
    if (form.dokumenKK) formData.append("dokumenKK", form.dokumenKK);
    if (form.dokumenIjazah) formData.append("dokumenIjazah", form.dokumenIjazah);
    if (form.dokumenSKHUN) formData.append("dokumenSKHUN", form.dokumenSKHUN);
    if (form.dokumenFoto) formData.append("dokumenFoto", form.dokumenFoto);

    try {
      const res = await fetch("/api/registration", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        alert(data.error || "Gagal mengirim data. Silakan coba lagi.");
      }
    } catch (err) {
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-10">
      <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-2xl p-8 border border-blue-100">
        <h1 className="text-3xl font-bold text-blue-700 mb-2 text-center tracking-tight">
          Formulir Pendaftaran Siswa Baru
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Silakan isi data diri dan upload dokumen persyaratan dengan benar.
        </p>
        {success ? (
          <div className="flex flex-col items-center py-12">
            <svg width={64} height={64} fill="none" viewBox="0 0 24 24">
              <circle cx={12} cy={12} r={12} fill="#2563eb" opacity="0.1" />
              <path
                d="M7 13l3 3 7-7"
                stroke="#2563eb"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2 className="text-xl font-semibold text-blue-700 mt-4 mb-2">
              Pendaftaran Berhasil!
            </h2>
            <p className="text-gray-500 text-center">
              Data Anda telah kami terima. Silakan cek email untuk informasi selanjutnya.
            </p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="nama"
                  required
                  value={form.nama}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-blue-200 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Nama lengkap sesuai ijazah"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  NISN
                </label>
                <input
                  type="text"
                  name="nisn"
                  required
                  value={form.nisn}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-blue-200 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Nomor Induk Siswa Nasional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Email Aktif
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-blue-200 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Alamat email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Asal Sekolah
                </label>
                <input
                  type="text"
                  name="asalSekolah"
                  required
                  value={form.asalSekolah}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-blue-200 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Nama sekolah asal"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  name="alamat"
                  required
                  value={form.alamat}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-blue-200 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Alamat lengkap sesuai KK"
                  rows={2}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Kartu Keluarga (KK)
                </label>
                <input
                  type="file"
                  name="dokumenKK"
                  accept="image/*,application/pdf"
                  required
                  onChange={handleChange}
                  className="block w-full text-sm text-blue-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {preview.dokumenKK && (
                  <img
                    src={preview.dokumenKK}
                    alt="Preview KK"
                    className="mt-2 rounded shadow w-24 h-16 object-cover border"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Ijazah Terakhir
                </label>
                <input
                  type="file"
                  name="dokumenIjazah"
                  accept="image/*,application/pdf"
                  required
                  onChange={handleChange}
                  className="block w-full text-sm text-blue-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {preview.dokumenIjazah && (
                  <img
                    src={preview.dokumenIjazah}
                    alt="Preview Ijazah"
                    className="mt-2 rounded shadow w-24 h-16 object-cover border"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  SKHUN
                </label>
                <input
                  type="file"
                  name="dokumenSKHUN"
                  accept="image/*,application/pdf"
                  required
                  onChange={handleChange}
                  className="block w-full text-sm text-blue-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {preview.dokumenSKHUN && (
                  <img
                    src={preview.dokumenSKHUN}
                    alt="Preview SKHUN"
                    className="mt-2 rounded shadow w-24 h-16 object-cover border"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Pas Foto 3x4
                </label>
                <input
                  type="file"
                  name="dokumenFoto"
                  accept="image/*"
                  required
                  onChange={handleChange}
                  className="block w-full text-sm text-blue-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {preview.dokumenFoto && (
                  <img
                    src={preview.dokumenFoto}
                    alt="Preview Foto"
                    className="mt-2 rounded shadow w-16 h-20 object-cover border"
                  />
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-lg shadow transition-all duration-150"
            >
              {loading ? "Mengirim..." : "Daftar Sekarang"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}