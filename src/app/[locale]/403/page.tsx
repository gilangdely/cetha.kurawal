import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function ForbiddenPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-4">
                    <AlertCircle className="w-12 h-12 text-red-600" />
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">403</h1>
                <h2 className="text-2xl font-semibold text-gray-800">Akses Ditolak</h2>

                <p className="text-gray-600 font-medium pb-4 leading-relaxed">
                    Maaf, halaman yang Anda coba akses memerlukan hak istimewa tipe "Admin".
                </p>

                <Link
                    href="/id/dashboard"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                    Kembali ke Dashboard
                </Link>
            </div>
        </div>
    );
}
