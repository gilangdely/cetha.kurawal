"use client";

import { useState } from "react";
import { UploadCloud, X, FileImage, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadPaymentProofProps {
    onUploadComplete: (url: string) => void;
}

export function UploadPaymentProof({ onUploadComplete }: UploadPaymentProofProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // validate size (Max 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("Ukuran file maksimal 5MB.");
            return;
        }

        // validate type
        if (!["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(selectedFile.type)) {
            setError("Format file harus JPG, PNG, atau PDF.");
            return;
        }

        setError(null);
        setFile(selectedFile);

        // Preview IF image
        if (selectedFile.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            // Because there's no pre-configured storage yet (Cloudinary/Firebase Storage),
            // this is a mock upload returning a blob URL or base64.
            // In a real production setup, here we would upload to Cloudinary/S3
            // and return the secure URL.

            // Note: Since Firebase Admin is set up but no config for client Storage is visible,
            // we will simulate the upload delay then convert to base64 to store temporarily,
            // or return a mock URL.

            await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate network

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Url = reader.result as string;
                onUploadComplete(base64Url); // Send the string (which acts as URL for now)
                setIsUploading(false);
            };
            reader.readAsDataURL(file);

        } catch (err: any) {
            setError(err.message || "Gagal mengunggah file.");
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {!file ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition relative">
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="p-3 bg-blue-100 text-primaryBlue rounded-full">
                            <UploadCloud size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Klik untuk unggah atau seret file kesini</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF (Maks. 5MB)</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border rounded-xl p-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 overflow-hidden">
                            <div className="p-2 bg-blue-50 text-primaryBlue rounded-lg flex-shrink-0">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="h-10 w-10 object-cover rounded" />
                                ) : (
                                    <FileImage size={24} />
                                )}
                            </div>
                            <div className="truncate">
                                <p className="text-sm font-semibold text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={clearFile}
                            disabled={isUploading}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <Button
                            type="button"
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="w-full bg-primaryBlue hover:bg-blue-700 text-white"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 size={16} className="mr-2 animate-spin" /> Mengunggah...
                                </>
                            ) : (
                                "Gunakan File Ini"
                            )}
                        </Button>
                    </div>
                </div>
            )}

            {error && <p className="text-sm text-red-500 text-center font-medium">{error}</p>}
        </div>
    );
}
