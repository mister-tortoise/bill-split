import * as React from 'react';

import type { DiscountMode } from '@/types';
import { cn, toNumberString, toPriceNumberString } from '@/utils';

type DiscountSectionProps = {
    discountValue: string;
    discountMode: DiscountMode;
    onChangeDiscountValue: (value: string) => void;
    onChangeDiscountMode: (mode: DiscountMode) => void;
};

const DISCOUNT_MODES: {
    value: DiscountMode;
    label: string;
}[] = [
    { value: 'percent', label: 'Giảm giá (%)' },
    { value: 'amount', label: 'Số tiền giảm (VNĐ)' },
    { value: 'final', label: 'Tổng tiền sau giảm (VNĐ)' }
];

const DiscountSection: React.FC<DiscountSectionProps> = (props) => {
    const { discountMode, discountValue, onChangeDiscountMode, onChangeDiscountValue } = props;

    return (
        <div className='space-y-3'>
            <p className='text-foreground/60 text-sm'>Chọn loại giảm giá và nhập giá trị tương ứng.</p>
            <div className={'flex space-x-3'}>
                {DISCOUNT_MODES.map((mode) => (
                    <button
                        key={mode.value}
                        disabled={mode.value === discountMode}
                        className={cn(
                            'flex-1 rounded-md border px-4 py-2 text-center text-sm font-medium',
                            mode.value === discountMode
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-background text-foreground hover:border-primary hover:bg-primary/5 hover:text-primary'
                        )}
                        onClick={() => onChangeDiscountMode(mode.value)}>
                        {mode.label}
                    </button>
                ))}
            </div>
            <div>
                <div className={'space-y-1'}>
                    <label htmlFor={`discount-value`} className='text-muted-foreground block text-xs font-medium'>
                        {DISCOUNT_MODES.map((mode) => (mode.value === discountMode ? mode.label : null))}
                    </label>
                    <input
                        type='text'
                        id={`discount-value`}
                        placeholder={discountMode === 'percent' ? 'Nhập %' : 'Nhập số tiền'}
                        value={
                            discountMode === 'percent'
                                ? toNumberString(toPriceNumberString(String(discountValue)))
                                : toPriceNumberString(String(discountValue))
                        }
                        onChange={(e) => onChangeDiscountValue(e.target.value)}
                        className='bg-background text-foreground placeholder-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none'
                    />
                </div>
            </div>
        </div>
    );
};

export default DiscountSection;
