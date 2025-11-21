import { Route, BrowserRouter as Router, Routes } from 'react-router';

import { ROUTES } from '@/routes';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                {ROUTES.map((route, idx) => (
                    <Route key={idx} path={route.path} element={<route.component />} />
                ))}
            </Routes>
        </Router>
    );
}

export default App;
