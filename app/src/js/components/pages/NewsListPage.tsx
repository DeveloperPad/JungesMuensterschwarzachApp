import * as React from "react";
import { useNavigate } from "react-router";

import { withTheme, WithTheme } from "@mui/material";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { AppUrls } from "../../constants/specific-urls";
import { IUserKeys } from "../../networking/account_data/IUser";
import INewsItem from "../../networking/news/INewsItem";
import { INewsListResponse } from "../../networking/news/NewsListRequest";
import NewsRequest from "../../networking/news/NewsRequest";
import { CookieService } from "../../services/CookieService";
import NewsListItem from "../list_items/NewsListItem";
import Background from "../utilities/Background";
import Pagination from "../utilities/Pagination";
import { useRequestQueue } from "../utilities/CustomHooks";

type INewsListPageProps = WithTheme;

const NewsListPage = (props: INewsListPageProps) => {
    const navigate = useNavigate();
    const { theme } = props;
    const [newsList, setNewsList] = React.useState<INewsItem[]>([]);
    const [currentPage, setCurrentPage] = React.useState<number>(0);
    const [totalPages, setTotalPages] = React.useState<number>(1);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [request, isRequestRunning] = useRequestQueue();

    const onChangePage = React.useCallback(
        (newPage: number): void => {
            if (newPage < 0 || newPage >= totalPages) {
                return;
            }
            setCurrentPage(newPage);
        },
        [totalPages]
    );
    const updateNewsList = React.useCallback((newsList: INewsItem[]): void => {
        setNewsList(newsList);
        setCurrentPage(0);
        setTotalPages(
            Math.ceil(newsList.length / Formats.ROWS.STANDARD.PAGINATION)
        );
    }, []);

    React.useEffect(() => {
        updateNewsList([
            {
                newsId: -1,
                postingDate: new Date(),
                summary: Dict.label_wait,
                title: Dict.label_loading,
            },
        ]);

        CookieService.get<number>(IUserKeys.accessLevel)
            .then((accessLevel) => {
                if (accessLevel === null) {
                    navigate(AppUrls.LOGIN);
                } else {
                    request(
                        new NewsRequest(
                            {},
                            (response: INewsListResponse) => {
                                if (response.errorMsg) {
                                    const errorMsg = response.errorMsg;

                                    updateNewsList([
                                        {
                                            newsId: -1,
                                            postingDate: new Date(),
                                            summary: Dict[errorMsg] ?? errorMsg,
                                            title: Dict.error_type_server,
                                        },
                                    ]);
                                } else {
                                    updateNewsList(response.news);
                                }
                            },
                            (error: string) => {
                                updateNewsList([
                                    {
                                        newsId: -1,
                                        postingDate: new Date(),
                                        summary: Dict.error_message_try_later,
                                        title: Dict.error_type_network,
                                    },
                                ]);
                            }
                        )
                    );
                }
            })
            .catch((error) => {
                navigate(AppUrls.LOGIN);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderedNewsList = React.useMemo((): React.ReactElement<any>[] => {
        const newRenderedNewsList: React.ReactElement<any>[] = [];

        for (let i = 0; i < newsList.length; i++) {
            if (
                currentPage === Math.floor(i / Formats.ROWS.STANDARD.PAGINATION)
            ) {
                newRenderedNewsList.push(
                    <NewsListItem
                        key={newsList[i].newsId}
                        newsItem={newsList[i]}
                    />
                );
            }
        }

        newRenderedNewsList.push(
            <Pagination
                currentPage={currentPage}
                key={-2}
                onChangePage={onChangePage}
                totalPages={totalPages}
                style={{
                    marginBottom: theme.spacing(),
                }}
            />
        );

        return newRenderedNewsList;
    }, [currentPage, newsList, onChangePage, theme, totalPages]);

    return <Background theme={theme}>{renderedNewsList}</Background>;
};

export default withTheme(NewsListPage);
