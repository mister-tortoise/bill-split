import * as React from 'react';
import { useMemo } from 'react';

import type { DiscountMode } from '@/types';
import { toPriceNumberString } from '@/utils';

type SummarySectionProps = {
    totalOriginal: number;
    discountValue: string;
    totalAfterDiscount: number;
    discountMode: DiscountMode;
};

const SummarySection: React.FC<SummarySectionProps> = (props) => {
    const { totalOriginal, totalAfterDiscount, discountValue, discountMode } = props;

    const getDiscountInfo = useMemo(() => {
        if (discountMode === 'percent') {
            return `${discountValue}%`;
        } else if (discountMode === 'amount') {
            return `${toPriceNumberString(String(discountValue))} VND`;
        } else {
            return `${toPriceNumberString(String(totalOriginal - totalAfterDiscount))} VND`;
        }
    }, [discountMode, discountValue]);

    return (
        <section className={'grid gap-4 md:grid-cols-2'}>
            <div className='border-border bg-card rounded-lg border p-4 shadow-sm'>
                <p className='text-muted-foreground mb-1 text-sm font-medium'>Tổng Tiền Ban Đầu</p>
                <p className='text-card-foreground text-2xl font-bold'>{toPriceNumberString(String(totalOriginal))}</p>
            </div>

            {!!discountValue && discountValue !== '0' && (
                <div className='border-destructive bg-destructive/5 rounded-lg border p-4 shadow-sm'>
                    <p className='text-destructive mb-1 text-sm font-medium'>Giảm Giá</p>
                    <p className='text-destructive text-2xl font-bold'>{getDiscountInfo}</p>
                </div>
            )}

            <div className='border-primary bg-primary/10 rounded-lg border p-4 shadow-sm'>
                <p className='text-primary mb-1 text-sm font-medium'>Tổng Tiền Sau Giảm</p>
                <p className='text-primary text-2xl font-bold'>
                    {toPriceNumberString(String(totalAfterDiscount.toFixed(0)))}
                </p>
            </div>
        </section>
    );
};

export default SummarySection;
