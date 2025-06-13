"use client";
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

const requirements = [
  "Membawa bukti pengumuman kelulusan/diterima (cetak atau digital)",
  "Fotokopi Ijazah terakhir (1 lembar)",
  "Fotokopi SKHUN (1 lembar)",
  "Fotokopi Kartu Keluarga (1 lembar)",
  "Pas foto berwarna 3x4 (2 lembar, background merah/biru)",
  "Mengisi dan menandatangani formulir daftar ulang yang disediakan panitia",
  "Membawa dokumen asli untuk verifikasi",
  "Melunasi biaya administrasi daftar ulang (jika ada)",
];

export default function RequirementsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white/90 rounded-3xl shadow-2xl p-10 backdrop-blur-md border-t-8 border-blue-500">
        <div className="flex items-center gap-3 mb-8">
          <ClipboardDocumentCheckIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-800">Persyaratan Daftar Ulang</h1>
        </div>
        <ol className="list-decimal pl-6 space-y-4 text-blue-900 text-base">
          {requirements.map((item, idx) => (
            <li key={idx} className="bg-blue-50 rounded-xl px-4 py-3 shadow-sm border-l-4 border-blue-400 flex items-start gap-2">
              <span className="mt-1 text-blue-400">{idx + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center text-blue-700 text-sm">
          <b>Catatan:</b> Semua dokumen harus asli atau fotokopi yang jelas. Jika ada pertanyaan, silakan hubungi panitia PPDB.
        </div>
      </div>
    </div>
  );
}
