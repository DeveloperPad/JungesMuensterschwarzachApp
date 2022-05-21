import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@material-ui/core";
import * as React from "react";
import { Dict } from "../../constants/dict";
import IUser, { IUserKeys } from "../../networking/account_data/IUser";
import Badge from "../utilities/Badge";

type IParticipantsListProps = {
    emptyMsg?: string;
    participants: IUser[];
    title?: string;
};

const ParticipantsList = (props: IParticipantsListProps) => {
    const { emptyMsg, participants, title } = props;
    const emptyRow = React.useMemo((): React.ReactNode => {
        return (
            <TableRow>
                <TableCell>{emptyMsg ?? Dict.event_participants_list_empty}</TableCell>
            </TableRow>
        );
    }, [emptyMsg]);
    const participantsRows = React.useMemo((): React.ReactNode => {
        return participants.map((participant: IUser) => {
            return (
                <TableRow key={participant[IUserKeys.userId]}>
                    <TableCell
                        style={{
                            width: "1px",
                        }}
                        align="center"
                    >
                        <Badge accessLevel={participant.accessLevel} />
                    </TableCell>
                    <TableCell>{participant[IUserKeys.displayName]}</TableCell>
                </TableRow>
            );
        });
    }, [participants]);

    return (
        <>
            <Typography variant="body1">
                {(title ?? Dict.event_participants_list) +
                    " (" +
                    participants.length +
                    ")"}
            </Typography>

            <TableContainer>
                <Table size="small">
                    <TableBody>
                        {!participants || participants.length === 0
                            ? emptyRow
                            : participantsRows}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ParticipantsList;
