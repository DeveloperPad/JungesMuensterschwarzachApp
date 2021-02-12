import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Card, CardContent, Typography, withTheme, WithTheme } from '@material-ui/core';

import Dict from '../../constants/dict';
import Formats from '../../constants/formats';
import { formatDate } from '../../constants/global-functions';
import { CustomTheme } from '../../constants/theme';
import IEventItem, { IEventItemKeys } from '../../networking/events/IEventItem';
import ImageCarousel from '../utilities/ImageCarousel';

type IEventImagesSubPageProps = RouteComponentProps<any, StaticContext> & WithTheme & {
    eventItem: IEventItem;
}

class EventImagesSubPage extends React.Component<IEventImagesSubPageProps> {

    private cardStyle: React.CSSProperties = {
        backgroundColor: CustomTheme.COLOR_BODY_INNER,
        display: "flex",
        flex: 1,
        marginBottom: this.props.theme.spacing(),
        width: "100%"
    };

    public render(): React.ReactNode {
        return (
            <Card
                key={this.props.eventItem[IEventItemKeys.eventId]}
                style={this.cardStyle}>

                <CardContent
                    style={cardContentStyle}>

                    <div>

                        <div style={horizontalDivStyle}>
                            <Typography
                                variant="caption">
                                {formatDate(this.props.eventItem[IEventItemKeys.eventModificationDate]!, Formats.DATE.TIME_LOCAL)}
                            </Typography>
                            <Typography
                                variant="caption">
                                {formatDate(this.props.eventItem[IEventItemKeys.eventModificationDate]!, Formats.DATE.DATE_LOCAL)}
                            </Typography>
                        </div>

                        <hr />

                        <Typography
                            color="primary"
                            gutterBottom={true}
                            variant="h5">
                            {this.props.eventItem[IEventItemKeys.eventTitle]}
                        </Typography>

                        <hr />

                    </div>

                    <div style={imageCarouselDivStyle}>
                        {this.props.eventItem[IEventItemKeys.imageIds]!.length === 0 ? (
                            <Typography
                                style={alignHorizontallyStyle}
                                variant="body1">
                                {Dict.image_categoryId_empty}
                            </Typography>
                        ) : (
                                <ImageCarousel
                                    images={this.props.eventItem[IEventItemKeys.imageIds]}
                                />
                            )}
                    </div>

                </CardContent>
            </Card>
        );
    }

}

export default withTheme(withRouter(EventImagesSubPage));

const horizontalDivStyle: React.CSSProperties = {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between"
};

const cardContentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%"
};

const imageCarouselDivStyle: React.CSSProperties = {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
};

const alignHorizontallyStyle: React.CSSProperties = {
    textAlign: "center"
};