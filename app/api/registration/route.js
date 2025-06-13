import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Ambil data utama
    const nama = formData.get("nama");
    const nisn = formData.get("nisn");
    const email = formData.get("email");
    const alamat = formData.get("alamat");
    const asalSekolah = formData.get("asalSekolah");

    // Ambil nama file dokumen (jika ada)
    const dokumenKK = formData.get("dokumenKK")?.name || "";
    const dokumenIjazah = formData.get("dokumenIjazah")?.name || "";
    const dokumenSKHUN = formData.get("dokumenSKHUN")?.name || "";
    const dokumenFoto = formData.get("dokumenFoto")?.name || "";

    // Simpan ke Firestore dengan status awal
    await addDoc(collection(db, "registrations"), {
      nama,
      nisn,
      email,
      alamat,
      asalSekolah,
      dokumenKK,
      dokumenIjazah,
      dokumenSKHUN,
      dokumenFoto,
      status: "Menunggu Verifikasi", // <--- status pendaftaran
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}