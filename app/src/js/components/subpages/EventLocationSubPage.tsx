import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Card, CardContent, Typography, WithTheme, withTheme } from '@material-ui/core';

import Dict from '../../constants/dict';
import Formats from '../../constants/formats';
import { formatDate } from '../../constants/global-functions';
import { CustomTheme } from '../../constants/theme';
import IEventItem, { IEventItemKeys } from '../../networking/events/IEventItem';
import Map from '../utilities/Map';
import MapMarker from '../utilities/MapMarker';

type IEventLocationSubPageProps = RouteComponentProps<any, StaticContext> & WithTheme & {
    eventItem: IEventItem;
}

class EventLocationSubPage extends React.Component<IEventLocationSubPageProps> {

    private lowerSeparatorStyle: React.CSSProperties = {
        height: this.props.theme.spacing()
    };
    private contentIndentationStyle: React.CSSProperties = {
        marginLeft: this.props.theme.spacing(2)
    }
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

                    <div>
                        <Typography
                            variant="body1">
                            {Dict.event_eventArrival}
                        </Typography>
                        <Typography
                            style={this.contentIndentationStyle}
                        >
                            {this.props.eventItem[IEventItemKeys.eventArrivalContent]!}
                        </Typography>
                    </div>

                    <div style={this.lowerSeparatorStyle} />

                    <div style={mapDivStyle}>
                        <Map 
                            latitude={this.props.eventItem.eventLocationLatitude}
                            longitude={this.props.eventItem.eventLocationLongitude}
                        >
                            <MapMarker
                                latitude={this.props.eventItem.eventLocationLatitude}
                                longitude={this.props.eventItem.eventLocationLongitude}
                                title={this.props.eventItem[IEventItemKeys.eventLocationTitle]}
                            />
                        </Map>
                    </div>

                </CardContent>
            </Card>
        );
    }

}

export default withTheme(withRouter(EventLocationSubPage));

const cardContentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%"
};

const horizontalDivStyle: React.CSSProperties = {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between"
};

const mapDivStyle: React.CSSProperties = {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
};