import * as React from "react";

import { Toolbar, Tooltip, Typography } from "@material-ui/core";
import MuiAppBar from "@material-ui/core/AppBar";

import { Dict } from "../../../constants/dict";
import { AppUrls } from "../../../constants/specific-urls";
import { grid1Style } from "../../../constants/theme";
import LoginIconButton from "../../navigation/icon_buttons/LoginIconButton";
import ProfileIconButton from "../../navigation/icon_buttons/ProfileIconButton";
import AppDrawerIconButton from "../icon_buttons/AppDrawerIconButton";
import AppMenuIconButton from "../icon_buttons/AppMenuIconButton";
import ReloadIconButton from "../icon_buttons/ReloadIconButton";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useCallback } from "react";

type IAppBarProps = {
    rerenderApp: () => void;
    toggleAppDrawerVisibility: () => void;
    toggleAppMenuVisibility: () => void;
};

const AppBar = React.forwardRef(
    (
        props: IAppBarProps,
        ref: React.ForwardedRef<{ clientHeight?: number | null }>
    ) => {
        const { toggleAppDrawerVisibility, toggleAppMenuVisibility } = props;
        const navigate = useNavigate();
        const rerenderApp = useCallback(() => {
            return props.rerenderApp;
        }, [props.rerenderApp]);

        useEffect(() => {
            rerenderApp();
        }, [rerenderApp]);

        return (
            <MuiAppBar
                id="jma-app-bar"
                className="jma-app-bar"
                position="sticky"
                ref={ref}
            >
                <Toolbar>
                    <AppDrawerIconButton
                        toggleAppDrawerVisibility={toggleAppDrawerVisibility}
                    />
                    <Tooltip title={Dict.navigation_home}>
                        <Typography
                            variant="h5"
                            noWrap={true}
                            onClick={navigate.bind(this, AppUrls.HOME)}
                            style={{
                                ...grid1Style,
                                cursor: "pointer",
                                marginLeft: "1em",
                            }}
                        >
                            {Dict.general_app_name}
                        </Typography>
                    </Tooltip>
                    <ReloadIconButton />
                    <ProfileIconButton />
                    <LoginIconButton />
                    <AppMenuIconButton
                        toggleAppMenuVisibility={toggleAppMenuVisibility}
                    />
                </Toolbar>
            </MuiAppBar>
        );
    }
);

export default AppBar;
