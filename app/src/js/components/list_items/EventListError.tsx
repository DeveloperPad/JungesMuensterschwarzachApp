import * as React from "react";

import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    withTheme,
    WithTheme,
} from "@mui/material";

import StandardThumbnail from "../../../assets/images/logo_colored.png";
import Formats from "../../constants/formats";
import { formatDate } from "../../constants/global-functions";
import { CustomTheme, grid7Style } from "../../constants/theme";
import IEventItem, { IEventItemKeys } from "../../networking/events/IEventItem";

type IEventListErrorProps = WithTheme & {
    eventItemError: IEventItem;
};

const EventListError = (props: IEventListErrorProps) => {
    const { eventItemError, theme } = props;

    return (
        <Card
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
                    src={StandardThumbnail}
                    style={{
                        height: "100%",
                        objectFit: "contain",
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
                    {eventItemError[IEventItemKeys.eventTitle]}
                </Typography>

                <Typography gutterBottom={true} variant="subtitle1">
                    {eventItemError[IEventItemKeys.eventTopic]}
                </Typography>

                <Typography variant="caption">
                    <span>
                        {formatDate(
                            eventItemError[IEventItemKeys.eventStart]!,
                            Formats.DATE.DATETIME_LOCAL
                        )}
                    </span>
                </Typography>
            </CardContent>
        </Card>
    );
};

export default withTheme(EventListError);
