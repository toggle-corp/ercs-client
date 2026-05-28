import { use } from 'react';
import { useNavigate } from 'react-router';
import {
    Button,
    Heading,
    Image,
    ListView,
    NavigationTabList,
    PageContainer,
} from '@ifrc-go/ui';
import { gql } from 'urql';

import Link from '#components/Link';
import NavLink from '#components/NavLink';
import UserContext from '#contexts/UserContext';
import { useLogoutMutation } from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';
import useAuth from '#hooks/useAuth';
import Logo from '#resources/image/logo.png';

import styles from './styles.module.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LOGOUT_MUTATION = gql`
    mutation Logout {
        logout
    }
`;

function Navbar() {
    const [{ fetching: logoutPending }, triggerLogout] = useLogoutMutation();
    const { removeUserAuth } = use(UserContext);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const alert = useAlert();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = async () => {
        await triggerLogout({});
        removeUserAuth();
        alert.show('Logout successful!', { variant: 'success' });
    };
    return (
        <nav className={styles.navbar}>
            <PageContainer
                className={styles.top}
                contentClassName={styles.topContent}
            >
                <ListView
                    withSpaceBetweenContents
                >
                    <Link
                        to="home"
                    >
                        <ListView spacing="sm">
                            <Image
                                src={Logo}
                                className={styles.icon}
                                withoutBackground
                            />
                            <Heading
                                level={4}
                            >
                                ERCS EOC
                            </Heading>
                        </ListView>
                    </Link>
                    {!isAuthenticated
                        ? (
                            <Button
                                name="login"
                                styleVariant="filled"
                                onClick={handleLogin}
                            >
                                Login
                            </Button>
                        )
                        : (
                            <Button
                                name="logout"
                                onClick={handleLogout}
                                disabled={logoutPending}
                            >
                                Logout
                            </Button>
                        )}
                </ListView>
            </PageContainer>
            <PageContainer
                contentClassName={styles.bottom}
            >
                <NavigationTabList
                    styleVariant="nav"
                    spacing="2xl"
                >
                    <NavLink
                        to="home"
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="ourWork"
                        navigateTo="emergencyResponse"
                    >
                        Our work
                    </NavLink>
                    <NavLink
                        to="preparedness"
                        navigateTo="emergencyAlert"
                    >
                        Preparedness
                    </NavLink>
                    <NavLink
                        to="dataAndReport"
                    >
                        Data & Report
                    </NavLink>
                    <NavLink
                        to="capacityAndResources"
                    >
                        Capacity & Resources
                    </NavLink>
                    {isAuthenticated && (
                        <>
                            <NavLink
                                to="teamList"
                            >
                                Teams
                            </NavLink>
                            <NavLink
                                to="galleries"
                            >
                                Galleries
                            </NavLink>
                        </>
                    )}

                </NavigationTabList>
            </PageContainer>
        </nav>
    );
}

export default Navbar;
