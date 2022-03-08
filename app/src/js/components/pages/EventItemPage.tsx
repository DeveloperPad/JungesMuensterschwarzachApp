import * as React from 'react';

import { BottomNavigationAction, Icon, withTheme, WithTheme } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import { AppUrls } from '../../constants/specific-urls';
import {
    FetchEventItemDataRequest, IFetchEventItemDataResponse
} from '../../networking/events/FetchEventItemDataRequest';
import IEventItem, {
    deserializeEventItem, IEventItemKeys
} from '../../networking/events/IEventItem';
import EventListError from '../list_items/EventListError';
import EventListItem from '../list_items/EventListItem';
import AppBottomNavigation from '../navigation/menus/AppBottomNavigation';
import EventEnrollmentSubPage from '../subpages/EventEnrollmentSubPage';
import EventImagesSubPage from '../subpages/EventImagesSubPage';
import EventInfoSubPage from '../subpages/EventInfoSubPage';
import EventLocationSubPage from '../subpages/EventLocationSubPage';
import Background from '../utilities/Background';
import { useCallback, useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

type IEventItemPageProps = WithTheme;

const EventItemPage = (props: IEventItemPageProps) => {
    const {theme} = props;
    const fetchRequest = useRef<FetchEventItemDataRequest | null>(null);
    const [eventItem, setEventItem] = useState<IEventItem | null>(null);
    const [eventItemError, setEventItemError] = useState<IEventItem | null>({
        [IEventItemKeys.eventStart]: new Date(),
        [IEventItemKeys.eventTitle]: Dict.label_loading,
        [IEventItemKeys.eventTopic]: Dict.label_wait
    });
    const [tab, setTab] = useState<number>(0);
    const location = useLocation();

    const getCurrentEventId = useCallback((): number => {
        return parseInt(location.pathname.slice((AppUrls.EVENTS_LIST + "/").length), 10);
    }, [location]);
    const fetchEventItem = useCallback((): void => {
        if (fetchRequest.current) {
            fetchRequest.current.cancel();
        }

        fetchRequest.current = new FetchEventItemDataRequest(
            getCurrentEventId(),
            (response: IFetchEventItemDataResponse) => {
                fetchRequest.current = null;
                
                const errorMsg = response.errorMsg;

                if (errorMsg) {
                    setEventItem(null);
                    setEventItemError({
                        [IEventItemKeys.eventStart]: new Date(),
                        [IEventItemKeys.eventTitle]: Dict.error_type_server,
                        [IEventItemKeys.eventTopic]: Dict[errorMsg] ?? errorMsg
                    });
                } else {
                    const eventList = response.eventList;

                    setEventItem(eventList.length > 0 ? deserializeEventItem(eventList[0]) : null);
                    setEventItemError(eventList.length > 0 ? null : {
                        [IEventItemKeys.eventStart]: new Date(),
                        [IEventItemKeys.eventTitle]: Dict.error_type_parsing,
                        [IEventItemKeys.eventTopic]: Dict.error_message_try_later
                    });
                }
                
            },
            () => {
                fetchRequest.current = null;
                setEventItem(null);
                setEventItemError({
                    [IEventItemKeys.eventStart]: new Date(),
                    [IEventItemKeys.eventTitle]: Dict.error_type_network,
                    [IEventItemKeys.eventTopic]: Dict.error_message_try_later
                });
            }
        );
        fetchRequest.current.execute();
    }, [getCurrentEventId]);
    const changeTab = (event: React.ChangeEvent<{}>, value: number): void => {
        setTab(value);
    };

    useEffect(() => {
        fetchEventItem();
    }, [fetchEventItem]);

    const showEventItem = (): React.ReactElement => {
        if (tab === 0) {
            return <EventInfoSubPage eventItem={eventItem!} />
        } else if (tab === 1) {
            return <EventEnrollmentSubPage eventItem={eventItem!} refetchEventItem={fetchEventItem} />
        } else if (tab === 2) {
            return <EventImagesSubPage eventItem={eventItem} />
        } else if (tab === 3) {
            return <EventLocationSubPage eventItem={eventItem} />
        } else {
            return <EventListItem eventItem={eventItem} />
        }
    };
    const showEventError = (): React.ReactElement => {
        return (
            <EventListError
                eventItemError={eventItemError}
            />
        );
    };
    return (
        <>
            <Background theme={theme} withBottomNavigation={true}>
                {eventItemError ? showEventError() : showEventItem()}
            </Background>

            <AppBottomNavigation
                activeTab={tab}
                changeTab={changeTab}>
                <BottomNavigationAction icon={<Icon>info</Icon>} />
                <BottomNavigationAction icon={<Icon>people</Icon>} />
                <BottomNavigationAction icon={<Icon>panorama</Icon>} />
                <BottomNavigationAction icon={<Icon>location_on</Icon>} />
            </AppBottomNavigation>
        </>
    );
}

export default withTheme(EventItemPage);