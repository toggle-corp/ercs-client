import { Outlet } from "react-router";

function PrivateLayout() {
    return (
        <>
            <Outlet />
        </>
    );
}

export default PrivateLayout;
