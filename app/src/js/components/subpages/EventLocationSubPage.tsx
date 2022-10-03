import * as React from "react";

import {
    Card,
    CardContent,
    Typography,
    WithTheme,
    withTheme,
} from "@mui/material";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { formatDate } from "../../constants/global-functions";
import { CustomTheme } from "../../constants/theme";
import IEventItem, { IEventItemKeys } from "../../networking/events/IEventItem";
import Map from "../utilities/Map";
import MapMarker from "../utilities/MapMarker";

type IEventLocationSubPageProps = WithTheme & {
    eventItem: IEventItem;
};

const EventLocationSubPage = (props: IEventLocationSubPageProps) => {
    const { eventItem, theme } = props;

    return (
        <Card
            key={eventItem[IEventItemKeys.eventId]}
            style={{
                backgroundColor: CustomTheme.COLOR_BODY_INNER,
                display: "flex",
                flex: 1,
                marginBottom: theme.spacing(),
                width: "100%",
            }}
        >
            <CardContent
                style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "100%",
                }}
            >
                <div>
                    <div
                        style={{
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="caption">
                            {formatDate(
                                eventItem[
                                    IEventItemKeys.eventModificationDate
                                ]!,
                                Formats.DATE.TIME_LOCAL
                            )}
                        </Typography>
                        <Typography variant="caption">
                            {formatDate(
                                eventItem[
                                    IEventItemKeys.eventModificationDate
                                ]!,
                                Formats.DATE.DATE_LOCAL
                            )}
                        </Typography>
                    </div>

                    <hr />

                    <Typography
                        color="primary"
                        gutterBottom={true}
                        variant="h5"
                    >
                        {eventItem[IEventItemKeys.eventTitle]}
                    </Typography>

                    <hr />
                </div>

                <div>
                    <Typography variant="body1">
                        {Dict.event_eventArrival}
                    </Typography>
                    <Typography
                        style={{
                            marginLeft: theme.spacing(2),
                        }}
                    >
                        {eventItem[IEventItemKeys.eventArrivalContent]!}
                    </Typography>
                </div>

                <div
                    style={{
                        height: theme.spacing(),
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <Map
                        latitude={eventItem.eventLocationLatitude}
                        longitude={eventItem.eventLocationLongitude}
                    >
                        <MapMarker
                            latitude={eventItem.eventLocationLatitude}
                            longitude={eventItem.eventLocationLongitude}
                            title={eventItem[IEventItemKeys.eventLocationTitle]}
                        />
                    </Map>
                </div>
            </CardContent>
        </Card>
    );
};

export default withTheme(EventLocationSubPage);
