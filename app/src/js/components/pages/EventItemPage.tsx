import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { BottomNavigationAction, Icon, withTheme, WithTheme } from '@material-ui/core';

import Dict from '../../constants/dict';
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

type IEventItemPageProps = RouteComponentProps<any, StaticContext> & WithTheme;

interface IEventItemPageState {
    fetchEventItemDataRequest: FetchEventItemDataRequest | null;
    eventItem: IEventItem | null;
    eventItemError: IEventItem | null;
    tab: number;
}

class EventItemPage extends React.Component<IEventItemPageProps, IEventItemPageState> {

    constructor(props: IEventItemPageProps) {
        super(props);

        this.state = {
            fetchEventItemDataRequest: null,
            eventItem: null,
            eventItemError: {
                [IEventItemKeys.eventStart]: new Date(),
                [IEventItemKeys.eventTitle]: Dict.label_loading,
                [IEventItemKeys.eventTopic]: Dict.label_wait
            },
            tab: 0
        };
    }

    public componentDidMount(): void {
        this.fetchEventItem();
    }

    public componentDidUpdate(prevProps: IEventItemPageProps, prevState: IEventItemPageState): void {
        if (this.state.fetchEventItemDataRequest) {
            this.state.fetchEventItemDataRequest.execute();
        }
    }

    public componentWillUnmount(): void {
        if (this.state.fetchEventItemDataRequest) {
            this.state.fetchEventItemDataRequest.cancel();
        }
    }

    public render(): React.ReactNode {
        return (
            <>
                <Background theme={this.props.theme} withBottomNavigation={true}>
                    {this.state.eventItemError ? this.showEventError() : this.showEventItem()}
                </Background>

                <AppBottomNavigation
                    activeTab={this.state.tab}
                    changeTab={this.changeTab}>
                    <BottomNavigationAction icon={<Icon>info</Icon>} />
                    <BottomNavigationAction icon={<Icon>people</Icon>} />
                    <BottomNavigationAction icon={<Icon>panorama</Icon>} />
                    <BottomNavigationAction icon={<Icon>location_on</Icon>} />
                </AppBottomNavigation>
            </>
        );
    }

    private showEventError = (): React.ReactNode => {
        return (
            <EventListError
                eventItemError={this.state.eventItemError!}
            />
        );
    }

    private showEventItem = (): React.ReactNode => {
        if (this.state.tab === 0) {
            return <EventInfoSubPage eventItem={this.state.eventItem!} />
        } else if (this.state.tab === 1) {
            return <EventEnrollmentSubPage eventItem={this.state.eventItem!} refetchEventItem={this.fetchEventItem} />
        } else if (this.state.tab === 2) {
            return <EventImagesSubPage eventItem={this.state.eventItem!} />
        } else if (this.state.tab === 3) {
            return <EventLocationSubPage eventItem={this.state.eventItem!} />
        } else {
            return <EventListItem eventItem={this.state.eventItem!} />
        }
    }

    private fetchEventItem = (): void => {
        this.setState(prevState => {
            return {
                ...prevState,
                fetchEventItemDataRequest: new FetchEventItemDataRequest(
                    this.getCurrentEventId(),
                    (response: IFetchEventItemDataResponse) => {
                        const errorMsg = response.errorMsg;
        
                        if (errorMsg) {
                            this.setState(prevState => {
                                return {
                                    ...prevState,
                                    fetchEventItemDataRequest: null,
                                    eventItem: null,
                                    eventItemError: {
                                        [IEventItemKeys.eventStart]: new Date(),
                                        [IEventItemKeys.eventTitle]: Dict.error_type_server,
                                        [IEventItemKeys.eventTopic]: Dict.hasOwnProperty(errorMsg) ? Dict[errorMsg] : errorMsg
                                    },
                                };
                            });
                        } else {
                            const eventList = response.eventList;
        
                            this.setState(prevState => {
                                return {
                                    ...prevState,
                                    fetchEventItemDataRequest: null,
                                    eventItem: eventList.length > 0 ? deserializeEventItem(eventList[0]) : null,
                                    eventItemError: eventList.length > 0 ? null : {
                                        [IEventItemKeys.eventStart]: new Date(),
                                        [IEventItemKeys.eventTitle]: Dict.error_type_parsing,
                                        [IEventItemKeys.eventTopic]: Dict.error_message_try_later
                                    }
                                };
                            });
                        }
                    },
                    () => {
                        this.setState(prevState => {
                            return {
                                ...prevState,
                                fetchEventItemDataRequest: null,
                                eventItem: null,
                                eventItemError: {
                                    [IEventItemKeys.eventStart]: new Date(),
                                    [IEventItemKeys.eventTitle]: Dict.error_type_network,
                                    [IEventItemKeys.eventTopic]: Dict.error_message_try_later
                                }
                            }
                        });
                    }
                )
            }
        });
    }

    private getCurrentEventId = (): number => {
        return parseInt(this.props.location.pathname.slice((AppUrls.EVENTS + "/").length), 10);
    }

    private changeTab = (event: React.ChangeEvent, value: number): void => {
        this.setState(prevState => {
            return {
                ...prevState,
                tab: value
            }
        });
    }

}

export default withTheme(withRouter(EventItemPage));