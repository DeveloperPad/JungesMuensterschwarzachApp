import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { withTheme, WithTheme } from '@material-ui/core';

import { getContentHeight } from '../../constants/global-functions';

type IContentPageProps = RouteComponentProps<any, StaticContext> & WithTheme;

class ContentPage extends React.Component<IContentPageProps> {

    public render(): React.ReactNode {
        const contentPageStyle: React.CSSProperties = {
            backgroundColor: this.props.theme.palette.secondary.main,
            height: getContentHeight()
        };

        return (
            <div style={contentPageStyle}>
                <span>{this.props.location.pathname}</span>
            </div>
        );
    }

}

export default withTheme(withRouter(ContentPage));