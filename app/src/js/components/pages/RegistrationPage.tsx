import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { withTheme, WithTheme } from '@material-ui/core';

import { AppUrls } from '../../constants/specific-urls';
import { grid5Style, grid7Style } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';
import { CookieService } from '../../services/CookieService';
import RegistrationForm from '../forms/RegistrationForm';
import WhiteLogoIcon from '../navigation/icons/WhiteLogoIcon';
import Background from '../utilities/Background';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';

type ILoginPageProps = RouteComponentProps<any, StaticContext> & WithTheme;

class LoginPage extends React.Component<ILoginPageProps> {

    constructor(props: ILoginPageProps) {
        super(props);

        CookieService.get<number>(IUserKeys.accessLevel)
            .then(accessLevel => {
                if (accessLevel !== null) {
                    this.props.history.push(
                        AppUrls.HOME
                    );
                }
            });
    }

    public render(): React.ReactNode {
        return (
            <Background theme={this.props.theme}>
                <Grid
                    style={gridStyle}>

                    <GridItem
                        style={grid5Style}>
                        <Grid>
                            <WhiteLogoIcon />
                        </Grid>
                    </GridItem>

                    <GridItem
                        style={grid7Style}>
                        <RegistrationForm />
                    </GridItem>
                </Grid>
            </Background>
        );
    }

}

export default withTheme(withRouter(LoginPage));

const gridStyle: React.CSSProperties = {
    width: "70%"
};