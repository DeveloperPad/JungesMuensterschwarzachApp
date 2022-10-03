import * as React from "react";

import {
    Card,
    CardContent,
    Typography,
    withTheme,
    WithTheme,
} from "@mui/material";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { formatDate } from "../../constants/global-functions";
import { CustomTheme } from "../../constants/theme";
import IEventItem, { IEventItemKeys } from "../../networking/events/IEventItem";

type IEventInfoSubPageProps = WithTheme & {
    eventItem: IEventItem;
};

const EventInfoSubPage = (props: IEventInfoSubPageProps) => {
    const { eventItem, theme } = props;

    const contentIndentationStyle: React.CSSProperties = React.useMemo(() => ({
        marginLeft: theme.spacing(2),
    }), [theme]);
    const lowerSeparatorStyle: React.CSSProperties = React.useMemo(() => ({
        height: theme.spacing(),
    }), [theme]);

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

                <Typography gutterBottom={true} variant="subtitle1">
                    {eventItem[IEventItemKeys.eventTopic]}
                </Typography>

                <hr />

                <Typography
                    className="normalize"
                    gutterBottom={true}
                    dangerouslySetInnerHTML={{
                        __html: eventItem.eventDetails,
                    }}
                />

                <div style={lowerSeparatorStyle} />
                <hr />

                <Typography variant="body1">{Dict.event_eventStart}</Typography>
                <Typography style={contentIndentationStyle}>
                    {formatDate(
                        eventItem[IEventItemKeys.eventStart]!,
                        Formats.DATE.DATETIME_LOCAL
                    )}
                </Typography>

                <div style={lowerSeparatorStyle} />

                <Typography variant="body1">{Dict.event_eventEnd}</Typography>
                <Typography style={contentIndentationStyle}>
                    {formatDate(
                        eventItem[IEventItemKeys.eventEnd]!,
                        Formats.DATE.DATETIME_LOCAL
                    )}
                </Typography>

                <div style={lowerSeparatorStyle} />

                <Typography variant="body1">
                    {Dict.event_eventLocation}
                </Typography>
                <Typography style={contentIndentationStyle}>
                    {eventItem[IEventItemKeys.eventLocationTitle]}
                </Typography>

                <div style={lowerSeparatorStyle} />

                <Typography variant="body1">
                    {Dict.event_eventTargetGroup}
                </Typography>
                <Typography style={contentIndentationStyle}>
                    {eventItem[IEventItemKeys.eventTargetGroupContent]}
                </Typography>

                <hr />
                <div style={lowerSeparatorStyle} />

                <Typography variant="body1">{Dict.event_eventOffer}</Typography>
                <Typography gutterBottom={true} style={contentIndentationStyle}>
                    {eventItem[IEventItemKeys.eventOfferContent]}
                </Typography>

                <div style={lowerSeparatorStyle} />

                <Typography variant="body1">
                    {Dict.event_eventSchedule}
                </Typography>
                <Typography gutterBottom={true} style={contentIndentationStyle}>
                    {eventItem[IEventItemKeys.eventScheduleContent]}
                </Typography>

                <div style={lowerSeparatorStyle} />

                <Typography variant="body1">{Dict.event_eventPrice}</Typography>
                <Typography gutterBottom={true} style={contentIndentationStyle}>
                    {eventItem[IEventItemKeys.eventPriceContent]}
                </Typography>

                <div style={lowerSeparatorStyle} />

                <Typography variant="body1">
                    {Dict.event_eventPackingList}
                </Typography>
                <Typography gutterBottom={true} style={contentIndentationStyle}>
                    {eventItem[IEventItemKeys.eventPackingListContent]}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default withTheme(EventInfoSubPage);
