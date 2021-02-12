import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Card, CardContent, CardMedia, Typography, withTheme, WithTheme } from '@material-ui/core';

import StandardThumbnail from '../../../assets/images/logo_colored.png';
import Formats from '../../constants/formats';
import { formatDate } from '../../constants/global-functions';
import { CustomTheme, grid7Style } from '../../constants/theme';
import IEventItem, { IEventItemKeys } from '../../networking/events/IEventItem';

type IEventListErrorProps = RouteComponentProps<any, StaticContext> & WithTheme & {
    eventItemError: IEventItem;
}

class EventListError extends React.Component<IEventListErrorProps> {

    private cardStyle: React.CSSProperties = {
        backgroundColor: CustomTheme.COLOR_BODY_INNER,
        cursor: "pointer",
        display: "flex",
        marginBottom: this.props.theme.spacing(),
        width: "100%"
    };

    public render(): React.ReactNode {
        return (
            <Card
                style={this.cardStyle}>
                <div style={grid7Style}>
                    <CardMedia
                        component="img"
                        src={StandardThumbnail}
                        style={cardMediaStyle}
                    />
                </div>
                <CardContent
                    style={cardContentStyle}>

                    <Typography
                        color="primary"
                        variant="h5">
                        {this.props.eventItemError[IEventItemKeys.eventTitle]}
                    </Typography>

                    <Typography
                        gutterBottom={true}
                        variant="subtitle1">
                        {this.props.eventItemError[IEventItemKeys.eventTopic]}
                    </Typography>

                    <Typography
                        variant="caption">
                        <span>{formatDate(this.props.eventItemError[IEventItemKeys.eventStart]!, Formats.DATE.DATETIME_LOCAL)}</span>
                    </Typography>

                </CardContent>
            </Card>
        );
    }

}

export default withTheme(withRouter(EventListError));

const cardMediaStyle: React.CSSProperties = {
    height: "100%",
    objectFit: "contain",
    width: "100%"
};

const cardContentStyle: React.CSSProperties = {
    flex: 12,
    margin: "auto",
    width: "90%"
};