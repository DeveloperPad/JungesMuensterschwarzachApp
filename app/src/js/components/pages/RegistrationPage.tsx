import * as React from 'react';
import { useNavigate } from 'react-router';

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

type ILoginPageProps = WithTheme;

const LoginPage = (props: ILoginPageProps) => {
    const navigate = useNavigate();
    const { theme } = props;

    const gridStyle: React.CSSProperties = React.useMemo(() => ({
        width: "70%",
    }), []);

    CookieService.get<number>(IUserKeys.accessLevel).then((accessLevel) => {
        if (accessLevel !== null) {
            navigate(AppUrls.HOME);
        }
    });

    return (
        <Background theme={theme}>
            <Grid style={gridStyle}>
                <GridItem style={grid5Style}>
                    <Grid>
                        <WhiteLogoIcon />
                    </Grid>
                </GridItem>

                <GridItem style={grid7Style}>
                    <RegistrationForm />
                </GridItem>
            </Grid>
        </Background>
    );
};

export default withTheme(LoginPage);
