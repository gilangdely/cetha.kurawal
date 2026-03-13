import React, { useState, useRef } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageCropDialogProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    onConfirm: (blob: Blob) => void;
}

export const ImageCropDialog: React.FC<ImageCropDialogProps> = ({ isOpen, onClose, imageSrc, onConfirm }) => {
    const [crop, setCrop] = useState<Crop>({
        unit: "%",
        width: 90,
        height: 90,
        x: 5,
        y: 5,
    });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("No 2d context");
        }

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        console.error("Canvas is empty");
                        reject(new Error("Canvas is empty"));
                        return;
                    }
                    resolve(blob);
                },
                "image/jpeg",
                0.9
            );
        });
    };

    const handleConfirm = async () => {
        if (imgRef.current && completedCrop) {
            try {
                const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
                onConfirm(croppedBlob);
            } catch (e) {
                console.error("Gagal melakukan crop gambar", e);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto w-[95vw]">
                <DialogHeader>
                    <DialogTitle>Sesuaikan Foto</DialogTitle>
                    <DialogDescription>Geser letak area aktif foto profilmu di kotak bingkai di bawah.</DialogDescription>
                </DialogHeader>
                <div className="flex justify-center p-2 bg-gray-50 rounded-md border min-h-[50vh]">
                    {imageSrc && (
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={1}
                            circularCrop={false}
                            className="max-h-[60vh] max-w-full"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                ref={imgRef}
                                src={imageSrc}
                                alt="Source"
                                className="max-h-[60vh] w-auto h-auto object-contain"
                                onLoad={(e) => {
                                    const { width, height } = e.currentTarget;
                                    const minDim = Math.min(width, height);
                                    const cropWidth = (minDim / width) * 100;
                                    const cropHeight = (minDim / height) * 100;
                                    const x = (100 - cropWidth) / 2;
                                    const y = (100 - cropHeight) / 2;

                                    const initialCrop: Crop = {
                                        unit: "%",
                                        width: cropWidth,
                                        height: cropHeight,
                                        x,
                                        y,
                                    };
                                    setCrop(initialCrop);
                                }}
                            />
                        </ReactCrop>
                    )}
                </div>
                <DialogFooter className="mt-4 gap-2 flex-col sm:flex-row">
                    <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Batal</Button>
                    <Button onClick={handleConfirm} disabled={!completedCrop?.width || !completedCrop?.height} className="w-full sm:w-auto bg-primaryBlue text-white hover:bg-blue-700">
                        Gunakan Foto
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
