import * as React from "react";

import { Card, CardContent, CardHeader, WithTheme, withTheme } from "@material-ui/core";

import Background from "../utilities/Background";

type IPageNotFoundProps = WithTheme;

const PageNotFound = (props: IPageNotFoundProps) => {
    const { theme } = props;

    return (
        <Background theme={theme}>
            <Card>
                <CardHeader title="HTTP-Status-Code: 404" />
                <CardContent>
                    Page not found.
                </CardContent>
            </Card>
        </Background>
    );
};

export default withTheme(PageNotFound);
