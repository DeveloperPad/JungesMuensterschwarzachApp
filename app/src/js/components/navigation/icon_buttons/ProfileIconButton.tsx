import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { IconButton, Tooltip } from '@material-ui/core';
import { Person } from '@material-ui/icons';

import { Dict } from '../../../constants/dict';
import { AppUrls } from '../../../constants/specific-urls';
import { IUserKeys, IUserValues } from '../../../networking/account_data/IUser';
import { CookieService } from '../../../services/CookieService';

interface IProfileIconButtonState {
    isDisplayed: boolean;
}

class ProfileIconButton extends React.Component<RouteComponentProps<any, StaticContext>, IProfileIconButtonState> {

    public state: IProfileIconButtonState = {
        isDisplayed: false
    }

    private shouldCheckLoginState: boolean = true;

    public render(): React.ReactNode {
        if (this.state.isDisplayed === true) {
            return (
                <Tooltip title={Dict.navigation_profile}>
                    <IconButton
                        onClick={this.forward}>
                        <Person />
                    </IconButton>
                </Tooltip>
            );
        } else {
            return null;
        }
    }

    public componentDidMount(): void {
        this.checkLoginState();
    }

    public componentDidUpdate(): void {
        this.checkLoginState();
    }

    private checkLoginState = (): void => {
        if (!this.shouldCheckLoginState) {
            this.shouldCheckLoginState = true;
            return;
        }

        CookieService.get<number>(IUserKeys.accessLevel)
            .then(accessLevel => {
                const isDisplayed = accessLevel !== null && accessLevel !== IUserValues[IUserKeys.accessLevel].guest;
                
                this.shouldCheckLoginState = false;
                this.setState(prevState => {
                    return {
                        ...prevState,
                        isDisplayed
                    };
                });
            })
            .catch(error => {
                this.shouldCheckLoginState = false;
                this.setState(prevState => {
                    return {
                        ...prevState,
                        isDisplayed: false
                    };
                });
            });
    }

    private forward = (): void => {
        this.props.history.push(
            AppUrls.PROFILE
        );
    }

}

export default withRouter(ProfileIconButton);