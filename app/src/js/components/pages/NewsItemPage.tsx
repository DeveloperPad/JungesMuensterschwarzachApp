import {
    Card,
    CardContent,
    Typography,
    withTheme,
    WithTheme,
} from "@material-ui/core";
import * as React from "react";
import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { formatDate, getDate } from "../../constants/global-functions";
import { AppUrls } from "../../constants/specific-urls";
import { IUserKeys } from "../../networking/account_data/IUser";
import INewsItem from "../../networking/news/INewsItem";
import { INewsItemResponse } from "../../networking/news/NewsItemRequest";
import NewsRequest from "../../networking/news/NewsRequest";
import Background from "../utilities/Background";
import ImageCarousel from "../utilities/ImageCarousel";
import Badge from "../utilities/Badge";
import { useLocation } from "react-router";
import { useEffect, useRef, useState } from "react";

type INewsItemPageProps = WithTheme;

const NewsItemPage = (props: INewsItemPageProps) => {
    const { theme } = props;
    const newsRequest = useRef<NewsRequest>(null);
    const location = useLocation();

    const alignVerticallyStyle: React.CSSProperties = {
        margin: "auto",
    };

    const postingTimeTypographyStyle: React.CSSProperties = {
        display: "inline-block",
        float: "left",
    };

    const postingDateTypographyStyle: React.CSSProperties = {
        display: "inline-block",
        float: "right",
    };

    const postingHrStyle: React.CSSProperties = {
        clear: "both",
        float: "none",
    };
    const newsItemTemplateLoading: INewsItem = {
        newsId: -1,
        postingDate: new Date(),
        summary: Dict.label_wait,
        title: Dict.label_loading,
    };
    const cardContentStyle: React.CSSProperties = {
        marginBottom: theme.spacing(),
        paddingBottom: theme.spacing(),
        paddingTop: theme.spacing(),
    };

    const [newsItem, setNewsItem] = useState(newsItemTemplateLoading);

    useEffect(() => {
        const newsId = parseInt(
            location.pathname.slice((AppUrls.NEWS_LIST + "/").length),
            10
        );

        if (Number.isNaN(newsId)) {
            setNewsItem( {
                newsId: -1,
                postingDate: new Date(),
                summary: Dict.news_id_invalid,
                title: Dict.error_type_client,
            });
        } else {
            if (newsRequest.current) {
                newsRequest.current.cancel();
            }

            newsRequest.current = new NewsRequest(
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
                    newsRequest.current = null;
                },
                (error: string) => {
                    setNewsItem({
                        newsId: -1,
                        postingDate: new Date(),
                        summary: Dict.error_message_try_later,
                        title: Dict.error_type_network,
                    });
                    newsRequest.current = null;
                }
            );
            newsRequest.current.execute();
        }

        return () => {
            if (newsRequest.current) {
                newsRequest.current.cancel();
            }
        };
    }, [location]);

    const getAuthorDetails = (): React.ReactNode => {
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
    };

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

                    <div style={alignVerticallyStyle}>{getAuthorDetails()}</div>
                </CardContent>
            </Card>
        </Background>
    );
};

export default withTheme(NewsItemPage);
