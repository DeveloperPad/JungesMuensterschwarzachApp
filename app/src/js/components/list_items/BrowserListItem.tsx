import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Card, CardContent, CardMedia, Typography, withTheme, WithTheme } from '@material-ui/core';

import { Browsers } from '../../constants/browsers';
import Dict from '../../constants/dict';
import { OperatingSystems } from '../../constants/operating-systems';
import { AppUrls } from '../../constants/specific-urls';
import { CustomTheme, grid5Style } from '../../constants/theme';

type IBrowserListItemProps = RouteComponentProps<any, StaticContext> & WithTheme & {
    browser: Browsers;
    operatingSystem: OperatingSystems;
}

class BrowserListItem extends React.Component<IBrowserListItemProps> {

    private browserIconPath: string;
    private browserInstallationDetailsPagePath: string;

    private cardStyle: React.CSSProperties = {
        backgroundColor: CustomTheme.COLOR_BODY_INNER,
        cursor: "pointer",
        display: "flex",
        marginBottom: this.props.theme.spacing(),
        width: "100%"
    };
    private cardMediaStyle: React.CSSProperties = {
        height: "90%",
        objectFit: "contain",
        width: "90%"
    };

    constructor(props: IBrowserListItemProps) {
        super(props);

        this.browserIconPath = process.env.PUBLIC_URL + "/browsers/" + props.browser + ".png";
        this.browserInstallationDetailsPagePath = AppUrls.INSTALLATION + "/" + props.operatingSystem + "/" + props.browser;
    }

    public render(): React.ReactNode {
        return (
            <Card
                onClick={this.openInstallationDetailsPage}
                style={this.cardStyle}>
                <div style={cardMediaStyle}>
                    <CardMedia
                        component="img"
                        src={this.browserIconPath}
                        style={this.cardMediaStyle}
                    />
                </div>
                <CardContent
                    style={cardContentStyle}>

                    <Typography
                        color="primary"
                        variant="h5">
                        {Dict["installation_browser_" + this.props.browser]}
                    </Typography>

                </CardContent>
            </Card>
        );
    }

    private openInstallationDetailsPage = (): void => {
        this.props.history.push(
            this.browserInstallationDetailsPagePath
        );
    }

}

export default withTheme(withRouter(BrowserListItem));

const cardMediaStyle: React.CSSProperties = {
    ...grid5Style,
    alignItems: "center",
    display: "flex",
    justifyContent: "center"
}

const cardContentStyle: React.CSSProperties = {
    flex: 12,
    margin: "auto",
    width: "90%"
};