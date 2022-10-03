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
import ImageCarousel from "../utilities/ImageCarousel";

type IEventImagesSubPageProps = WithTheme & {
    eventItem: IEventItem;
};

const EventImagesSubPage = (props: IEventImagesSubPageProps) => {
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

                <div
                    style={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    {eventItem[IEventItemKeys.imageIds]!.length === 0 ? (
                        <Typography
                            style={{
                                textAlign: "center",
                            }}
                            variant="body1"
                        >
                            {Dict.image_categoryId_empty}
                        </Typography>
                    ) : (
                        <ImageCarousel
                            images={eventItem[IEventItemKeys.imageIds]}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default withTheme(EventImagesSubPage);
