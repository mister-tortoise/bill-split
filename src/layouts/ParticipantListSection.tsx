import * as React from 'react';

import type { Participant, PaymentInfo } from '@/types';
import { toPriceNumberString } from '@/utils';

import { Plus, Trash2 } from 'lucide-react';

type ParticipantListSectionProps = {
    onAdd: () => void;
    participants: Participant[];
    onRemove: (id: string) => void;
    participantPayments: PaymentInfo[];
    onUpdate: (id: string, field: 'name' | 'amount', value: string) => void;
};

const ParticipantListSection: React.FC<ParticipantListSectionProps> = (props) => {
    const { onAdd, participantPayments, participants, onRemove, onUpdate } = props;

    return (
        <div className={'space-y-3'}>
            {participants.map((participant, index) => {
                const paymentInfo = participantPayments.find((p) => p.id === participant.id);

                return (
                    <div key={participant.id} className={'space-y-2 rounded-md border p-4'}>
                        <div className={'flex items-center justify-between space-x-3'}>
                            <div className={'grid flex-1 grid-cols-1 gap-2 md:grid-cols-2'}>
                                <div className={'space-y-1'}>
                                    <label
                                        htmlFor={`name-${participant.id}`}
                                        className='text-muted-foreground block text-xs font-medium'>
                                        Tên Người Tham Gia {index + 1}
                                    </label>
                                    <input
                                        type='text'
                                        value={participant.name}
                                        id={`name-${participant.id}`}
                                        placeholder='Tên người tham gia'
                                        onChange={(e) => onUpdate(participant.id, 'name', e.target.value)}
                                        className='bg-background text-foreground placeholder-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none'
                                    />
                                </div>
                                <div className={'space-y-1'}>
                                    <label
                                        htmlFor={`amount-${participant.id}`}
                                        className='text-muted-foreground block text-xs font-medium'>
                                        Chi phí (VNĐ)
                                    </label>
                                    <input
                                        type='text'
                                        placeholder='0.00'
                                        id={`amount-${participant.id}`}
                                        value={toPriceNumberString(String(participant.amount))}
                                        onChange={(e) => onUpdate(participant.id, 'amount', e.target.value)}
                                        className='bg-background text-foreground placeholder-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none'
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => onRemove(participant.id)}
                                className={
                                    'bg-destructive hover:bg-destructive/90 rounded-md px-3 py-1 text-white focus:ring-2 focus:ring-red-400 focus:outline-none'
                                }>
                                <Trash2 className={'h-5 w-5'} />
                            </button>
                        </div>
                        {paymentInfo && (
                            <div className={'flex justify-end text-sm font-semibold whitespace-nowrap'}>
                                <p>
                                    {`Số tiền phải trả: `}
                                    <span className={'text-primary'}>
                                        {toPriceNumberString(String(paymentInfo.payment))} VNĐ
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}

            <button
                onClick={onAdd}
                aria-label={'Add Participant'}
                className='border-primary bg-primary/5 text-primary hover:bg-primary/10 w-full rounded-md border-2 border-dashed px-4 py-2 font-medium transition-colors md:py-3'>
                <div className={'flex-center space-x-2'}>
                    <Plus className={'h-5 w-5'} />
                    <span>Thêm Người</span>
                </div>
            </button>
        </div>
    );
};

export default ParticipantListSection;
