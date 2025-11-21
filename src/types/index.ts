type Participant = {
    id: string;
    name: string;
    amount: number;
};

type PaymentInfo = {
    id: string;
    payment: number;
};

type DiscountMode = 'percent' | 'amount' | 'final';

export type { Participant, DiscountMode, PaymentInfo };
