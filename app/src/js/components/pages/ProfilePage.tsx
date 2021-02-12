import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { withTheme, WithTheme } from '@material-ui/core';

import { AppUrls } from '../../constants/specific-urls';
import { IUserKeys, IUserValues } from '../../networking/account_data/IUser';
import { CookieService } from '../../services/CookieService';
import ProfileForm from '../forms/ProfileForm';
import Background from '../utilities/Background';

type IProfilePageProps = RouteComponentProps<any, StaticContext> & WithTheme;

class ProfilePage extends React.Component<IProfilePageProps> {

    constructor(props: IProfilePageProps) {
        super(props);

        CookieService.get<number>(IUserKeys.accessLevel)
            .then(accessLevel => {
                if (accessLevel === null || accessLevel <= IUserValues[IUserKeys.accessLevel].guest) {
                    this.props.history.push(
                        AppUrls.LOGIN
                    );
                }
            })
            .catch(error => {
                this.props.history.push(
                    AppUrls.LOGIN
                );
            });
    }

    public render(): React.ReactNode {
        return (
            <Background theme={this.props.theme}>
                <ProfileForm />
            </Background>
        );
    }

}

export default withTheme(withRouter(ProfilePage));