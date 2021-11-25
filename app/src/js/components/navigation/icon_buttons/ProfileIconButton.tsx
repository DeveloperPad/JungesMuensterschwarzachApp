import * as React from "react";

import { IconButton, Tooltip } from "@material-ui/core";
import { Person } from "@material-ui/icons";

import { Dict } from "../../../constants/dict";
import { AppUrls } from "../../../constants/specific-urls";
import { IUserKeys, IUserValues } from "../../../networking/account_data/IUser";
import { CookieService } from "../../../services/CookieService";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router";

const ProfileIconButton = () => {
    const [display, setDisplay] = useState(false);
    const checkLoginState = useRef(true);
    const navigate = useNavigate();

    const forward = (): void => {
        navigate(AppUrls.PROFILE);
    };

    useEffect(() => {
        if (!checkLoginState.current) {
            checkLoginState.current = true;
            return;
        }

        CookieService.get<number>(IUserKeys.accessLevel)
            .then((accessLevel) => {
                checkLoginState.current = false;
                setDisplay(
                    accessLevel !== null &&
                        accessLevel !== IUserValues[IUserKeys.accessLevel].guest
                );
            })
            .catch((error) => {
                checkLoginState.current = false;
                setDisplay(false);
            });
    });

    if (!display) {
        return null;
    }

    return (
        <Tooltip title={Dict.navigation_profile}>
            <IconButton onClick={forward}>
                <Person />
            </IconButton>
        </Tooltip>
    );
};

export default ProfileIconButton;
