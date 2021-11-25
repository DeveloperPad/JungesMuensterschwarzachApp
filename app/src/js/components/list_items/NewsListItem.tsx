import * as React from "react";

import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    withTheme,
    WithTheme,
} from "@material-ui/core";

import StandardThumbnail from "../../../assets/images/logo_colored.png";
import Formats from "../../constants/formats";
import { formatDate, getDate } from "../../constants/global-functions";
import { AppUrls } from "../../constants/specific-urls";
import { CustomTheme, grid5Style } from "../../constants/theme";
import INewsItem from "../../networking/news/INewsItem";
import { ConfigService } from "../../services/ConfigService";
import { useNavigate } from "react-router";

type INewsListItemProps = WithTheme & {
    newsItem: INewsItem;
};

const NewsListItem = (props: INewsListItemProps) => {
    const { newsItem, theme } = props;
    const navigate = useNavigate();

    const openNewsItem = (): void => {
        const newsId = newsItem.newsId;

        if (newsId >= 0) {
            navigate(AppUrls.NEWS_LIST + "/" + newsId);
        }
    };

    return (
        <Card
            key={newsItem.newsId}
            onClick={openNewsItem}
            style={{
                backgroundColor: CustomTheme.COLOR_BODY_INNER,
                cursor: "pointer",
                display: "flex",
                marginBottom: theme.spacing(),
                width: "100%",
            }}
        >
            <div style={grid5Style}>
                <CardMedia
                    component="img"
                    src={
                        newsItem.imageIds && newsItem.imageIds.length >= 1
                            ? ConfigService.getConfig().BaseUrls.WEBSERVICE +
                              "/" +
                              newsItem.imageIds[0].path
                            : StandardThumbnail
                    }
                    style={{
                        height: "100%",
                        objectFit:
                            newsItem.imageIds && newsItem.imageIds.length >= 1
                                ? "cover"
                                : "contain",
                        width: "100%",
                    }}
                />
            </div>
            <CardContent
                style={{
                    flex: 12,
                    margin: "auto",
                    width: "90%",
                }}
            >
                <Typography color="primary" variant="h5">
                    {newsItem.title}
                </Typography>

                <Typography gutterBottom={true} variant="subtitle1">
                    {newsItem.summary}
                </Typography>

                <Typography variant="caption">
                    <span>
                        {formatDate(
                            getDate(
                                newsItem.postingDate,
                                Formats.DATE.DATETIME_DATABASE
                            ),
                            Formats.DATE.DATETIME_LOCAL
                        )}
                    </span>
                </Typography>
            </CardContent>
        </Card>
    );
};

export default withTheme(NewsListItem);
