import { Card, CardContent, Typography, withTheme, WithTheme } from '@material-ui/core';
import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';
import { Dict } from '../../constants/dict';
import Formats from '../../constants/formats';
import { formatDate, getDate } from '../../constants/global-functions';
import { AppUrls } from '../../constants/specific-urls';
import { IUserKeys } from '../../networking/account_data/IUser';
import INewsItem from '../../networking/news/INewsItem';
import { INewsItemResponse } from '../../networking/news/NewsItemRequest';
import NewsRequest from '../../networking/news/NewsRequest';
import Background from '../utilities/Background';
import ImageCarousel from '../utilities/ImageCarousel';
import Badge from '../utilities/Badge';

type INewsItemPageProps = RouteComponentProps<any, StaticContext> & WithTheme;

interface INewsItemPageState {
    newsRequest: NewsRequest | null;
    newsItem: INewsItem
}

class NewsItemPage extends React.Component<INewsItemPageProps, INewsItemPageState> {

    private static newsItemTemplateLoading: INewsItem = {
        newsId: -1,
        postingDate: new Date(),
        summary: Dict.label_wait,
        title: Dict.label_loading
    }

    private static newsItemTemplateError: INewsItem = {
        newsId: -1,
        postingDate: new Date(),
        summary: Dict.error_message_try_later,
        title: Dict.error_type_network
    }

    private cardContentStyle: React.CSSProperties = {
        marginBottom: this.props.theme.spacing(),
        paddingBottom: this.props.theme.spacing(),
        paddingTop: this.props.theme.spacing()
    };

    constructor(props: INewsItemPageProps) {
        super(props);

        this.state = {
            newsRequest: null,
            newsItem: NewsItemPage.newsItemTemplateLoading
        };
    }

    public componentDidMount(): void {
        const newsId: number = this.getCurrentNewsId();

        if (Number.isNaN(newsId)) {
            this.setState(prevState => {
                return {
                    ...prevState,
                    newsRequest: null,
                    newsItem: {
                        newsId: -1,
                        postingDate: new Date(),
                        summary: Dict.news_id_invalid,
                        title: Dict.error_type_client
                    }
                };
            });
        } else {
            this.setState(prevState => {
                return {
                    ...prevState,
                    newsRequest: new NewsRequest(
                        {
                            newsId
                        },
                        (response: INewsItemResponse) => {
                            if (response.errorMsg) {
                                const errorMsg = response.errorMsg;
                                this.setState(prevState => {
                                    return {
                                        ...prevState,
                                        newsRequest: null,
                                        newsItem: {
                                            newsId: -1,
                                            postingDate: new Date(),
                                            summary: (Dict.hasOwnProperty(errorMsg) ? Dict[errorMsg] : errorMsg),
                                            title: Dict.error_type_server
                                        }
                                    }
                                });
                            } else {
                                this.setState(prevState => {
                                    return {
                                        ...prevState,
                                        newsRequest: null,
                                        newsItem: response.news
                                    }
                                });
                            }
                        },
                        (error: string) => {
                            this.setState(prevState => {
                                return {
                                    ...prevState,
                                    newsRequest: null,
                                    newsItem: NewsItemPage.newsItemTemplateError
                                }
                            });
                        }
                    )
                }
            });
        }
    }

    public componentDidUpdate(prevProps: INewsItemPageProps, prevState: INewsItemPageState): void {
        if (this.state.newsRequest) {
            this.state.newsRequest.execute();
        }
    }

    public componentWillUnmount(): void {
        if (this.state.newsRequest) {
            this.state.newsRequest.cancel();
        }
    }

    public render(): React.ReactNode {
        const authorDetails = this.getAuthorDetails();

        return (
            <Background theme={this.props.theme}>
                <Card>
                    <CardContent
                        style={this.cardContentStyle}>

                        <div
                            style={alignVerticallyStyle}>
                            <Typography
                                gutterBottom={true}
                                style={postingTimeTypographyStyle}
                                variant="caption">
                                {formatDate(getDate(this.state.newsItem.postingDate, Formats.DATE.DATETIME_DATABASE), Formats.DATE.TIME_LOCAL)}
                            </Typography>
                            <Typography
                                gutterBottom={true}
                                style={postingDateTypographyStyle}
                                variant="caption">
                                {formatDate(getDate(this.state.newsItem.postingDate, Formats.DATE.DATETIME_DATABASE), Formats.DATE.DATE_LOCAL)}
                            </Typography>
                        </div>

                        <hr
                            style={postingHrStyle} />

                        <div
                            style={alignVerticallyStyle}>

                            <Typography
                                color="primary"
                                gutterBottom={true}
                                variant="h5">
                                {this.state.newsItem.title}
                            </Typography>

                            <Typography
                                gutterBottom={true}
                                paragraph={true}
                                variant="h6">
                                {this.state.newsItem.summary}
                            </Typography>

                            <ImageCarousel
                                images={this.state.newsItem.imageIds}
                            />

                            <Typography
                                className="normalize"
                                component="div"
                                paragraph={true}
                                dangerouslySetInnerHTML={{
                                    __html: this.state.newsItem.content
                                }}
                            />

                        </div>

                        <hr />

                        <div
                            style={alignVerticallyStyle}>
                            {authorDetails}
                        </div>

                    </CardContent>
                </Card>
            </Background>
        );
    }

    private getCurrentNewsId = (): number => {
        return parseInt(this.props.location.pathname.slice((AppUrls.NEWS_LIST + "/").length), 10);
    }

    private getAuthorDetails = (): React.ReactNode => {
        if (this.state.newsItem.author) {
            if (this.state.newsItem.author[IUserKeys.firstName]
                && this.state.newsItem.author[IUserKeys.lastName]) {
                return (
                    <>
                        <div>
                            <Typography
                                variant="caption">
                                {
                                    Dict.news_published_by
                                }
                                    <Badge
                                        accessLevel={this.state.newsItem.author[IUserKeys.accessLevel]}
                                        small={true}
                                    />
                                {
                                    " " + this.state.newsItem.author[IUserKeys.firstName] + " (\""
                                    + this.state.newsItem.author[IUserKeys.displayName] + "\") "
                                    + this.state.newsItem.author[IUserKeys.lastName]
                                }
                            </Typography>
                        </div>
                        <div>
                            <Typography
                                variant="caption">
                                {
                                    Dict.general_abbey_name
                                }
                            </Typography>
                        </div>
                    </>
                );
            } else {
                return (
                    <>
                        <div>
                            <Typography
                                variant="caption">
                                {
                                    Dict.news_published_by
                                }
                                    <Badge
                                        accessLevel={this.state.newsItem.author[IUserKeys.accessLevel]}
                                        small={true}
                                    />
                                {   
                                    " \"" + this.state.newsItem.author[IUserKeys.displayName] + "\""
                                }
                            </Typography>
                        </div>
                        <div>
                            <Typography
                                variant="caption">
                                {
                                    Dict.general_abbey_name
                                }
                            </Typography>
                        </div>
                    </>
                );
            }
        } else {
            return (
                <>
                </>
            );
        }
    }

}

export default withTheme(withRouter(NewsItemPage));

const alignVerticallyStyle: React.CSSProperties = {
    margin: "auto"
};

const postingTimeTypographyStyle: React.CSSProperties = {
    display: "inline-block",
    float: "left"
};

const postingDateTypographyStyle: React.CSSProperties = {
    display: "inline-block",
    float: "right"
};

const postingHrStyle: React.CSSProperties = {
    clear: "both",
    float: "none"
};