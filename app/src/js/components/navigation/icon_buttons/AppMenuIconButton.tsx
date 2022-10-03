import * as React from "react";

import { IconButton, Tooltip } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { Dict } from "../../../constants/dict";

interface IAppMenuIconButtonProps {
    toggleAppMenuVisibility: () => void;
}

const AppMenuIconButton = (props: IAppMenuIconButtonProps) => {
    const { toggleAppMenuVisibility } = props;

    return (
        <Tooltip title={Dict.navigation_more}>
            <IconButton
                className="jma-app-menu-anchor"
                onClick={toggleAppMenuVisibility}
                size="large">
                <MoreVert />
            </IconButton>
        </Tooltip>
    );
};

export default AppMenuIconButton;
