import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

export const toNumberString = (value: string): string => {
    return value?.replace(/\D/g, '');
};

export const toPriceNumberString = (value: string): string => {
    const rawNumber = +toNumberString(value);
    if (isNaN(rawNumber)) return '0';

    return Intl.NumberFormat('vi-VN').format(rawNumber);
};
