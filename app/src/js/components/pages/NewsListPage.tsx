import * as React from 'react';

import { withTheme, WithTheme } from '@material-ui/core';

import { Dict } from '../../constants/dict';
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
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

type INewsListPageProps = WithTheme;


const NewsListPage = (props: INewsListPageProps) => {
    const { theme } = props;
    const [renderedNewsList, setRenderedNewsList] = useState<React.ReactElement<any>[]>([
        <NewsListItem
            key={-1}
            newsItem={{
                newsId: -1,
                postingDate: new Date(),
                summary: Dict.label_wait,
                title: Dict.label_loading
            }}
        />
    ]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const newsRequest = useRef<NewsRequest>();
    const loadedNewsList = useRef<INewsItem[]>();
    const navigate = useNavigate();

    const updateNewsList = (newsList: INewsItem[]): void => {
        if (newsRequest.current) {
            newsRequest.current.cancel();
            newsRequest.current = null;
        }
        loadedNewsList.current = newsList;
        setCurrentPage(0);
        setTotalPages(Math.ceil(newsList.length / Formats.ROWS.STANDARD.PAGINATION));
    }

    CookieService.get<number>(IUserKeys.accessLevel)
            .then(accessLevel => {
                if (accessLevel === null) {
                    navigate(AppUrls.LOGIN);
                }
            })
            .catch(error => {
                navigate(AppUrls.LOGIN);
            });

    newsRequest.current = new NewsRequest(
        {
        },
        (response: INewsListResponse) => {
            if (response.errorMsg) {
                const errorMsg = response.errorMsg;

                updateNewsList([
                    {
                        newsId: -1,
                        postingDate: new Date(),
                        summary: Dict[errorMsg] ?? errorMsg,
                        title: Dict.error_type_server
                    }
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
                    title: Dict.error_type_network
                }
            ]);
        }
    );
    newsRequest.current.execute();

    useEffect(() => {
        const onChangePage = (newPage: number): void => {
            if (newPage < 0 || newPage >= totalPages) {
                return;
            }
            setCurrentPage(newPage);
        }
        
        const newRenderedNewsList: React.ReactElement<any>[] = [];

        if (loadedNewsList.current) {
            for (let i = 0; i < loadedNewsList.current.length; i++) {
                if (currentPage === Math.floor(i / Formats.ROWS.STANDARD.PAGINATION)) {
                    newRenderedNewsList.push((
                        <NewsListItem
                            key={loadedNewsList.current[i].newsId}
                            newsItem={loadedNewsList.current[i]} />
                    ));
                }
            }
        }
        
        newRenderedNewsList.push((
            <Pagination
                    currentPage={currentPage}
                    onChangePage={onChangePage}
                    totalPages={totalPages}
                    style={{
                        marginBottom: theme.spacing()
                    }}
                />
        ));
        
        setRenderedNewsList(newRenderedNewsList);

        return () => {
            if (newsRequest.current) {
                newsRequest.current.cancel();
            }
        };
    }, [currentPage, totalPages, theme]);

    

    return (
        <Background theme={theme}>
            {renderedNewsList}
        </Background>
    );

}

export default withTheme(NewsListPage);