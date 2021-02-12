import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import WhiteLogo from '../../../../assets/images/logo_white.png';
import { AppUrls } from '../../../constants/specific-urls';
import { logoItemStyle } from '../../../constants/theme';

type WhiteLogoIconProps = RouteComponentProps<any, StaticContext> & {
    divider?: boolean
};

class WhiteLogoIcon extends React.Component<WhiteLogoIconProps> {

    public render(): React.ReactNode {
        return (
            <img
                alt=""
                onClick={this.forward}
                src={WhiteLogo}
                style={logoItemStyle}
            />
        );
    }

    private forward = (): void => {
        this.props.history.push(
            AppUrls.HOME
        );
    }

}

export default withRouter(WhiteLogoIcon);