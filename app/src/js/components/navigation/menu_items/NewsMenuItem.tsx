import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { MenuItem } from '@material-ui/core';

import Dict from '../../../constants/dict';
import { AppUrls } from '../../../constants/specific-urls';

type NewsMenuItemProps = RouteComponentProps<any, StaticContext> & {
    divider?: boolean
};

class NewsMenuItem extends React.Component<NewsMenuItemProps> {

    public render(): React.ReactNode {
        return (
            <MenuItem
                button={true}
                divider={this.props.divider || false}
                onClick={this.forward}>
                <span>{Dict.navigation_app_news}</span>
            </MenuItem>
        );
    }

    private forward = (): void => {
        this.props.history.push(
            AppUrls.NEWS
        );
    }

}

export default withRouter(NewsMenuItem);