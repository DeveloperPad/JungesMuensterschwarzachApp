import * as React from "react";
import { useState } from "react";

import AppBar from "./menus/AppBar";
import AppDrawer from "./menus/AppDrawer";
import AppMenu from "./menus/AppMenu";

interface IHeaderNavigationProps {
    isLoggedIn: boolean;
    rerenderApp: () => void;
}

const HeaderNavigation = (props: IHeaderNavigationProps) => {
    const { isLoggedIn, rerenderApp } = props;
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <>
            <AppBar
                rerenderApp={rerenderApp}
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
