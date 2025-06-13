"use client";
import { useEffect, useState, useRef } from "react";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/app/contexts/AuthContext";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    alamat: "",
    noHp: "",
    tanggalLahir: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (authLoading) return;
    if (!user?.email) {
      setLoading(false);
      return;
    }
    async function fetchProfile() {
      setLoading(true);
      const q = query(
        collection(db, "users"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setProfile({ ...docSnap.data(), id: docSnap.id });
        setPhotoPreview(docSnap.data().photoURL || null);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [user, authLoading]);

  // Set data awal saat profile sudah ada
  useEffect(() => {
    if (profile) {
      setEditData({
        alamat: profile.alamat || "",
        noHp: profile.noHp || "",
        tanggalLahir: profile.tanggalLahir || "",
      });
    }
  }, [profile]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSavePhoto = async () => {
    if (!photoFile || !profile) return;
    setSaving(true);

    // Simpan foto sebagai base64 ke Firestore (bukan best practice untuk file besar, tapi sesuai permintaan)
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      const userRef = doc(db, "users", profile.id);
      await updateDoc(userRef, { photoURL: base64 });
      setProfile((prev) => ({ ...prev, photoURL: base64 }));
      setPhotoFile(null);
      setSaving(false);
    };
    reader.readAsDataURL(photoFile);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setEditLoading(true);
    try {
      const userRef = doc(db, "users", profile.id);
      await updateDoc(userRef, {
        alamat: editData.alamat,
        noHp: editData.noHp,
        tanggalLahir: editData.tanggalLahir,
      });
      setProfile((prev) => ({ ...prev, ...editData }));
    } catch (err) {
      alert("Gagal menyimpan data tambahan");
    }
    setEditLoading(false);
  };

  if (authLoading || loading)
    return <div className="p-8 text-center">Memuat data profil...</div>;
  if (!user?.email)
    return (
      <div className="p-8 text-center text-red-500">
        Anda belum login.<br />
        <a
          href="/login"
          className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Login Sekarang
        </a>
      </div>
    );
  if (!profile)
    return (
      <div className="p-8 text-center text-red-500">
        Data profil tidak ditemukan.
      </div>
    );

  return (
    <div className="max-w-xl mx-auto mt-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-2xl p-8 border border-blue-100">
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={
              photoPreview ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(profile.fullName || profile.nama || "User")
            }
            alt="Foto Profil"
            className="w-32 h-32 rounded-full border-4 border-blue-300 shadow-lg object-cover bg-white"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-2 right-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full p-2 shadow transition"
            title="Ganti Foto"
          >
            <svg width={20} height={20} fill="none" viewBox="0 0 24 24">
              <path
                d="M15.232 5.232a3 3 0 1 1 4.243 4.243L7.5 21H3v-4.5l12.232-12.268Z"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
        {photoFile && (
          <button
            onClick={handleSavePhoto}
            disabled={saving}
            className="mt-3 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow transition-all duration-150"
          >
            {saving ? "Menyimpan..." : "Simpan Foto"}
          </button>
        )}
      </div>
      <h1 className="text-2xl font-bold text-blue-700 mb-4 text-center">
        Profil Saya
      </h1>
      <div className="space-y-3 text-blue-900">
        <div className="flex items-center">
          <span className="font-semibold w-36">Nama Lengkap:</span>
          <span>{profile.fullName || profile.nama}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold w-36">Email:</span>
          <span>{profile.email}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold w-36">Tanggal Daftar:</span>
          <span>
            {profile.createdAt?.toDate
              ? profile.createdAt.toDate().toLocaleString()
              : "-"}
          </span>
        </div>
      </div>

      {/* Form Edit Data Tambahan */}
      <form className="mt-8 space-y-4" onSubmit={handleSaveEdit}>
        <div>
          <label className="block text-sm font-medium text-blue-700">Alamat</label>
          <input
            type="text"
            name="alamat"
            className="mt-1 block w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={editData.alamat}
            onChange={handleEditChange}
            placeholder="Alamat lengkap"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-700">Nomor HP</label>
          <input
            type="text"
            name="noHp"
            className="mt-1 block w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={editData.noHp}
            onChange={handleEditChange}
            placeholder="08xxxxxxxxxx"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-700">Tanggal Lahir</label>
          <input
            type="date"
            name="tanggalLahir"
            className="mt-1 block w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={editData.tanggalLahir}
            onChange={handleEditChange}
          />
        </div>
        <button
          type="submit"
          disabled={editLoading}
          className="w-full mt-2 py-2 px-4 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
        >
          {editLoading ? "Menyimpan..." : "Simpan Data"}
        </button>
      </form>
    </div>
  );
}