import * as React from "react";
import { useNavigate } from "react-router";

import { withTheme, WithTheme } from "@material-ui/core";

import { AppUrls } from "../../constants/specific-urls";
import { IUserKeys, IUserValues } from "../../networking/account_data/IUser";
import { CookieService } from "../../services/CookieService";
import ProfileForm from "../forms/ProfileForm";
import Background from "../utilities/Background";

type IProfilePageProps = WithTheme;

const ProfilePage = (props: IProfilePageProps) => {
    const navigate = useNavigate();
    const { theme } = props;

    React.useEffect(() => {
        CookieService.get<number>(IUserKeys.accessLevel)
            .then((accessLevel) => {
                if (
                    accessLevel === null ||
                    accessLevel === IUserValues[IUserKeys.accessLevel].guest
                ) {
                    navigate(AppUrls.LOGIN);
                }
            })
            .catch((error) => {
                navigate(AppUrls.LOGIN);
            });
    }, [navigate]);

    return (
        <Background theme={theme}>
            <ProfileForm />
        </Background>
    );
};

export default withTheme(ProfilePage);
