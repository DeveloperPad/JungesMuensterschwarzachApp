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
    participants: IUser[];
};

const ParticipantsList = (props: IParticipantsListProps) => {
    const { participants } = props;
    const showEmptyRow = (): React.ReactNode => {
        return (
            <TableRow>
                <TableCell>{Dict.event_participants_list_empty}</TableCell>
            </TableRow>
        );
    };
    const showParticipantRows = (): React.ReactNode => {
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
    };

    return (
        <>
            <Typography variant="body1">
                {Dict.event_participants_list +
                    " (" +
                    participants.length +
                    ")"}
            </Typography>

            <TableContainer>
                <Table size="small">
                    <TableBody>
                        {!participants || participants.length === 0
                            ? showEmptyRow()
                            : showParticipantRows()}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ParticipantsList;
