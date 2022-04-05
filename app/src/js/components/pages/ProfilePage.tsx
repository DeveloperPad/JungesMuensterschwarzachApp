import * as React from "react";

import { withTheme, WithTheme } from "@material-ui/core";

import { AppUrls } from "../../constants/specific-urls";
import { IUserKeys, IUserValues } from "../../networking/account_data/IUser";
import { CookieService } from "../../services/CookieService";
import ProfileForm from "../forms/ProfileForm";
import Background from "../utilities/Background";
import { useNavigate } from "react-router";

type IProfilePageProps = WithTheme;

const ProfilePage = (props: IProfilePageProps) => {
    const { theme } = props;
    const navigate = useNavigate();

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

    return (
        <Background theme={theme}>
            <ProfileForm />
        </Background>
    );
};

export default withTheme(ProfilePage);
