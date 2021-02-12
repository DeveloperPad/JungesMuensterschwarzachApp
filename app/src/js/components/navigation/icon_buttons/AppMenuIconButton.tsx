import * as React from 'react';

import { IconButton, Tooltip } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

import Dict from '../../../constants/dict';

interface IAppMenuIconButton {
    toggleAppMenuVisibility: () => void;
}

export default class AppMenuIconButton extends React.Component<IAppMenuIconButton> {

    public render(): React.ReactNode {
        return (
            <Tooltip title={Dict.navigation_more}>
                <IconButton
                    className="jma-app-menu-anchor"
                    onClick={this.props.toggleAppMenuVisibility}>
                    <MoreVert />
                </IconButton>
            </Tooltip>
        );
    }

}