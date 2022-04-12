import * as React from "react";
import { useNavigate } from "react-router";

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

type IAppBarProps = {
    isLoggedIn: boolean;
    toggleAppDrawerVisibility: () => void;
    toggleAppMenuVisibility: () => void;
};

const AppBar = (props: IAppBarProps) => {
    const navigate = useNavigate();
    const { isLoggedIn, toggleAppDrawerVisibility, toggleAppMenuVisibility } =
        props;
    const ref = React.useRef();

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
                <ProfileIconButton isLoggedIn={isLoggedIn} />
                <LoginIconButton isLoggedIn={isLoggedIn} />
                <AppMenuIconButton
                    toggleAppMenuVisibility={toggleAppMenuVisibility}
                />
            </Toolbar>
        </MuiAppBar>
    );
};

export default AppBar;
