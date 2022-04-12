import * as React from "react";
import { useNavigate, useParams } from "react-router";

import {
    BottomNavigationAction,
    Icon,
    Tooltip,
    withTheme,
    WithTheme,
} from "@material-ui/core";

import { Dict } from "../../constants/dict";
import { AppUrls } from "../../constants/specific-urls";
import {
    FetchEventItemDataRequest,
    IFetchEventItemDataResponse,
} from "../../networking/events/FetchEventItemDataRequest";
import IEventItem, {
    deserializeEventItem,
    IEventItemKeys,
} from "../../networking/events/IEventItem";
import EventListError from "../list_items/EventListError";
import EventListItem from "../list_items/EventListItem";
import AppBottomNavigation from "../navigation/menus/AppBottomNavigation";
import EventEnrollmentSubPage from "../subpages/EventEnrollmentSubPage";
import EventImagesSubPage from "../subpages/EventImagesSubPage";
import EventInfoSubPage from "../subpages/EventInfoSubPage";
import EventLocationSubPage from "../subpages/EventLocationSubPage";
import Background from "../utilities/Background";
import { useStateRequest } from "../utilities/CustomHooks";
import TwoWayMap from "../utilities/TwoWayMap";

type IEventItemPageProps = WithTheme & {
    isLoggedIn: boolean;
};

const EventItemPage = (props: IEventItemPageProps) => {
    const navigate = useNavigate();
    const params = useParams();
    const { isLoggedIn, theme } = props;
    const [eventItem, setEventItem] = React.useState<IEventItem>(null);
    const [eventItemError, setEventItemError] = React.useState<IEventItem>({
        [IEventItemKeys.eventStart]: new Date(),
        [IEventItemKeys.eventTitle]: Dict.label_loading,
        [IEventItemKeys.eventTopic]: Dict.label_wait,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [eventRequest, setEventRequest] = useStateRequest();

    const tabMap = React.useMemo(
        () =>
            new TwoWayMap({
                0: "info",
                1: "enrollment",
                2: "images",
                3: "location",
            }),
        []
    );
    const eventId = React.useMemo(() => parseInt(params.id, 10), [params.id]);
    const tabId = React.useMemo(
        () => parseInt(tabMap.revGet(params.tab) ?? 0, 10),
        [params.tab, tabMap]
    );
    const changeTab = React.useCallback(
        (event: React.ChangeEvent<{}>, value: number): void => {
            navigate(
                AppUrls.EVENTS_ITEM_TAB.replace(
                    ":id",
                    eventId.toString()
                ).replace(":tab", tabMap.get(value))
            );
        },
        [eventId, navigate, tabMap]
    );
    const fetchEventItem = React.useCallback((): void => {
        setEventRequest(
            new FetchEventItemDataRequest(
                eventId,
                (response: IFetchEventItemDataResponse) => {
                    const errorMsg = response.errorMsg;

                    if (errorMsg) {
                        setEventItem(null);
                        setEventItemError({
                            [IEventItemKeys.eventStart]: new Date(),
                            [IEventItemKeys.eventTitle]: Dict.error_type_server,
                            [IEventItemKeys.eventTopic]:
                                Dict[errorMsg] ?? errorMsg,
                        });
                    } else {
                        const eventList = response.eventList;

                        setEventItem(
                            eventList.length > 0
                                ? deserializeEventItem(eventList[0])
                                : null
                        );
                        setEventItemError(
                            eventList.length > 0
                                ? null
                                : {
                                      [IEventItemKeys.eventStart]: new Date(),
                                      [IEventItemKeys.eventTitle]:
                                          Dict.error_type_parsing,
                                      [IEventItemKeys.eventTopic]:
                                          Dict.error_message_try_later,
                                  }
                        );
                    }

                    setEventRequest(null);
                },
                () => {
                    setEventItem(null);
                    setEventItemError({
                        [IEventItemKeys.eventStart]: new Date(),
                        [IEventItemKeys.eventTitle]: Dict.error_type_network,
                        [IEventItemKeys.eventTopic]:
                            Dict.error_message_try_later,
                    });
                    setEventRequest(null);
                }
            )
        );
    }, [eventId, setEventRequest]);

    React.useEffect(() => {
        if (Number.isNaN(eventId)) {
            setEventItem(null);
            setEventItemError({
                [IEventItemKeys.eventStart]: new Date(),
                [IEventItemKeys.eventTitle]: Dict.error_type_client,
                [IEventItemKeys.eventTopic]: Dict.event_eventId_invalid,
            });
        } else {
            fetchEventItem();
        }
    }, [eventId, fetchEventItem]);

    const renderedEventItem = React.useMemo((): React.ReactElement<any> => {
        if (!eventItem) {
            return null;
        } else if (tabId === 0) {
            return <EventInfoSubPage eventItem={eventItem} />;
        } else if (tabId === 1) {
            return (
                <EventEnrollmentSubPage
                    eventItem={eventItem}
                    isLoggedIn={isLoggedIn}
                    refetchEventItem={fetchEventItem}
                />
            );
        } else if (tabId === 2) {
            return <EventImagesSubPage eventItem={eventItem} />;
        } else if (tabId === 3) {
            return <EventLocationSubPage eventItem={eventItem} />;
        } else {
            return <EventListItem eventItem={eventItem} />;
        }
    }, [eventItem, fetchEventItem, isLoggedIn, tabId]);
    const renderedEventError = React.useMemo((): React.ReactElement<any> => {
        return <EventListError eventItemError={eventItemError} />;
    }, [eventItemError]);
    return (
        <>
            <Background theme={theme} withBottomNavigation={true}>
                {eventItemError ? renderedEventError : renderedEventItem}
            </Background>

            <AppBottomNavigation activeTabId={tabId} changeTab={changeTab}>
                <Tooltip title={Dict.event_eventDetails}>
                    <BottomNavigationAction icon={<Icon>info</Icon>} />
                </Tooltip>
                <Tooltip title={Dict.event_eventEnrollment + " & " + Dict.event_participants_list}>
                    <BottomNavigationAction icon={<Icon>people</Icon>} />
                </Tooltip>
                <Tooltip title={Dict.image_available}>
                    <BottomNavigationAction icon={<Icon>panorama</Icon>} />
                </Tooltip>
                <Tooltip title={Dict.event_eventLocation}>
                    <BottomNavigationAction icon={<Icon>location_on</Icon>} />
                </Tooltip>
            </AppBottomNavigation>
        </>
    );
};

export default withTheme(EventItemPage);
