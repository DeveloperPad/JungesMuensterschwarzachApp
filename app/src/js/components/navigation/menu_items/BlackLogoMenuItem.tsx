import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { MenuItem, Tooltip } from '@material-ui/core';

import BlackLogo from '../../../../assets/images/logo_black.png';
import { Dict } from '../../../constants/dict';
import { AppUrls } from '../../../constants/specific-urls';

type BlackLogoMenuItemProps = RouteComponentProps<any, StaticContext> & {
    divider?: boolean
};

class BlackLogoMenuItem extends React.Component<BlackLogoMenuItemProps> {

    public render(): React.ReactNode {
        return (
            <Tooltip title={Dict.navigation_home} placement="right">
                <MenuItem
                button={true}
                className="jma-no-background-color"
                divider={this.props.divider || false}
                onClick={this.forward}
                style={menuItemStyle} />
            </Tooltip>
        );
    }

    private forward = (): void => {
        this.props.history.push(
            AppUrls.HOME
        );
    }

}

export default withRouter(BlackLogoMenuItem);

export const menuItemStyle: React.CSSProperties = {
    backgroundImage: `url(${BlackLogo})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    height: "0",
    marginBottom: "2em",
    paddingTop: "55%", /* trial&error */
    width: "100%"
};