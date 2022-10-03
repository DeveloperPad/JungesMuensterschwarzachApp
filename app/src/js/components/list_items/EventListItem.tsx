import * as React from "react";
import { useNavigate } from "react-router";

import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    withTheme,
    WithTheme,
} from "@mui/material";

import StandardThumbnail from "../../../assets/images/logo_colored.png";
import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { formatDate } from "../../constants/global-functions";
import { AppUrls } from "../../constants/specific-urls";
import { CustomTheme, grid7Style } from "../../constants/theme";
import IEventItem, { IEventItemKeys } from "../../networking/events/IEventItem";
import { ConfigService } from "../../services/ConfigService";

type IEventListItemProps = WithTheme & {
    eventItem: IEventItem;
};

const EventListItem = (props: IEventListItemProps) => {
    const navigate = useNavigate();
    const { eventItem, theme } = props;

    const openEventItem = React.useCallback((): void => {
        const eventId = eventItem[IEventItemKeys.eventId];

        if (eventId >= 0) {
            navigate(AppUrls.EVENTS_LIST + "/" + eventId);
        }
    }, [eventItem, navigate]);

    return (
        <Card
            key={eventItem[IEventItemKeys.eventId]}
            onClick={openEventItem}
            style={{
                backgroundColor: CustomTheme.COLOR_BODY_INNER,
                cursor: "pointer",
                display: "flex",
                marginBottom: theme.spacing(),
                width: "100%",
            }}
        >
            <div style={grid7Style}>
                <CardMedia
                    component="img"
                    src={
                        eventItem[IEventItemKeys.imageIds] &&
                        eventItem[IEventItemKeys.imageIds]!.length >= 1
                            ? ConfigService.getConfig().BaseUrls.WEBSERVICE +
                              "/" +
                              eventItem[IEventItemKeys.imageIds]![0].path
                            : StandardThumbnail
                    }
                    style={{
                        height: "100%",
                        objectFit:
                            eventItem[IEventItemKeys.imageIds]! &&
                            eventItem[IEventItemKeys.imageIds]!.length >= 1
                                ? "cover"
                                : "contain", // may need to be redetermined on componentDidUpdate
                        width: "100%",
                    }}
                />
            </div>
            <CardContent
                style={{
                    flex: 12,
                    margin: "auto",
                    width: "90%",
                }}
            >
                <Typography color="primary" variant="h5">
                    {eventItem[IEventItemKeys.eventTitle]}
                </Typography>

                <Typography gutterBottom={true} variant="subtitle1">
                    {eventItem[IEventItemKeys.eventTopic]}
                </Typography>

                <Typography variant="caption">
                    <span>
                        {formatDate(
                            eventItem[IEventItemKeys.eventStart]!,
                            Formats.DATE.DATETIME_LOCAL
                        ) + Dict.separator_hyphen}
                    </span>
                </Typography>
                <Typography variant="caption">
                    <span>
                        {formatDate(
                            eventItem[IEventItemKeys.eventEnd]!,
                            Formats.DATE.DATETIME_LOCAL
                        )}
                    </span>
                </Typography>
            </CardContent>
        </Card>
    );
};

export default withTheme(EventListItem);
