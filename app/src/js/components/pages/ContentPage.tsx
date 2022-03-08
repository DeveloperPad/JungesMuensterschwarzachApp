import * as React from 'react';

import { withTheme, WithTheme } from '@material-ui/core';

import { getContentHeight } from '../../constants/global-functions';
import { useLocation } from 'react-router';

type IContentPageProps = WithTheme;

const ContentPage = (props: IContentPageProps) => {
    const {theme} = props;
    const location = useLocation();

    const contentPageStyle: React.CSSProperties = {
        backgroundColor: theme.palette.secondary.main,
        height: getContentHeight()
    };

    return (
        <div style={contentPageStyle}>
            <span>{location.pathname}</span>
        </div>
    );
}

export default withTheme(ContentPage);