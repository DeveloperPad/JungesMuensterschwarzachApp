import * as React from 'react';

import { Menu, MenuItem } from '@mui/material';

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
    const navigate = useNavigate();
    const {isLoggedIn, open, toggleAppMenuVisibility} = props;

    const getAnchorElement = React.useCallback((): (HTMLElement | undefined) => {
        return ((document.querySelector(".jma-app-menu-anchor") || undefined) as HTMLElement);
    }, []);
    const forwardContact = React.useCallback((): void => {
        window.location.href = ConfigService.getConfig().BaseUrls.CONTACT_LINK;
    }, []);

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
            onClick={toggleAppMenuVisibility}
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
