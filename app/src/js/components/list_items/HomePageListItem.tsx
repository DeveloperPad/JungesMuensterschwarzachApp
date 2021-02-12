import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Card, CardContent, CardMedia, Typography, withTheme, WithTheme } from '@material-ui/core';

import { AppUrls } from '../../constants/specific-urls';
import { CustomTheme } from '../../constants/theme';

type IHomePageListItemProps = RouteComponentProps<any, StaticContext> & WithTheme & {
    icon?: string;
    target: AppUrls;
    title: string;
}

class HomePageListItem extends React.Component<IHomePageListItemProps> {

    private outerCardStyle: React.CSSProperties = {
        backgroundColor: CustomTheme.COLOR_BODY_INNER,
        cursor: "pointer",
        margin: this.props.theme.spacing(),
        width: "100%"
    };
    private cardMediaDivStyle: React.CSSProperties = {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        padding: this.props.theme.spacing()
    };
    private cardMediaStyle: React.CSSProperties = {
        height: this.props.theme.spacing(9),
        objectFit: "contain",
        width: "auto"
    };

    public render(): React.ReactNode {
        return (
            <Card
                onClick={this.forwardToTarget}
                style={this.outerCardStyle}>
                <div
                    style={innerCardStyle}>
                    <div style={this.cardMediaDivStyle}>
                        <CardMedia
                            component="img"
                            src={this.props.icon}
                            style={this.cardMediaStyle}
                        />
                    </div>
                    <CardContent style={cardContentStyle}>

                        <Typography
                            color="primary"
                            style={cardContentTypographyStyle}
                            variant="h5">
                            {this.props.title}
                        </Typography>

                    </CardContent>
                </div>
            </Card>
        );
    }

    private forwardToTarget = (): void => {
        if (this.props.target.startsWith("mailto")) {
            window.location.href = this.props.target;
        } else {
            this.props.history.push(
                this.props.target
            );
        }
    }

}

export default withTheme(withRouter(HomePageListItem));

const innerCardStyle: React.CSSProperties = {
    alignItems: "center",
    display: "flex"
}

const cardContentStyle: React.CSSProperties = {
    flex: 2
}

const cardContentTypographyStyle: React.CSSProperties = {
    hyphens: "auto",
    wordBreak: "break-word"
}