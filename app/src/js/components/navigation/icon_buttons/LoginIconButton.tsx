import * as React from "react";
import { useNavigate } from "react-router";

import { IconButton, Tooltip } from "@material-ui/core";
import { Input } from "@material-ui/icons";

import { Dict } from "../../../constants/dict";
import { AppUrls } from "../../../constants/specific-urls";
import { IUserKeys } from "../../../networking/account_data/IUser";
import { CookieService } from "../../../services/CookieService";

type ILoginIconButtonProps = {
    isLoggedIn: boolean;
};

const LoginIconButton = (props: ILoginIconButtonProps) => {
    const navigate = useNavigate();
    const { isLoggedIn } = props;
    const [display, setDisplay] = React.useState(!isLoggedIn);

    React.useEffect(() => {
        CookieService.get<number>(IUserKeys.accessLevel)
            .then((accessLevel) => {
                setDisplay(accessLevel === null);
            })
            .catch((error) => {
                setDisplay(true);
            });
    }, [isLoggedIn]);

    if (!display) {
        return null;
    }

    return (
        <Tooltip title={Dict.navigation_app_sign_in}>
            <IconButton onClick={navigate.bind(this, AppUrls.LOGIN)}>
                <Input />
            </IconButton>
        </Tooltip>
    );
};

export default LoginIconButton;
