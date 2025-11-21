import React, { useRef, useState } from 'react';

type QRUploaderSectionProps = {
    onUpload: (imageData: string) => void;
};

const QRUploaderSection: React.FC<QRUploaderSectionProps> = ({ onUpload }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageData = event.target?.result as string;
            setPreview(imageData);
            onUpload(imageData);
        };
        reader.readAsDataURL(file);
    }

    function triggerFileInput() {
        fileInputRef.current?.click();
    }

    return (
        <section className='border-border bg-card rounded-lg border p-6 shadow-sm'>
            <h2 className='text-card-foreground mb-4 text-xl font-semibold'>Tải Mã QR Ngân Hàng</h2>

            <div className='grid gap-4 md:grid-cols-2'>
                {/* Upload Button */}
                <div className='flex flex-col gap-3'>
                    <button
                        onClick={triggerFileInput}
                        className='border-primary bg-primary/5 text-primary hover:bg-primary/10 rounded-lg border-2 border-dashed px-6 py-8 text-center font-medium transition-colors'>
                        📸 Chọn ảnh QR
                    </button>

                    <input
                        type='file'
                        accept='image/*'
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className='hidden'
                    />

                    <p className='text-muted-foreground text-xs'>Hoặc kéo thả ảnh vào đây</p>
                </div>

                {/* Preview */}
                {preview && (
                    <div className='flex flex-col items-center gap-2'>
                        <p className='text-muted-foreground text-sm font-medium'>Ảnh QR</p>
                        <img
                            src={preview}
                            alt='QR Code'
                            className='border-border h-32 w-32 rounded-lg border object-cover'
                        />
                    </div>
                )}
            </div>
        </section>
    );
};
export default QRUploaderSection;
