import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Menu, MenuItem } from '@material-ui/core';

import { Dict } from '../../../constants/dict';
import { AppUrls } from '../../../constants/specific-urls';
import { ConfigService } from '../../../services/ConfigService';

type IAppMenuProps = RouteComponentProps<any, StaticContext> & {
    isLoggedIn: boolean,
    open: boolean,
    toggleAppMenuVisibility: () => void
};

class AppMenu extends React.Component<IAppMenuProps> {

    public render(): React.ReactNode {
        return (
            <Menu
                anchorEl={this.getAnchorElement()}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
                onBackdropClick={this.props.toggleAppMenuVisibility}
                onClick={this.props.toggleAppMenuVisibility}
                onClose={this.props.toggleAppMenuVisibility}
                open={this.props.open}>
                <MenuItem
                    button={true}
                    onClick={this.forwardContact}>
                    <span>{Dict.navigation_app_contact}</span>
                </MenuItem>
                <MenuItem
                    button={true}
                    onClick={this.forwardHelp}>
                    <span>{Dict.navigation_app_help}</span>
                </MenuItem>
                {
                    this.props.isLoggedIn &&
                    <MenuItem
                        button={true}
                        onClick={this.forwardLogout}>
                        <span>{Dict.account_sign_out}</span>
                    </MenuItem>
                }
            </Menu>
        );
    }

    private forwardContact = (): void => {
        window.location.href = ConfigService.getConfig().BaseUrls.CONTACT_LINK;
    }

    private forwardHelp = (): void => {
        this.props.history.push(
            AppUrls.HELP
        );
    }

    private forwardLogout = (): void => {
        this.props.history.push(
            AppUrls.LOGOUT
        );
    }

    private getAnchorElement(): (HTMLElement | undefined) {
        return ((document.querySelector(".jma-app-menu-anchor") || undefined) as HTMLElement);
    }
}

export default withRouter(AppMenu);

const anchorOrigin: any = {
    horizontal: "right",
    vertical: "top"
};
const transformOrigin: any = {
    horizontal: "right",
    vertical: "top"
};