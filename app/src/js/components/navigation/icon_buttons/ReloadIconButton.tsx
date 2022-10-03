import * as React from "react";

import { IconButton, Tooltip } from "@mui/material";
import { Refresh } from "@mui/icons-material";

import { Dict } from "../../../constants/dict";

const ReloadIconButton = () => {
    const reload = React.useCallback((): void => {
        window.location.reload();
    }, []);

    return (
        <Tooltip title={Dict.navigation_reload}>
            <IconButton onClick={reload} size="large">
                <Refresh />
            </IconButton>
        </Tooltip>
    );
};

export default ReloadIconButton;
