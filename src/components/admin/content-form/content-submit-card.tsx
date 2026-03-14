"use client";

import { Save, AlertCircle } from "lucide-react";

interface ContentSubmitCardProps {
  loading: boolean;
  error: string;
  isEdit: boolean;
}

export function ContentSubmitCard({ loading, error, isEdit }: ContentSubmitCardProps) {
  return (
    <div className="space-y-3">
      {/* Error alert */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5">
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Menyimpan...
          </>
        ) : (
          <>
            <Save size={16} />
            {isEdit ? "Simpan Perubahan" : "Simpan ke Database"}
          </>
        )}
      </button>
    </div>
  );
}
