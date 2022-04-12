import * as React from "react";
import { useNavigate } from "react-router";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Icon,
    Typography,
    withTheme,
    WithTheme,
} from "@material-ui/core";

import { Dict } from "../../constants/dict";
import { AppUrls } from "../../constants/specific-urls";
import { IUserKeys } from "../../networking/account_data/IUser";
import {
    FetchEventListDataRequest,
    IFetchEventListDataResponse,
} from "../../networking/events/FetchEventListDataRequest";
import IEventItem, {
    deserializeEventItem,
    IEventItemKeys,
} from "../../networking/events/IEventItem";
import { CookieService } from "../../services/CookieService";
import EventListError from "../list_items/EventListError";
import EventListItem from "../list_items/EventListItem";
import Background from "../utilities/Background";
import { useStateRequest } from "../utilities/CustomHooks";

type IEventListPageProps = WithTheme;

const EventListPage = (props: IEventListPageProps) => {
    const navigate = useNavigate();
    const { theme } = props;
    const [eventList, setEventList] = React.useState<IEventItem[]>([]);
    const [eventListError, setEventListError] =
        React.useState<IEventItem | null>({
            [IEventItemKeys.eventStart]: new Date(),
            [IEventItemKeys.eventTitle]: Dict.label_loading,
            [IEventItemKeys.eventTopic]: Dict.label_wait,
        });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [fetchRequest, setFetchRequest] = useStateRequest();

    React.useEffect(() => {
        CookieService.get<number>(IUserKeys.accessLevel)
            .then((accessLevel) => {
                if (accessLevel === null) {
                    navigate(AppUrls.LOGIN);
                }
            })
            .catch((error) => {
                navigate(AppUrls.LOGIN);
            });

        setFetchRequest(
            new FetchEventListDataRequest(
                (response: IFetchEventListDataResponse) => {
                    const errorMsg = response.errorMsg;

                    if (errorMsg) {
                        setEventList([]);
                        setEventListError({
                            eventStart: new Date(),
                            eventTitle: Dict.error_type_server,
                            eventTopic: Dict[errorMsg] ?? errorMsg,
                        });
                    } else {
                        setEventList(response.eventList);
                        setEventListError(null);
                    }

                    setFetchRequest(null);
                },
                () => {
                    setEventList([]);
                    setEventListError({
                        [IEventItemKeys.eventStart]: new Date(),
                        [IEventItemKeys.eventTitle]: Dict.error_type_network,
                        [IEventItemKeys.eventTopic]:
                            Dict.error_message_try_later,
                    });

                    setFetchRequest(null);
                }
            )
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderedEventError = React.useMemo((): React.ReactElement => {
        return <EventListError eventItemError={eventListError} />;
    }, [eventListError]);
    const renderedEventLists = React.useMemo((): React.ReactElement => {
        const now = new Date();
        const pastEventList: React.ReactElement<any>[] = eventList.flatMap(
            (event) => {
                const eventItem = deserializeEventItem(event);

                return eventItem[IEventItemKeys.eventEnd] < now
                    ? [
                          <EventListItem
                              eventItem={eventItem}
                              key={eventItem[IEventItemKeys.eventId]}
                          />,
                      ]
                    : [];
            }
        );
        const ongoingEventList: React.ReactElement<any>[] = eventList.flatMap(
            (event) => {
                const eventItem = deserializeEventItem(event);

                return eventItem[IEventItemKeys.eventStart] <= now &&
                    now <= eventItem[IEventItemKeys.eventEnd]
                    ? [
                          <EventListItem
                              eventItem={eventItem}
                              key={eventItem[IEventItemKeys.eventId]}
                          />,
                      ]
                    : [];
            }
        );
        const upcomingEventList: React.ReactElement<any>[] = eventList.flatMap(
            (event) => {
                const eventItem = deserializeEventItem(event);

                return now < eventItem[IEventItemKeys.eventStart]
                    ? [
                          <EventListItem
                              eventItem={eventItem}
                              key={eventItem[IEventItemKeys.eventId]}
                          />,
                      ]
                    : [];
            }
        );

        return (
            <>
                {ongoingEventList.length === 0 ? null : (
                    <Accordion defaultExpanded={true}>
                        <AccordionSummary
                            expandIcon={<Icon>keyboard_arrow_down</Icon>}
                        >
                            <Typography color="error" variant="h5">
                                {Dict.navigation_events_ongoing}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            style={{
                                flexDirection: "column",
                            }}
                        >
                            <div
                                style={{
                                    paddingTop: theme.spacing(),
                                }}
                            >
                                {ongoingEventList}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                )}

                {upcomingEventList.length === 0 ? null : (
                    <Accordion defaultExpanded={true}>
                        <AccordionSummary
                            expandIcon={<Icon>keyboard_arrow_down</Icon>}
                        >
                            <Typography color="textSecondary" variant="h5">
                                {Dict.navigation_events_upcoming}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            style={{
                                flexDirection: "column",
                            }}
                        >
                            <div
                                style={{
                                    paddingTop: theme.spacing(),
                                }}
                            >
                                {upcomingEventList}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                )}

                {pastEventList.length === 0 ? null : (
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<Icon>keyboard_arrow_down</Icon>}
                        >
                            <Typography color="textSecondary" variant="h5">
                                {Dict.navigation_events_past}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            style={{
                                flexDirection: "column",
                            }}
                        >
                            <div
                                style={{
                                    paddingTop: theme.spacing(),
                                }}
                            >
                                {pastEventList}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                )}
            </>
        );
    }, [eventList, theme]);

    return (
        <Background theme={theme}>
            {eventListError ? renderedEventError : renderedEventLists}
        </Background>
    );
};

export default withTheme(EventListPage);
