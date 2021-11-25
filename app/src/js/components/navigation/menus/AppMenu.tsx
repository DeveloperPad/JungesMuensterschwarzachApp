import * as React from 'react';

import { Menu, MenuItem } from '@material-ui/core';

import { Dict } from '../../../constants/dict';
import { AppUrls } from '../../../constants/specific-urls';
import { ConfigService } from '../../../services/ConfigService';
import { useNavigate } from 'react-router';

type IAppMenuProps = {
    isLoggedIn: boolean,
    open: boolean,
    toggleAppMenuVisibility: () => void
};

const AppMenu = (props: IAppMenuProps) => {
    const {isLoggedIn, open, toggleAppMenuVisibility} = props;
    const navigate = useNavigate();

    const getAnchorElement = (): (HTMLElement | undefined) => {
        return ((document.querySelector(".jma-app-menu-anchor") || undefined) as HTMLElement);
    };
    const forwardContact = (): void => {
        window.location.href = ConfigService.getConfig().BaseUrls.CONTACT_LINK;
    };

    return (
        <Menu
            anchorEl={getAnchorElement()}
            anchorOrigin={{
                horizontal: "right",
                vertical: "top"
            }}
            transformOrigin={{
                horizontal: "right",
                vertical: "top"
            }}
            onBackdropClick={toggleAppMenuVisibility}
            onClick={toggleAppMenuVisibility}
            onClose={toggleAppMenuVisibility}
            open={open}>
            <MenuItem
                button={true}
                onClick={forwardContact}>
                <span>{Dict.navigation_app_contact}</span>
            </MenuItem>
            <MenuItem
                button={true}
                onClick={navigate.bind(this, AppUrls.HELP)}>
                <span>{Dict.navigation_app_help}</span>
            </MenuItem>
            {
                isLoggedIn &&
                <MenuItem
                    button={true}
                    onClick={navigate.bind(this, AppUrls.LOGOUT)}>
                    <span>{Dict.account_sign_out}</span>
                </MenuItem>
            }
        </Menu>
    );
};

export default AppMenu;
