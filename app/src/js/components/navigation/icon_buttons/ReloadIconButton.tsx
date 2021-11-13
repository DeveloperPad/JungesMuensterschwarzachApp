import * as React from 'react';

import { IconButton, Tooltip } from '@material-ui/core';
import { Refresh } from '@material-ui/icons';

import { Dict } from '../../../constants/dict';

export default class ReloadIconButton extends React.Component {

    public render(): React.ReactNode {
        return (
            <Tooltip title={Dict.navigation_reload}>
                <IconButton
                    onClick={this.reload}>
                    <Refresh />
                </IconButton>
            </Tooltip>
        );
    }

    private reload = (): void => {
        window.location.reload(true);
    }

}