import * as React from "react";
import { useState } from "react";

import AppBar from "./menus/AppBar";
import AppDrawer from "./menus/AppDrawer";
import AppMenu from "./menus/AppMenu";

interface IHeaderNavigationProps {
    isLoggedIn: boolean;
}

const HeaderNavigation = (props: IHeaderNavigationProps) => {
    const { isLoggedIn } = props;
    const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
    const [menuVisible, setMenuVisible] = useState<boolean>(false);

    return (
        <>
            <AppBar
                isLoggedIn={isLoggedIn}
                toggleAppDrawerVisibility={setDrawerVisible.bind(
                    this,
                    (v: boolean) => !v
                )}
                toggleAppMenuVisibility={setMenuVisible.bind(
                    this,
                    (v: boolean) => !v
                )}
            />
            <AppDrawer
                open={drawerVisible}
                toggleAppDrawerVisibility={setDrawerVisible.bind(
                    this,
                    (v: boolean) => !v
                )}
            />
            <AppMenu
                isLoggedIn={isLoggedIn}
                open={menuVisible}
                toggleAppMenuVisibility={setMenuVisible.bind(
                    this,
                    (v: boolean) => !v
                )}
            />
        </>
    );
};

export default HeaderNavigation;
