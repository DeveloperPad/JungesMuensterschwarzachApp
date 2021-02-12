import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Card, CardContent, CardMedia, Typography, withTheme, WithTheme } from '@material-ui/core';

import StandardThumbnail from '../../../assets/images/logo_colored.png';
import Dict from '../../constants/dict';
import Formats from '../../constants/formats';
import { formatDate } from '../../constants/global-functions';
import { AppUrls } from '../../constants/specific-urls';
import { CustomTheme, grid7Style } from '../../constants/theme';
import IEventItem, { IEventItemKeys } from '../../networking/events/IEventItem';
import { ConfigService } from '../../services/ConfigService';

type IEventListItemProps = RouteComponentProps<any, StaticContext> & WithTheme & {
    eventItem: IEventItem;
}

class EventListItem extends React.Component<IEventListItemProps> {

    private cardStyle: React.CSSProperties = {
        backgroundColor: CustomTheme.COLOR_BODY_INNER,
        cursor: "pointer",
        display: "flex",
        marginBottom: this.props.theme.spacing(),
        width: "100%"
    };
    private cardMediaStyle: React.CSSProperties = {
        height: "100%",
        objectFit:
            this.props.eventItem[IEventItemKeys.imageIds]! && this.props.eventItem[IEventItemKeys.imageIds]!.length >= 1 ?
                "cover" : "contain", // may need to be redetermined on componentDidUpdate
        width: "100%"
    };

    public render(): React.ReactNode {
        return (
            <Card
                key={this.props.eventItem[IEventItemKeys.eventId]}
                onClick={
                    this.openEventItem.bind(
                        this,
                        this.props.eventItem[IEventItemKeys.eventId]
                    )
                }
                style={this.cardStyle}>
                <div style={grid7Style}>
                    <CardMedia
                        component="img"
                        src={
                            this.props.eventItem[IEventItemKeys.imageIds] && this.props.eventItem[IEventItemKeys.imageIds]!.length >= 1 ?
                                ConfigService.getConfig().BaseUrls.WEBSERVICE + "/" + this.props.eventItem[IEventItemKeys.imageIds]![0].path :
                                StandardThumbnail
                        }
                        style={this.cardMediaStyle}
                    />
                </div>
                <CardContent
                    style={cardContentStyle}>

                    <Typography
                        color="primary"
                        variant="h5">
                        {this.props.eventItem[IEventItemKeys.eventTitle]}
                    </Typography>

                    <Typography
                        gutterBottom={true}
                        variant="subtitle1">
                        {this.props.eventItem[IEventItemKeys.eventTopic]}
                    </Typography>

                    <Typography
                        variant="caption">
                        <span>{formatDate(this.props.eventItem[IEventItemKeys.eventStart]!, Formats.DATE.DATETIME_LOCAL) + Dict.separator_hyphen}</span>
                    </Typography>
                    <Typography
                        variant="caption">
                        <span>{formatDate(this.props.eventItem[IEventItemKeys.eventEnd]!, Formats.DATE.DATETIME_LOCAL)}</span>
                    </Typography>

                </CardContent>
            </Card>
        );
    }

    private openEventItem = (eventId: number): void => {
        if (eventId >= 0) {
            this.props.history.push(
                AppUrls.EVENTS + "/" + eventId
            );
        }
    }

}

export default withTheme(withRouter(EventListItem));

const cardContentStyle: React.CSSProperties = {
    flex: 12,
    margin: "auto",
    width: "90%"
};