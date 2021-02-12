import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { RootRef, Toolbar, Tooltip, Typography } from '@material-ui/core';
import MuiAppBar from '@material-ui/core/AppBar';

import Dict from '../../../constants/dict';
import { AppUrls } from '../../../constants/specific-urls';
import { grid1Style } from '../../../constants/theme';
import LoginIconButton from '../../navigation/icon_buttons/LoginIconButton';
import ProfileIconButton from '../../navigation/icon_buttons/ProfileIconButton';
import AppDrawerIconButton from '../icon_buttons/AppDrawerIconButton';
import AppMenuIconButton from '../icon_buttons/AppMenuIconButton';
import ReloadIconButton from '../icon_buttons/ReloadIconButton';

type IAppBarProps = RouteComponentProps<any, StaticContext> & {
    rerenderApp: () => void;
    toggleAppDrawerVisibility: () => void;
    toggleAppMenuVisibility: () => void;
}

class AppBar extends React.Component<IAppBarProps> {

    private appBarRef: React.RefObject<{ clientHeight?: number | null }>;

    constructor(props: IAppBarProps) {
        super(props);
        this.appBarRef = React.createRef();
    }

    public componentDidMount(): void {
        this.props.rerenderApp(); // rerenders the app, because the app bar's height is known now
    }

    public render(): React.ReactNode {
        return (
            <RootRef rootRef={this.appBarRef}>
                <MuiAppBar id="jma-app-bar" className="jma-app-bar" position="sticky">
                    <Toolbar>
                        <AppDrawerIconButton toggleAppDrawerVisibility={this.props.toggleAppDrawerVisibility} />
                        <Tooltip title={Dict.navigation_home}>
                            <Typography
                                variant="h5"
                                noWrap={true}
                                onClick={this.forwardToHomepage}
                                style={appNameTypographyStyle}>
                                {Dict.general_app_name}
                            </Typography>
                        </Tooltip>
                        <ReloadIconButton />
                        <ProfileIconButton />
                        <LoginIconButton />
                        <AppMenuIconButton toggleAppMenuVisibility={this.props.toggleAppMenuVisibility}/>
                    </Toolbar>
                </MuiAppBar >
            </RootRef>
        );
    }

    private forwardToHomepage = (): void => {
        this.props.history.push(
            AppUrls.HOME
        );
    }

}

export default withRouter(AppBar);

const appNameTypographyStyle: React.CSSProperties = {
    ...grid1Style,
    cursor: "pointer",
    marginLeft: "1em"
};