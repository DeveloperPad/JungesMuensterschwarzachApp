import * as React from "react";

import { IconButton, Tooltip } from "@material-ui/core";
import { Refresh } from "@material-ui/icons";

import { Dict } from "../../../constants/dict";

const ReloadIconButton = () => {
    const reload = (): void => {
        window.location.reload();
    };

    return (
        <Tooltip title={Dict.navigation_reload}>
            <IconButton onClick={reload}>
                <Refresh />
            </IconButton>
        </Tooltip>
    );
};

export default ReloadIconButton;
