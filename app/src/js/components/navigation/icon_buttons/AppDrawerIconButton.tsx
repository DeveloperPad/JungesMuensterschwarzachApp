import * as React from 'react';

import { IconButton, Tooltip } from '@material-ui/core';
import { Menu } from '@material-ui/icons';

import { Dict } from '../../../constants/dict';

interface IAppDrawerIconButton {
    toggleAppDrawerVisibility: () => void;
}

export default class AppDrawerIconButton extends React.Component<IAppDrawerIconButton> {

    public render(): React.ReactNode {
        return (
            <Tooltip title={Dict.navigation_main}>
                <IconButton
                    onClick={this.props.toggleAppDrawerVisibility}>
                    <Menu />
                </IconButton>
            </Tooltip>
        );
    }

}