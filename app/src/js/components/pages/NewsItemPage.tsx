import * as React from "react";
import { useLocation } from "react-router";

import {
    Card,
    CardContent,
    Typography,
    withTheme,
    WithTheme,
} from "@mui/material";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { formatDate, getDate } from "../../constants/global-functions";
import { AppUrls } from "../../constants/specific-urls";
import { IUserKeys } from "../../networking/account_data/IUser";
import INewsItem from "../../networking/news/INewsItem";
import { INewsItemResponse } from "../../networking/news/NewsItemRequest";
import NewsRequest from "../../networking/news/NewsRequest";
import Background from "../utilities/Background";
import Badge from "../utilities/Badge";
import { useRequestQueue } from "../utilities/CustomHooks";
import ImageCarousel from "../utilities/ImageCarousel";

type INewsItemPageProps = WithTheme;

const NewsItemPage = (props: INewsItemPageProps) => {
    const location = useLocation();
    const { theme } = props;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [request, isRequestRunning] = useRequestQueue();

    const newsId = React.useMemo(
        () =>
            parseInt(
                location.pathname.slice((AppUrls.NEWS_LIST + "/").length),
                10
            ),
        [location.pathname]
    );
    const alignVerticallyStyle: React.CSSProperties = React.useMemo(
        () => ({
            margin: "auto",
        }),
        []
    );
    const postingTimeTypographyStyle: React.CSSProperties = React.useMemo(
        () => ({
            display: "inline-block",
            float: "left",
        }),
        []
    );
    const postingDateTypographyStyle: React.CSSProperties = React.useMemo(
        () => ({
            display: "inline-block",
            float: "right",
        }),
        []
    );
    const postingHrStyle: React.CSSProperties = React.useMemo(
        () => ({
            clear: "both",
            float: "none",
        }),
        []
    );
    const newsItemTemplateLoading: INewsItem = React.useMemo(
        () => ({
            newsId: -1,
            postingDate: new Date(),
            summary: Dict.label_wait,
            title: Dict.label_loading,
        }),
        []
    );
    const cardContentStyle: React.CSSProperties = React.useMemo(
        () => ({
            marginBottom: theme.spacing(),
            paddingBottom: theme.spacing(),
            paddingTop: theme.spacing(),
        }),
        [theme]
    );

    const [newsItem, setNewsItem] = React.useState(newsItemTemplateLoading);

    React.useEffect(() => {
        if (Number.isNaN(newsId)) {
            setNewsItem({
                newsId: -1,
                postingDate: new Date(),
                summary: Dict.news_id_invalid,
                title: Dict.error_type_client,
            });
        } else {
            request(
                new NewsRequest(
                    {
                        newsId,
                    },
                    (response: INewsItemResponse) => {
                        if (response.errorMsg) {
                            const errorMsg = response.errorMsg;

                            setNewsItem({
                                newsId: -1,
                                postingDate: new Date(),
                                summary: Dict.hasOwnProperty(errorMsg)
                                    ? Dict[errorMsg]
                                    : errorMsg,
                                title: Dict.error_type_server,
                            });
                        } else {
                            setNewsItem(response.news);
                        }
                    },
                    (error: string) => {
                        setNewsItem({
                            newsId: -1,
                            postingDate: new Date(),
                            summary: Dict.error_message_try_later,
                            title: Dict.error_type_network,
                        });
                    }
                )
            );
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newsId]);

    const authorDetails = React.useMemo((): React.ReactNode => {
        if (newsItem.author) {
            if (
                newsItem.author[IUserKeys.firstName] &&
                newsItem.author[IUserKeys.lastName]
            ) {
                return (
                    <>
                        <div>
                            <Typography variant="caption">
                                {Dict.news_published_by}
                                <Badge
                                    accessLevel={
                                        newsItem.author[IUserKeys.accessLevel]
                                    }
                                    small={true}
                                />
                                {" " +
                                    newsItem.author[IUserKeys.firstName] +
                                    ' ("' +
                                    newsItem.author[IUserKeys.displayName] +
                                    '") ' +
                                    newsItem.author[IUserKeys.lastName]}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="caption">
                                {Dict.general_abbey_name}
                            </Typography>
                        </div>
                    </>
                );
            } else {
                return (
                    <>
                        <div>
                            <Typography variant="caption">
                                {Dict.news_published_by}
                                <Badge
                                    accessLevel={
                                        newsItem.author[IUserKeys.accessLevel]
                                    }
                                    small={true}
                                />
                                {' "' +
                                    newsItem.author[IUserKeys.displayName] +
                                    '"'}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="caption">
                                {Dict.general_abbey_name}
                            </Typography>
                        </div>
                    </>
                );
            }
        } else {
            return <></>;
        }
    }, [newsItem.author]);

    return (
        <Background theme={theme}>
            <Card>
                <CardContent style={cardContentStyle}>
                    <div style={alignVerticallyStyle}>
                        <Typography
                            gutterBottom={true}
                            style={postingTimeTypographyStyle}
                            variant="caption"
                        >
                            {formatDate(
                                getDate(
                                    newsItem.postingDate,
                                    Formats.DATE.DATETIME_DATABASE
                                ),
                                Formats.DATE.TIME_LOCAL
                            )}
                        </Typography>
                        <Typography
                            gutterBottom={true}
                            style={postingDateTypographyStyle}
                            variant="caption"
                        >
                            {formatDate(
                                getDate(
                                    newsItem.postingDate,
                                    Formats.DATE.DATETIME_DATABASE
                                ),
                                Formats.DATE.DATE_LOCAL
                            )}
                        </Typography>
                    </div>

                    <hr style={postingHrStyle} />

                    <div style={alignVerticallyStyle}>
                        <Typography
                            color="primary"
                            gutterBottom={true}
                            variant="h5"
                        >
                            {newsItem.title}
                        </Typography>

                        <Typography
                            gutterBottom={true}
                            paragraph={true}
                            variant="h6"
                        >
                            {newsItem.summary}
                        </Typography>

                        <ImageCarousel images={newsItem.imageIds} />

                        <Typography
                            className="normalize"
                            component="div"
                            paragraph={true}
                            dangerouslySetInnerHTML={{
                                __html: newsItem.content,
                            }}
                        />
                    </div>

                    <hr />

                    <div style={alignVerticallyStyle}>{authorDetails}</div>
                </CardContent>
            </Card>
        </Background>
    );
};

export default withTheme(NewsItemPage);
