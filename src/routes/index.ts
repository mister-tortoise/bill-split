import * as React from 'react';

import HomePage from '@/pages/HomePage.tsx';

type Route = {
    path: string;
    component: React.ComponentType;
};

export const ROUTES: Array<Route> = [
    {
        path: '/',
        component: HomePage
    }
];
