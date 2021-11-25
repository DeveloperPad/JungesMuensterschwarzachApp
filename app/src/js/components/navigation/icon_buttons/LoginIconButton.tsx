import * as React from "react";

import { IconButton, Tooltip } from "@material-ui/core";
import { Input } from "@material-ui/icons";

import { Dict } from "../../../constants/dict";
import { AppUrls } from "../../../constants/specific-urls";
import { IUserKeys } from "../../../networking/account_data/IUser";
import { CookieService } from "../../../services/CookieService";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";

const LoginIconButton = () => {
    const [display, setDisplay] = useState(false);
    const checkLoginState = useRef(true);
    const navigate = useNavigate();

    const forward = (): void => {
        navigate(AppUrls.LOGIN);
    };

    useEffect(() => {
        if (!checkLoginState.current) {
            checkLoginState.current = true;
            return;
        }

        CookieService.get<number>(IUserKeys.accessLevel)
            .then((accessLevel) => {
                checkLoginState.current = false;
                setDisplay(accessLevel === null);
            })
            .catch((error) => {
                checkLoginState.current = false;
                setDisplay(true);
            });
    }, [display]);

    if (!display) {
        return null;
    }

    return (
        <Tooltip title={Dict.navigation_app_sign_in}>
            <IconButton onClick={forward}>
                <Input />
            </IconButton>
        </Tooltip>
    );
};

export default LoginIconButton;
