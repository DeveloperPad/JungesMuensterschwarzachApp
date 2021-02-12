import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { withTheme, WithTheme } from '@material-ui/core';

import Dict from '../../constants/dict';
import Formats from '../../constants/formats';
import { AppUrls } from '../../constants/specific-urls';
import { IUserKeys } from '../../networking/account_data/IUser';
import INewsItem from '../../networking/news/INewsItem';
import { INewsListResponse } from '../../networking/news/NewsListRequest';
import NewsRequest from '../../networking/news/NewsRequest';
import { CookieService } from '../../services/CookieService';
import NewsListItem from '../list_items/NewsListItem';
import Background from '../utilities/Background';
import Pagination from '../utilities/Pagination';

type INewsListPageProps = RouteComponentProps<any, StaticContext> & WithTheme;

interface INewsListPageState {
    newsRequest: NewsRequest | null;
    currentPage: number;
    newsList: INewsItem[];
    totalPages: number;
}

class NewsListPage extends React.Component<INewsListPageProps, INewsListPageState> {

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

    private marginBottomStyle: React.CSSProperties = {
        marginBottom: this.props.theme.spacing()
    };

    constructor(props: INewsListPageProps) {
        super(props);

        this.state = {
            newsRequest: null,
            currentPage: 0,
            newsList: [NewsListPage.newsItemTemplateLoading],
            totalPages: 1
        };

        CookieService.get<number>(IUserKeys.accessLevel)
            .then(accessLevel => {
                if (accessLevel === null) {
                    this.props.history.push(
                        AppUrls.LOGIN
                    );
                }
            })
            .catch(error => {
                this.props.history.push(
                    AppUrls.LOGIN
                );
            });
    }

    public componentDidMount(): void {
        this.setState(prevState => {
            return {
                ...prevState,
                newsRequest: new NewsRequest(
                    {
                    },
                    (response: INewsListResponse) => {
                        if (response.errorMsg) {
                            const errorMsg = response.errorMsg;

                            this.setNewsList(
                                [{
                                    newsId: -1,
                                    postingDate: new Date(),
                                    summary: (Dict.hasOwnProperty(errorMsg) ? Dict[errorMsg] : errorMsg),
                                    title: Dict.error_type_server
                                }]
                            );
                        } else {
                            this.setNewsList(
                                response.news
                            );
                        }
                    },
                    (error: string) => {
                        this.setNewsList(
                            [
                                NewsListPage.newsItemTemplateError
                            ]
                        );
                    }
                )
            };
        });
    }

    public componentDidUpdate(prevProps: INewsListPageProps, prevState: INewsListPageState): void {
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
        const newsList: React.ReactNode[] = [];

        for (let i = 0; i < this.state.newsList.length; i++) {
            if (this.state.currentPage === Math.floor(i / Formats.ROWS.STANDARD.PAGINATION)) {
                newsList.push((
                    <NewsListItem
                        key={this.state.newsList[i].newsId}
                        newsItem={this.state.newsList[i]} />
                ));
            }
        }


        return (
            <Background theme={this.props.theme}>
                {newsList}
                <Pagination
                    currentPage={this.state.currentPage}
                    onChangePage={this.onChangePage}
                    totalPages={this.state.totalPages}
                    style={this.marginBottomStyle}
                />
            </Background>
        );
    }

    private setNewsList = (newsList: INewsItem[]): void => {
        this.setState(prevState => {
            return {
                ...prevState,
                newsRequest: null,
                currentPage: 0,
                newsList,
                totalPages: Math.ceil(newsList.length / Formats.ROWS.STANDARD.PAGINATION)
            };
        });
    }

    private onChangePage = (newPage: number): void => {
        if (newPage < 0 || newPage >= this.state.totalPages) {
            return;
        }

        this.setState({
            currentPage: newPage
        });
    }

}

export default withTheme(withRouter(NewsListPage));