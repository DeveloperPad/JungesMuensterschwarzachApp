import * as React from "react";

import { IconButton, Tooltip } from "@material-ui/core";
import { Menu } from "@material-ui/icons";

import { Dict } from "../../../constants/dict";

interface IAppDrawerIconButtonProps {
    toggleAppDrawerVisibility: () => void;
}

const AppDrawerIconButton = (props: IAppDrawerIconButtonProps) => {
    const { toggleAppDrawerVisibility } = props;

    return (
        <Tooltip title={Dict.navigation_main}>
            <IconButton onClick={toggleAppDrawerVisibility}>
                <Menu />
            </IconButton>
        </Tooltip>
    );
};

export default AppDrawerIconButton;
