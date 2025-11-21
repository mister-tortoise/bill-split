import { useCallback, useMemo, useState } from 'react';

import {
    DiscountSection,
    ExportButtonSection,
    ParticipantListSection,
    QRUploaderSection,
    SummarySection
} from '@/layouts';
import type { DiscountMode, Participant } from '@/types';
import { toNumberString } from '@/utils';

const HomePage = () => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [discountMode, setDiscountMode] = useState<DiscountMode>('percent');
    const [discountValue, setDiscountValue] = useState<string>('0');
    const [qrImage, setQrImage] = useState<string | null>(null);

    // Calculate total original amount
    const totalOriginal = useMemo(() => {
        return participants.reduce((sum, participant) => {
            return sum + Number(participant.amount || 0);
        }, 0);
    }, [participants]);

    // Calculate total after discount
    const totalAfterDiscount = useMemo(() => {
        let discountAmount = 0;
        const discountNum = Number(toNumberString(discountValue)) || 0;

        if (discountMode === 'percent') {
            discountAmount = (totalOriginal * discountNum) / 100;
        } else if (discountMode === 'amount') {
            discountAmount = discountNum;
        } else if (discountMode === 'final') {
            return Math.max(0, discountNum);
        }

        return Math.max(0, totalOriginal - discountAmount);
    }, [totalOriginal, discountMode, discountValue]);

    // Calculate each participant's payment after discount
    const participantPayments = useMemo(() => {
        if (totalOriginal === 0 || participants.length === 0)
            return participants.map((p) => ({ id: p.id, payment: 0 }));

        return participants.map((participant) => {
            const amount = Number(participant.amount) || 0;
            const proportion = amount / totalOriginal;
            const payment = proportion * totalAfterDiscount;

            return { id: participant.id, payment: Math.round(payment) };
        });
    }, [participants, totalOriginal, totalAfterDiscount]);

    // Participant management functions
    const addParticipant = useCallback(() => {
        const newParticipant: Participant = {
            id: crypto.randomUUID(),
            name: `Người tham gia ${participants.length + 1}`,
            amount: 0
        };
        setParticipants((prev) => [...prev, newParticipant]);
    }, [participants]);

    const removeParticipant = useCallback((id: string) => {
        setParticipants((prev) => prev.filter((p) => p.id !== id));
    }, []);

    const updateParticipant = useCallback((id: string, field: 'name' | 'amount', value: string) => {
        setParticipants((prev) =>
            prev.map((p) => {
                if (p.id === id) {
                    return {
                        ...p,
                        [field]: field === 'amount' ? toNumberString(value) : value
                    };
                }
                return p;
            })
        );
    }, []);

    // Image upload handler (stub)
    const handleImageUpload = useCallback((imageData: string) => {
        setQrImage(imageData);
    }, []);

    // On mount, add a default participant
    useState(() => {
        if (participants.length === 0) {
            addParticipant();
        }
    });

    return (
        <main className={'container'}>
            <div className={'space-y-8 py-4'}>
                {/* Header Section */}
                <section className={'space-y-2'}>
                    <h1 className={'text-2xl font-bold md:text-4xl'}>💰BillSplit</h1>
                    <p className={'text-foreground/60 text-base md:text-lg'}>
                        Hóa đơn chia đều, tình bạn vẫn trọn vẹn.
                    </p>
                </section>

                {/* Features Section */}
                <div className={'space-y-6'}>
                    {/* Participants Section */}
                    <section className='bg-card space-y-2 rounded-lg border p-6 shadow-sm'>
                        <h2 className={'text-xl font-semibold'}>Người tham gia</h2>

                        {/* ParticipantListSection component would be placed here */}
                        <ParticipantListSection
                            onAdd={addParticipant}
                            participants={participants}
                            onRemove={removeParticipant}
                            onUpdate={updateParticipant}
                            participantPayments={participantPayments}
                        />
                    </section>

                    {/* Discount Section */}
                    <section className='bg-card space-y-2 rounded-lg border p-6 shadow-sm'>
                        <h2 className={'text-xl font-semibold'}>Giảm giá</h2>

                        {/* DiscountSection component would be placed here */}
                        <DiscountSection
                            discountMode={discountMode}
                            discountValue={discountValue}
                            onChangeDiscountMode={setDiscountMode}
                            onChangeDiscountValue={setDiscountValue}
                        />
                    </section>

                    {/* Summary Section */}
                    <SummarySection
                        discountMode={discountMode}
                        discountValue={discountValue}
                        totalOriginal={totalOriginal}
                        totalAfterDiscount={totalAfterDiscount}
                    />

                    {/* QR Code Upload Section */}
                    <QRUploaderSection onUpload={handleImageUpload} />

                    {/* QR Code Upload Section */}
                    <ExportButtonSection
                        qrImage={qrImage}
                        participants={participants}
                        totalOriginal={totalOriginal}
                        totalAfterDiscount={totalAfterDiscount}
                        participantPayments={participantPayments}
                    />
                </div>
            </div>
        </main>
    );
};

export default HomePage;
