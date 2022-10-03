import * as React from "react";

import { IconButton, Tooltip } from "@mui/material";
import { Menu } from "@mui/icons-material";

import { Dict } from "../../../constants/dict";

interface IAppDrawerIconButtonProps {
    toggleAppDrawerVisibility: () => void;
}

const AppDrawerIconButton = (props: IAppDrawerIconButtonProps) => {
    const { toggleAppDrawerVisibility } = props;

    return (
        <Tooltip title={Dict.navigation_main}>
            <IconButton onClick={toggleAppDrawerVisibility} size="large">
                <Menu />
            </IconButton>
        </Tooltip>
    );
};

export default AppDrawerIconButton;
