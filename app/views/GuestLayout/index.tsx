import {
    Navigate,
    Outlet,
} from 'react-router';

import useAuth from '#hooks/useAuth';

function GuestLayout() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }
    return (
        <Outlet />
    );
}

export default GuestLayout;
