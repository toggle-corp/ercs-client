
import { use, } from "react";
import {
    Button,
    DropdownMenu,
    Heading,
    Image,
    ListView,
    NavigationTabList,
    PageContainer
} from "@ifrc-go/ui"

import Link from "#components/Link";
import NavLink from "#components/NavLink";
import UserContext from "#contexts/UserContext";
import Logo from "#resources/image/logo.png"

import styles from './styles.module.css';


const Navbar = () => {
    const { authenticated } = use(UserContext);

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
                        route="home"
                    >
                        <ListView spacing="sm">
                            <Image
                                src={Logo}
                                className={styles.icon}
                            />
                            <Heading
                                level={4}
                            >
                                ERCS EOC
                            </Heading>
                        </ListView>
                    </Link>
                    {!authenticated
                        ? (
                            <Button
                                name="login"
                                styleVariant="filled"
                            >

                                Login
                            </Button>
                        )
                        : (
                            <Button
                                name="login"
                            >
                                Logout
                            </Button>
                        )
                    }
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
                        route="home"
                    >
                        Home
                    </NavLink>
                    <NavLink
                        route="ourWork"
                    >
                        Our work
                    </NavLink>
                    <NavLink
                        route="preparedness"
                    >
                        Preparedness
                    </NavLink>
                    <NavLink
                        route="dataAndReport"
                    >
                        Data & Report
                    </NavLink>
                    <NavLink
                        route="capacityAndResources"
                    >
                        Capacity & Resources
                    </NavLink>
                    {authenticated &&
                        <DropdownMenu
                            label={"Team"}
                            labelStyleVariant="action"
                            persistent
                            labelSpacing="sm"
                        >
                            Cyrus Shrestha
                        </DropdownMenu>
                    }
                    <NavLink
                        route="galleries"
                    >
                        Galleries
                    </NavLink>
                </NavigationTabList>
            </PageContainer>
        </nav>
    )
}

export default Navbar