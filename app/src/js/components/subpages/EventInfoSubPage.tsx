import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Card, CardContent, Typography, withTheme, WithTheme } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import Formats from '../../constants/formats';
import { formatDate } from '../../constants/global-functions';
import { CustomTheme } from '../../constants/theme';
import IEventItem, { IEventItemKeys } from '../../networking/events/IEventItem';

type IEventInfoSubPageProps = RouteComponentProps<any, StaticContext> & WithTheme & {
    eventItem: IEventItem;
}

class EventInfoSubPage extends React.Component<IEventInfoSubPageProps> {

    private cardStyle: React.CSSProperties = {
        backgroundColor: CustomTheme.COLOR_BODY_INNER,
        display: "flex",
        marginBottom: this.props.theme.spacing(),
        width: "100%"
    };
    private higherSeparatorStyle: React.CSSProperties = {
        height: this.props.theme.spacing(2)
    };
    private lowerSeparatorStyle: React.CSSProperties = {
        height: this.props.theme.spacing()
    };
    private contentIndentationStyle: React.CSSProperties = {
        marginLeft: this.props.theme.spacing(2)
    }

    public render(): React.ReactNode {
        return (
            <Card
                key={this.props.eventItem[IEventItemKeys.eventId]}
                style={this.cardStyle}>

                <CardContent
                    style={cardContentStyle}>

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

                    <Typography
                        gutterBottom={true}
                        variant="subtitle1">
                        {this.props.eventItem[IEventItemKeys.eventTopic]}
                    </Typography>

                    <hr />

                    <Typography
                        className="normalize"
                        gutterBottom={true}
                        dangerouslySetInnerHTML={{
                            __html: this.props.eventItem.eventDetails
                        }}
                    />

                    <div style={this.lowerSeparatorStyle} />
                    <hr />

                    <Typography
                        variant="body1">
                        {Dict.event_eventStart}
                    </Typography>
                    <Typography
                        style={this.contentIndentationStyle}
                    >
                        {formatDate(this.props.eventItem[IEventItemKeys.eventStart]!, Formats.DATE.DATETIME_LOCAL)}
                    </Typography>

                    <div style={this.lowerSeparatorStyle} />

                    <Typography
                        variant="body1">
                        {Dict.event_eventEnd}
                    </Typography>
                    <Typography
                        style={this.contentIndentationStyle}
                    >
                        {formatDate(this.props.eventItem[IEventItemKeys.eventEnd]!, Formats.DATE.DATETIME_LOCAL)}
                    </Typography>

                    <div style={this.lowerSeparatorStyle} />

                    <Typography
                        variant="body1">
                        {Dict.event_eventLocation}
                    </Typography>
                    <Typography
                        style={this.contentIndentationStyle}
                    >
                        {this.props.eventItem[IEventItemKeys.eventLocationTitle]}
                    </Typography>

                    <div style={this.lowerSeparatorStyle} />

                    <Typography
                        variant="body1">
                        {Dict.event_eventTargetGroup}
                    </Typography>
                    <Typography
                        style={this.contentIndentationStyle}
                    >
                        {this.props.eventItem[IEventItemKeys.eventTargetGroupContent]}
                    </Typography>

                    <hr />
                    <div style={this.lowerSeparatorStyle} />

                    <Typography
                        variant="body1">
                        {Dict.event_eventOffer}
                    </Typography>
                    <Typography
                        gutterBottom={true}
                        style={this.contentIndentationStyle}
                    >
                        {this.props.eventItem[IEventItemKeys.eventOfferContent]}
                    </Typography>

                    <div style={this.lowerSeparatorStyle} />

                    <Typography
                        variant="body1">
                        {Dict.event_eventSchedule}
                    </Typography>
                    <Typography
                        gutterBottom={true}
                        style={this.contentIndentationStyle}
                    >
                        {this.props.eventItem[IEventItemKeys.eventScheduleContent]}
                    </Typography>

                    <div style={this.lowerSeparatorStyle} />

                    <Typography
                        variant="body1">
                        {Dict.event_eventPrice}
                    </Typography>
                    <Typography
                        gutterBottom={true}
                        style={this.contentIndentationStyle}
                    >
                        {this.props.eventItem[IEventItemKeys.eventPriceContent]}
                    </Typography>

                    <div style={this.lowerSeparatorStyle} />

                    <Typography
                        variant="body1">
                        {Dict.event_eventPackingList}
                    </Typography>
                    <Typography
                        gutterBottom={true}
                        style={this.contentIndentationStyle}
                    >
                        {this.props.eventItem[IEventItemKeys.eventPackingListContent]}
                    </Typography>

                </CardContent>
            </Card>
        );
    }

}

export default withTheme(withRouter(EventInfoSubPage));

const horizontalDivStyle: React.CSSProperties = {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between"
}

const cardContentStyle: React.CSSProperties = {
    margin: "auto",
    width: "100%"
};