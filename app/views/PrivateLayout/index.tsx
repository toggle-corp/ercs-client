import {
    Navigate,
    Outlet,
} from 'react-router';

import PreloadMessage from '#components/PreloadMessage';
import useAuth from '#hooks/useAuth';

function PrivateLayout() {
    const { isAuthenticated, isAuthLoading } = useAuth();

    if (isAuthLoading) {
        return <PreloadMessage>Checking user session...</PreloadMessage>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }
    return (
        <Outlet />
    );
}

export default PrivateLayout;
