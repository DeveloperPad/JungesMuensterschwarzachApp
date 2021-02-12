import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import {
    Avatar, Icon, List, ListItem, ListItemText, Typography, withTheme, WithTheme
} from '@material-ui/core';

import Dict from '../../constants/dict';
import IUser, { IUserKeys } from '../../networking/account_data/IUser';

type IParticipantsListProps = RouteComponentProps<any, StaticContext> & WithTheme & {
    participants: IUser[];
}

class ParticipantsList extends React.Component<IParticipantsListProps> {

    public render(): React.ReactNode {
        return (
            <>
                <Typography
                    variant="body1"
                >
                    {Dict.event_participants_list}
                </Typography>

                <List>
                    {!this.props.participants || this.props.participants.length === 0 ? this.showEmptyListItem() : this.showParticipantsListItems()}
                </List>
            </>
        );
    }

    private showEmptyListItem = (): React.ReactNode => {
        return (
            <ListItem
                dense={true}
                button={true}
            >
                <ListItemText primary={Dict.event_participants_list_empty} />
            </ListItem>
        );
    }

    private showParticipantsListItems = (): React.ReactNode => {
        return this.props.participants.map((participant: IUser) => {
            return (
                <ListItem
                    key={participant[IUserKeys.userId]}
                    dense={true}
                    button={true}
                >
                    <Avatar>
                        <Icon>person</Icon>
                    </Avatar>
                    <ListItemText primary={participant[IUserKeys.displayName]} />
                </ListItem>
            );
        });
    }

}

export default withTheme(withRouter(ParticipantsList));