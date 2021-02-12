import * as React from 'react';

import AppBar from './menus/AppBar';
import AppDrawer from './menus/AppDrawer';
import AppMenu from './menus/AppMenu';

interface IHeaderNavigationProps {
    isLoggedIn: boolean;
    rerenderApp: () => void;
}

interface IHeaderNavigationState {
    drawerVisibility: boolean;
    menuVisibility: boolean;
}

export default class HeaderNavigation extends React.Component<IHeaderNavigationProps, IHeaderNavigationState> {

    public state: IHeaderNavigationState = {
        drawerVisibility: false,
        menuVisibility: false
    }

    public render(): React.ReactNode {
        return (
            <>
                <AppBar
                    rerenderApp={this.props.rerenderApp}
                    toggleAppDrawerVisibility={this.toggleAppDrawerVisibility}
                    toggleAppMenuVisibility={this.toggleAppMenuVisibility} />
                <AppDrawer
                    open={this.state.drawerVisibility}
                    toggleAppDrawerVisibility={this.toggleAppDrawerVisibility} />
                <AppMenu
                    isLoggedIn={this.props.isLoggedIn}
                    open={this.state.menuVisibility}
                    toggleAppMenuVisibility={this.toggleAppMenuVisibility} />
            </>
        );
    }

    public toggleAppDrawerVisibility = (): void => {
        this.setState(prevState => ({
            drawerVisibility: !prevState.drawerVisibility
        }));
    }

    public toggleAppMenuVisibility = (): void => {
        this.setState(prevState => ({
            menuVisibility: !prevState.menuVisibility
        }));
    }

}