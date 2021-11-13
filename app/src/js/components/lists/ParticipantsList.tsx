import { Table, TableBody, TableCell, TableContainer, TableRow, Typography, withTheme, WithTheme } from '@material-ui/core';
import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';
import { Dict } from '../../constants/dict';
import IUser, { IUserKeys } from '../../networking/account_data/IUser';
import Badge from '../utilities/Badge';



type IParticipantsListProps = RouteComponentProps<any, StaticContext> & WithTheme & {
    participants: IUser[];
}

class ParticipantsList extends React.Component<IParticipantsListProps> {

    accessLevelTableCellStyle: React.CSSProperties = {
        width: "1px"
    }

    public render(): React.ReactNode {
        return (
            <>
                <Typography
                    variant="body1"
                >
                    {Dict.event_participants_list + " (" + this.props.participants.length + ")"}
                </Typography>

                <TableContainer>
                    <Table size="small">
                        <TableBody>
                            {!this.props.participants || this.props.participants.length === 0 ? 
                                this.showEmptyRow() : this.showParticipantRows()}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    }

    private showEmptyRow = (): React.ReactNode => {
        return (
            <TableRow>
                <TableCell>
                    {Dict.event_participants_list_empty}
                </TableCell>
            </TableRow>
        );
    }

    private showParticipantRows = (): React.ReactNode => {
        return this.props.participants.map((participant: IUser) => {
            return (
                <TableRow key={participant[IUserKeys.userId]}>
                    <TableCell style={this.accessLevelTableCellStyle} align="center">
                        <Badge accessLevel={participant.accessLevel}/>
                    </TableCell>
                    <TableCell>
                        {participant[IUserKeys.displayName]}
                    </TableCell>
                </TableRow>
            );
        });
    }

}

export default withTheme(withRouter(ParticipantsList));