import {
    Card,
    CardContent,
    Typography,
    withTheme,
    WithTheme,
} from "@mui/material";
import * as React from "react";
import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { formatDate } from "../../constants/global-functions";
import { CustomTheme } from "../../constants/theme";
import { IUserKeys, IUserValues } from "../../networking/account_data/IUser";
import IEventItem, { IEventItemKeys } from "../../networking/events/IEventItem";
import EventEnrollmentForm from "../forms/EventEnrollmentForm";
import ParticipantsList from "../lists/ParticipantsList";

type IEventEnrollmentSubPageProps = WithTheme & {
    eventItem: IEventItem;
    isLoggedIn: boolean;
    refetchEventItem: () => void;
};

const EventEnrollmentSubPage = (props: IEventEnrollmentSubPageProps) => {
    const { eventItem, isLoggedIn, refetchEventItem, theme } = props;

    const participantsList = eventItem[IEventItemKeys.eventParticipants].filter(
        (user) => user.accessLevel < IUserValues[IUserKeys.accessLevel].editor
    );
    const courseInstructor = eventItem[IEventItemKeys.eventParticipants].filter(
        (user) => user.accessLevel >= IUserValues[IUserKeys.accessLevel].editor
    );

    return (
        <Card
            key={eventItem[IEventItemKeys.eventId]}
            style={{
                backgroundColor: CustomTheme.COLOR_BODY_INNER,
                display: "flex",
                marginBottom: theme.spacing(),
                width: "100%",
            }}
        >
            <CardContent
                style={{
                    margin: "auto",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography variant="caption">
                        {formatDate(
                            eventItem[IEventItemKeys.eventModificationDate]!,
                            Formats.DATE.TIME_LOCAL
                        )}
                    </Typography>
                    <Typography variant="caption">
                        {formatDate(
                            eventItem[IEventItemKeys.eventModificationDate]!,
                            Formats.DATE.DATE_LOCAL
                        )}
                    </Typography>
                </div>

                <hr />

                <Typography color="primary" gutterBottom={true} variant="h5">
                    {eventItem[IEventItemKeys.eventTitle]}
                </Typography>

                <hr />

                <EventEnrollmentForm
                    eventItem={eventItem}
                    isLoggedIn={isLoggedIn}
                    refetchEventItem={refetchEventItem}
                />

                <hr />

                <div
                    style={{
                        height: theme.spacing(),
                    }}
                />

                <ParticipantsList
                    participants={participantsList}
                />

                <div
                    style={{
                        height: theme.spacing(),
                    }}
                />

                <ParticipantsList
                    emptyMsg={Dict.event_participants_list_courseInstructors_empty}
                    participants={courseInstructor}
                    title={Dict.event_participants_list_courseInstructors}
                />
            </CardContent>
        </Card>
    );
};

export default withTheme(EventEnrollmentSubPage);
