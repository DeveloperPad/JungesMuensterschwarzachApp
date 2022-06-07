import * as React from "react";

import { Card, CardContent, CardHeader, WithTheme, withTheme } from "@material-ui/core";

import Background from "../utilities/Background";
import { useLocation } from "react-router";

type IPageNotFoundProps = WithTheme;

const PageNotFound = (props: IPageNotFoundProps) => {
    const location = useLocation();
    const { theme } = props;

    return (
        <Background theme={theme}>
            <Card>
                <CardHeader title="HTTP-Status-Code: 404" />
                <CardContent>
                    Page not found: { location.pathname }
                </CardContent>
            </Card>
        </Background>
    );
};

export default withTheme(PageNotFound);
