import * as React from 'react';
import { useNavigate } from 'react-router';

import {
    Accordion, AccordionDetails, AccordionSummary, Icon, Typography, withTheme, WithTheme
} from '@material-ui/core';

import { Dict } from '../../constants/dict';
import { AppUrls } from '../../constants/specific-urls';
import { IUserKeys } from '../../networking/account_data/IUser';
import {
    FetchEventListDataRequest, IFetchEventListDataResponse
} from '../../networking/events/FetchEventListDataRequest';
import IEventItem, {
    deserializeEventItem, IEventItemKeys
} from '../../networking/events/IEventItem';
import { CookieService } from '../../services/CookieService';
import EventListError from '../list_items/EventListError';
import EventListItem from '../list_items/EventListItem';
import Background from '../utilities/Background';
import { useEffect, useRef } from 'react';
import { useState } from 'react';

type IEventListPageProps = WithTheme;

const EventListPage = (props: IEventListPageProps) => {
    const { theme } = props;

    const fetchRequest = useRef<FetchEventListDataRequest|null>(null);
    const [eventListError, setEventListError] = useState<IEventItem|null>({
        [IEventItemKeys.eventStart]: new Date(),
        [IEventItemKeys.eventTitle]: Dict.label_loading,
        [IEventItemKeys.eventTopic]: Dict.label_wait
    });
    const [ongoingEventList, setOngoingEventList] = useState<IEventItem[]>([]);
    const [pastEventList, setPastEventList] = useState<IEventItem[]>([]);
    const [upcomingEventList, setUpcomingEventList] = useState<IEventItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        CookieService.get<number>(IUserKeys.accessLevel)
            .then(accessLevel => {
                if (accessLevel === null) {
                    navigate(AppUrls.LOGIN);
                }
            })
            .catch(error => {
                navigate(AppUrls.LOGIN);
            });
    }, [navigate]);
    useEffect(() => {
        if (fetchRequest.current) {
            fetchRequest.current.cancel();
        }

        fetchRequest.current = new FetchEventListDataRequest(
            (response: IFetchEventListDataResponse) => {
                fetchRequest.current = null;

                const errorMsg = response.errorMsg;

                if (errorMsg) {
                    setEventListError({
                        eventStart: new Date(),
                        eventTitle: Dict.error_type_server,
                        eventTopic: Dict[errorMsg] ?? errorMsg,
                    });
                    setOngoingEventList([]);
                    setPastEventList([]);
                    setUpcomingEventList([]);
                } else {
                    const eventList = response.eventList;
                    const now = new Date();
                    const ongoingEventList: IEventItem[] = [];
                    const upcomingEventList: IEventItem[] = [];
                    const pastEventList: IEventItem[] = [];

                    for (const eventItem of eventList) {
                        const deserializedEventItem = deserializeEventItem(eventItem);

                        if (now < deserializedEventItem[IEventItemKeys.eventStart]!) {
                            upcomingEventList.push(deserializedEventItem);
                        } else if (deserializedEventItem[IEventItemKeys.eventEnd]! < now) {
                            pastEventList.push(deserializedEventItem);
                        } else {
                            ongoingEventList.push(deserializedEventItem);
                        }
                    }

                    setEventListError(null);
                    setOngoingEventList(ongoingEventList);
                    setPastEventList(pastEventList);
                    setUpcomingEventList(upcomingEventList);
                }
            },
            () => {
                fetchRequest.current = null;
                setEventListError({
                    [IEventItemKeys.eventStart]: new Date(),
                    [IEventItemKeys.eventTitle]: Dict.error_type_network,
                    [IEventItemKeys.eventTopic]: Dict.error_message_try_later
                });
                setOngoingEventList([]);
                setPastEventList([]);
                setUpcomingEventList([]);
            }
        );
        fetchRequest.current.execute();
    }, []);

    const showEventError = (): React.ReactElement => {
        return (
            <EventListError eventItemError={eventListError}/>
        );
    }
    const showEventLists = (): React.ReactElement => {
        const ongoingEventListNodes: React.ReactNode[] = ongoingEventList.map(eventItem => {
            return (
                <EventListItem
                    eventItem={eventItem}
                    key={eventItem[IEventItemKeys.eventId]}
                />
            );
        });
        const upcomingEventListNodes: React.ReactNode[] = upcomingEventList.map(eventItem => {
            return (
                <EventListItem
                    eventItem={eventItem}
                    key={eventItem[IEventItemKeys.eventId]}
                />
            );
        });
        const pastEventListNodes: React.ReactNode[] = pastEventList.map(eventItem => {
            return (
                <EventListItem
                    eventItem={eventItem}
                    key={eventItem[IEventItemKeys.eventId]}
                />
            );
        });

        return (
            <>
                {ongoingEventListNodes.length === 0 ? null : (
                    <Accordion
                        defaultExpanded={true}>
                        <AccordionSummary
                            expandIcon={<Icon>keyboard_arrow_down</Icon>}>
                            <Typography
                                color="error"
                                variant="h5">
                                {Dict.navigation_events_ongoing}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            style={{
                                flexDirection: "column"
                            }}>
                            <div style={{
                                paddingTop: theme.spacing()
                            }}>
                                {ongoingEventListNodes}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                )}
    
                {upcomingEventListNodes.length === 0 ? null : (
                    <Accordion
                        defaultExpanded={true}>
                        <AccordionSummary
                            expandIcon={<Icon>keyboard_arrow_down</Icon>}>
                            <Typography
                                color="textSecondary"
                                variant="h5">
                                {Dict.navigation_events_upcoming}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            style={{
                                flexDirection: "column"
                            }}>
                            <div style={{
                                paddingTop: theme.spacing()
                            }}>
                                {upcomingEventListNodes}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                )}
    
                {pastEventListNodes.length === 0 ? null : (
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<Icon>keyboard_arrow_down</Icon>}>
                            <Typography
                                color="textSecondary"
                                variant="h5">
                                {Dict.navigation_events_past}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            style={{
                                flexDirection: "column"
                            }}>
                            <div style={{
                                paddingTop: theme.spacing()
                            }}>
                                {pastEventListNodes}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                )}
            </>
        );  
    };

    return (
        <Background theme={theme}>
            {eventListError ? showEventError() : showEventLists()}
        </Background>
    );
}

export default withTheme(EventListPage);