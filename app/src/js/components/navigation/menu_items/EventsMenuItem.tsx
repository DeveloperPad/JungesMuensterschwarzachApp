import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { MenuItem } from '@material-ui/core';

import { Dict } from '../../../constants/dict';
import { AppUrls } from '../../../constants/specific-urls';

type EventsMenuItemProps = RouteComponentProps<any, StaticContext> & {
    divider?: boolean
};

class EventsMenuItem extends React.Component<EventsMenuItemProps> {

    public render(): React.ReactNode {
        return (
            <MenuItem
                button={true}
                divider={this.props.divider || false}
                onClick={this.forward}>
                <span>{Dict.navigation_events}</span>
            </MenuItem>
        );
    }

    private forward = (): void => {
        this.props.history.push(
            AppUrls.EVENTS
        );
    }

}

export default withRouter(EventsMenuItem);