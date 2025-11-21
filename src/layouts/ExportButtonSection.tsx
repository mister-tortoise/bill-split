import { useCallback, useState } from 'react';
import * as React from 'react';

import type { Participant, PaymentInfo } from '@/types';
import { toPriceNumberString } from '@/utils';

type ExportButtonSectionProps = {
    qrImage: string | null;
    totalOriginal: number;
    totalAfterDiscount: number;
    participants: Participant[];
    participantPayments: PaymentInfo[];
};

const ExportButtonSection: React.FC<ExportButtonSectionProps> = ({
    qrImage,
    participants,
    totalOriginal,
    totalAfterDiscount,
    participantPayments
}) => {
    const [isExporting, setIsExporting] = useState(false);

    const formatCurrency = useCallback((amount: number): string => {
        return toPriceNumberString(String(amount));
    }, []);

    const getPayment = useCallback(
        (id: string): number => {
            return participantPayments.find((p) => p.id === id)?.payment || 0;
        },
        [participantPayments]
    );

    const createCanvasImage = useCallback(async (): Promise<Blob> => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        canvas.width = 600;
        canvas.height = 150 + participants.length * 40 + (qrImage ? 250 : 0);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        let yPos = 40;

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('💰 Danh Sách Chia Chi Phí', canvas.width / 2, yPos);

        yPos += 35;

        ctx.font = '14px Arial';
        ctx.fillStyle = '#666666';
        const totalText = `Chi Phí: ${formatCurrency(totalOriginal)} → ${formatCurrency(totalAfterDiscount)}`;
        ctx.fillText(totalText, canvas.width / 2, yPos);

        yPos += 35;

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Tên', 30, yPos);
        ctx.textAlign = 'right';
        ctx.fillText('Chi Phí Gốc', canvas.width - 150, yPos);
        ctx.fillText('Thanh Toán', canvas.width - 30, yPos);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        yPos += 8;
        ctx.beginPath();
        ctx.moveTo(30, yPos);
        ctx.lineTo(canvas.width - 30, yPos);
        ctx.stroke();

        yPos += 25;

        ctx.font = '13px Arial';
        ctx.fillStyle = '#000000';

        participants.forEach((p) => {
            const payment = getPayment(p.id);

            ctx.textAlign = 'left';
            ctx.fillText(p.name, 30, yPos);
            ctx.textAlign = 'right';
            ctx.fillText(formatCurrency(p.amount), canvas.width - 150, yPos);
            ctx.font = 'bold 13px Arial';
            ctx.fillText(formatCurrency(payment), canvas.width - 30, yPos);
            ctx.font = '13px Arial';

            yPos += 40;
        });

        yPos += 10;
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#16a34a';
        ctx.textAlign = 'center';
        ctx.fillText(`Tổng: ${formatCurrency(totalAfterDiscount)}`, canvas.width / 2, yPos);

        if (qrImage) {
            yPos += 40;
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('Mã QR Chuyển Khoản', canvas.width / 2, yPos);

            try {
                const img = new Image();
                img.crossOrigin = 'anonymous';

                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        const qrSize = 160;
                        const qrX = (canvas.width - qrSize) / 2;
                        const qrY = yPos + 20;
                        ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
                        resolve(null);
                    };
                    img.onerror = reject;
                    img.src = qrImage;
                });
            } catch (err) {
                console.log('[React] QR load error, ignoring');
            }
        }

        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob || new Blob()), 'image/png');
        });
    }, [participants, qrImage, totalAfterDiscount, totalOriginal, participantPayments, getPayment, formatCurrency]);

    const exportImage = useCallback(async () => {
        try {
            setIsExporting(true);
            const blob = await createCanvasImage();

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `chia-chi-phi-${Date.now()}.png`;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (err) {
            console.error('[React] Export error:', err);
            alert('Lỗi khi tải xuống. Vui lòng thử lại!');
        } finally {
            setIsExporting(false);
        }
    }, [createCanvasImage]);

    const copyToClipboard = useCallback(async () => {
        try {
            setIsExporting(true);
            const blob = await createCanvasImage();

            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);

            alert('Đã copy ảnh vào clipboard!');
        } catch (err) {
            console.error('[React] Copy error:', err);
            alert('Lỗi khi copy. Vui lòng thử lại!');
        } finally {
            setIsExporting(false);
        }
    }, [createCanvasImage]);

    return (
        <div className='grid gap-4 md:grid-cols-2'>
            <button
                onClick={exportImage}
                disabled={isExporting}
                className='bg-primary text-primary-foreground flex-1 rounded-lg px-6 py-3 font-semibold transition-opacity hover:opacity-90 disabled:opacity-50'>
                {isExporting ? '⏳ Đang xử lý...' : '📥 Tải Xuống'}
            </button>

            <button
                disabled={isExporting}
                onClick={copyToClipboard}
                className='bg-accent text-accent-foreground flex-1 rounded-lg px-6 py-3 font-semibold transition-opacity hover:opacity-90 disabled:opacity-50'>
                {isExporting ? '⏳ Đang xử lý...' : '📋 Copy Ảnh'}
            </button>
        </div>
    );
};

export default ExportButtonSection;
