import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Card, CardContent, Typography, withTheme, WithTheme } from '@material-ui/core';

import Formats from '../../constants/formats';
import { formatDate } from '../../constants/global-functions';
import { CustomTheme } from '../../constants/theme';
import IEventItem, { IEventItemKeys } from '../../networking/events/IEventItem';
import EventEnrollmentForm from '../forms/EventEnrollmentForm';

type IEventEnrollmentSubPageProps = RouteComponentProps<any, StaticContext> & WithTheme & {
    eventItem: IEventItem;
    refetchEventItem: () => void;
}

class EventEnrollmentSubPage extends React.Component<IEventEnrollmentSubPageProps> {

    private cardStyle: React.CSSProperties = {
        backgroundColor: CustomTheme.COLOR_BODY_INNER,
        display: "flex",
        marginBottom: this.props.theme.spacing(),
        width: "100%"
    };
    private lowerSeparatorStyle: React.CSSProperties = {
        height: this.props.theme.spacing()
    };

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

                    <hr />

                    <EventEnrollmentForm eventItem={this.props.eventItem} refetchEventItem={this.props.refetchEventItem} />

                    { /* }
                    <hr />
                    
                    <div style={this.lowerSeparatorStyle} />

                    <ParticipantsList
                        participants={this.props.eventItem[IEventItemKeys.eventParticipants]!}
                    />
                    { */ }
                </CardContent>
            </Card>
        );
    }

}

export default withTheme(withRouter(EventEnrollmentSubPage));

const horizontalDivStyle: React.CSSProperties = {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between"
}

const cardContentStyle: React.CSSProperties = {
    margin: "auto",
    width: "100%"
};