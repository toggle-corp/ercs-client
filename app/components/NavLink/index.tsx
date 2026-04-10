import {
    NavLink as RouterNavLink,
    type NavLinkProps,
} from 'react-router';
import {
    ButtonLayout,
    type ButtonLayoutProps
} from '@ifrc-go/ui'
import { _cs } from '@togglecorp/fujs';

import type { RouteKeys } from '#root/config/routes';
import useRouteMatching, { type Attrs } from '#root/hooks/useRouteMatching';

import styles from './styles.module.css';

export type Props = Omit<NavLinkProps, 'to'> & ButtonLayoutProps & {
    route: RouteKeys;
    attrs?: Attrs;
    activeClassName?: string;
};

function NavLink(props: Props) {
    const {
        route,
        attrs,
        className,
        before,
        children,
        after,
        childrenContainerClassName,
        colorVariant = 'text',
        styleVariant = 'action',
        withoutPadding,
        spacing,
        activeClassName,
        ...otherProps
    } = props;

    const routeData = useRouteMatching(route, attrs);
    if (!routeData) {
        return null;
    }

    return (
        <RouterNavLink
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...otherProps}
            to={routeData.to}
            className={({ isActive }) => _cs(
                styles.smartNavLink,
                isActive && styles.active,
                isActive && activeClassName,
            )}
        >
            <ButtonLayout
                className={_cs(
                    styles.buttonLayout,
                    className,
                )}
                before={before}
                after={after}
                childrenContainerClassName={childrenContainerClassName}
                spacing={spacing}
                colorVariant={colorVariant}
                styleVariant={styleVariant}
                withoutPadding={withoutPadding}
            >
                {children}
            </ButtonLayout>
        </RouterNavLink>
    );
}

export default NavLink;
