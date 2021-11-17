import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Card, CardContent, CardMedia, Typography, withTheme, WithTheme } from '@material-ui/core';

import StandardThumbnail from '../../../assets/images/logo_colored.png';
import Formats from '../../constants/formats';
import { formatDate, getDate } from '../../constants/global-functions';
import { AppUrls } from '../../constants/specific-urls';
import { CustomTheme, grid5Style } from '../../constants/theme';
import INewsItem from '../../networking/news/INewsItem';
import { ConfigService } from '../../services/ConfigService';

type INewsListItemProps = RouteComponentProps<any, StaticContext> & WithTheme & {
    newsItem: INewsItem;
}

class NewsListItem extends React.Component<INewsListItemProps> {

    private cardStyle: React.CSSProperties = {
        backgroundColor: CustomTheme.COLOR_BODY_INNER,
        cursor: "pointer",
        display: "flex",
        marginBottom: this.props.theme.spacing(),
        width: "100%"
    };
    private cardMediaStyle: React.CSSProperties = {
        height: "100%",
        objectFit:
            this.props.newsItem.imageIds && this.props.newsItem.imageIds.length >= 1 ?
                "cover" : "contain",
        width: "100%"
    };

    public render(): React.ReactNode {
        return (
            <Card
                key={this.props.newsItem.newsId}
                onClick={
                    this.openNewsItem.bind(
                        this,
                        this.props.newsItem.newsId
                    )
                }
                style={this.cardStyle}>
                <div style={grid5Style}>
                    <CardMedia
                        component="img"
                        src={
                            this.props.newsItem.imageIds && this.props.newsItem.imageIds.length >= 1 ?
                                ConfigService.getConfig().BaseUrls.WEBSERVICE + "/" + this.props.newsItem.imageIds[0].path :
                                StandardThumbnail
                        }
                        style={this.cardMediaStyle}
                    />
                </div>
                <CardContent
                    style={cardContentStyle}>

                    <Typography
                        color="primary"
                        variant="h5">
                        {this.props.newsItem.title}
                    </Typography>

                    <Typography
                        gutterBottom={true}
                        variant="subtitle1">
                        {this.props.newsItem.summary}
                    </Typography>

                    <Typography
                        variant="caption">
                        <span>{formatDate(getDate(this.props.newsItem.postingDate, Formats.DATE.DATETIME_DATABASE), Formats.DATE.DATETIME_LOCAL)}</span>
                    </Typography>

                </CardContent>
            </Card>
        );
    }

    private openNewsItem = (newsId: number): void => {
        if (newsId >= 0) {
            this.props.history.push(
                AppUrls.NEWS_LIST + "/" + newsId
            );
        }
    }

}

export default withTheme(withRouter(NewsListItem));

const cardContentStyle: React.CSSProperties = {
    flex: 12,
    margin: "auto",
    width: "90%"
};