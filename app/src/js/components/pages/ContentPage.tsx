import * as React from "react";

import { withTheme, WithTheme } from "@mui/material";

import { getContentHeight } from "../../constants/global-functions";
import { useLocation } from "react-router";

type IContentPageProps = WithTheme;

const ContentPage = (props: IContentPageProps) => {
    const location = useLocation();
    const { theme } = props;

    const contentPageStyle: React.CSSProperties = React.useMemo(
        () => ({
            backgroundColor: theme.palette.secondary.main,
            height: getContentHeight(),
        }),
        [theme]
    );

    return (
        <div style={contentPageStyle}>
            <span>{location.pathname}</span>
        </div>
    );
};

export default withTheme(ContentPage);
