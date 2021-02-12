import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import {
    Accordion, AccordionDetails, AccordionSummary, Icon, Typography, withTheme, WithTheme
} from '@material-ui/core';

import Dict from '../../constants/dict';
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

type IEventListPageProps = RouteComponentProps<any, StaticContext> & WithTheme;

interface IEventListPageState {
    fetchEventListDataRequest: FetchEventListDataRequest|null;
    eventListError: IEventItem | null; // fake item to display errors
    ongoingEventList: IEventItem[];
    pastEventList: IEventItem[];
    upcomingEventList: IEventItem[];
}

class EventListPage extends React.Component<IEventListPageProps, IEventListPageState> {

    private expansionPanelDetailsStyle: React.CSSProperties = {
        flexDirection: "column"
    };
    private expansionPanelDetailsInnerStyle: React.CSSProperties = {
        paddingTop: this.props.theme.spacing()
    };

    constructor(props: IEventListPageProps) {
        super(props);

        this.state = {
            fetchEventListDataRequest: null,
            eventListError: {
                [IEventItemKeys.eventStart]: new Date(),
                [IEventItemKeys.eventTitle]: Dict.label_loading,
                [IEventItemKeys.eventTopic]: Dict.label_wait
            },
            ongoingEventList: [],
            pastEventList: [],
            upcomingEventList: []
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
                fetchEventListDataRequest: new FetchEventListDataRequest(
                    (response: IFetchEventListDataResponse) => {
                        const errorMsg = response.errorMsg;

                        if (errorMsg) {
                            this.setState({
                                fetchEventListDataRequest: null,
                                eventListError: {
                                    eventStart: new Date(),
                                    eventTitle: Dict.error_type_server,
                                    eventTopic: Dict.hasOwnProperty(errorMsg) ? Dict[errorMsg] : errorMsg,
                                },
                                ongoingEventList: [],
                                pastEventList: [],
                                upcomingEventList: []
                            });
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

                            this.setState({
                                fetchEventListDataRequest: null,
                                eventListError: null,
                                ongoingEventList,
                                pastEventList,
                                upcomingEventList
                            });
                        }
                    },
                    () => {
                        this.setState({
                            fetchEventListDataRequest: null,
                            eventListError: {
                                [IEventItemKeys.eventStart]: new Date(),
                                [IEventItemKeys.eventTitle]: Dict.error_type_network,
                                [IEventItemKeys.eventTopic]: Dict.error_message_try_later
                            },
                            ongoingEventList: [],
                            pastEventList: [],
                            upcomingEventList: []
                        });
                    }
                )
            };
        });
    }

    public componentDidUpdate(prevProps: IEventListPageProps, prevState: IEventListPageState): void {
        if (this.state.fetchEventListDataRequest) {
            this.state.fetchEventListDataRequest.execute();
        }
    }

    public componentWillUnmount(): void {
        if (this.state.fetchEventListDataRequest) {
            this.state.fetchEventListDataRequest.cancel();
        }
    }

    public render(): React.ReactNode {
        return (
            <Background theme={this.props.theme}>
                {this.state.eventListError ? this.showEventError() : this.showEventLists()}
            </Background>
        );
    }

    private showEventError = (): React.ReactNode => {
        return (
            <EventListError
                eventItemError={this.state.eventListError!}
            />
        );
    }

    private showEventLists = (): React.ReactNode => {
        const ongoingEventListNodes: React.ReactNode[] = this.state.ongoingEventList.map(eventItem => {
            return (
                <EventListItem
                    eventItem={eventItem}
                    key={eventItem[IEventItemKeys.eventId]}
                />
            );
        });
        const upcomingEventListNodes: React.ReactNode[] = this.state.upcomingEventList.map(eventItem => {
            return (
                <EventListItem
                    eventItem={eventItem}
                    key={eventItem[IEventItemKeys.eventId]}
                />
            );
        });
        const pastEventListNodes: React.ReactNode[] = this.state.pastEventList.map(eventItem => {
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
                            style={this.expansionPanelDetailsStyle}>
                            <div style={this.expansionPanelDetailsInnerStyle}>
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
                            style={this.expansionPanelDetailsStyle}>
                            <div style={this.expansionPanelDetailsInnerStyle}>
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
                            style={this.expansionPanelDetailsStyle}>
                            <div style={this.expansionPanelDetailsInnerStyle}>
                                {pastEventListNodes}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                )}
            </>
        );
    }

}

export default withTheme(withRouter(EventListPage));