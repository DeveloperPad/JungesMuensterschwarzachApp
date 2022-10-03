import * as React from "react";

import { withTheme, WithTheme } from "@mui/material";

import { AppUrls } from "../../constants/specific-urls";
import { grid5Style, grid7Style } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { CookieService } from "../../services/CookieService";
import LoginForm from "../forms/LoginForm";
import WhiteLogoIcon from "../navigation/icons/WhiteLogoIcon";
import Background from "../utilities/Background";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";
import { useNavigate } from "react-router";

type ILoginPageProps = WithTheme & {
    setIsLoggedIn(isLoggedIn: boolean): void;
};

const LoginPage = (props: ILoginPageProps) => {
    const navigate = useNavigate();
    const { setIsLoggedIn, theme } = props;

    const loginPageStyle: React.CSSProperties = React.useMemo(
        () => ({
            flex: 1,
            textAlign: "center",
            width: "70%",
        }),
        []
    );

    CookieService.get<number>(IUserKeys.accessLevel).then((accessLevel) => {
        if (accessLevel !== null) {
            navigate(AppUrls.HOME);
            return;
        }
    });

    return (
        <Background theme={theme}>
            <Grid style={loginPageStyle}>
                <GridItem style={grid5Style}>
                    <Grid>
                        <WhiteLogoIcon />
                    </Grid>
                </GridItem>

                <GridItem style={grid7Style}>
                    <LoginForm setIsLoggedIn={setIsLoggedIn} />
                </GridItem>
            </Grid>
        </Background>
    );
};

export default withTheme(LoginPage);
