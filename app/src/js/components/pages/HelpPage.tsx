import { Card, CardContent, Icon, Typography, withTheme, WithTheme } from '@material-ui/core';
import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';
import { Dict } from '../../constants/dict';
import { AppUrls } from '../../constants/specific-urls';
import { CustomTheme } from '../../constants/theme';
import Background from '../utilities/Background';



type IHelpPageProps = RouteComponentProps<any, StaticContext> & WithTheme;

class HelpPage extends React.Component<IHelpPageProps> {

    private helpItems: {
        forwardTo: AppUrls,
        iconString: string,
        label: string
    }[];

    private cardStyle: React.CSSProperties = {
        backgroundColor: CustomTheme.COLOR_BODY_INNER,
        cursor: "pointer",
        marginBottom: this.props.theme.spacing(2),
        width: "100%"
    };
    private helpItemLabelStyle: React.CSSProperties = {
        display: "inline-block",
        marginLeft: this.props.theme.spacing(5)
    };

    constructor(props: IHelpPageProps) {
        super(props);

        this.helpItems = [
            {
                forwardTo: AppUrls.INSTALLATION,
                iconString: "menu_book",
                label: Dict.installation_heading
            },
            {
                forwardTo: AppUrls.HELP_NEWSLETTER_SUBSCRIBE,
                iconString: "move_to_inbox",
                label: Dict.navigation_newsletter_subscribe
            },
            {
                forwardTo: AppUrls.HELP_REQUEST_ACTIVATION_MAIL,
                iconString: "mail_outline",
                label: Dict.navigation_request_activation_link
            },
            {
                forwardTo: AppUrls.HELP_RESET_PASSWORD,
                iconString: "vpn_key",
                label: Dict.navigation_request_password_reset
            },
            {
                forwardTo: AppUrls.HELP_REQUEST_ACCOUNT_TRANSFER_MAIL,
                iconString: "alternate_email",
                label: Dict.navigation_request_account_transfer_mail
            }
        ];
    }

    public render(): React.ReactNode {
        const helpItemCards: React.ReactNode[] = this.helpItems.map(helpItem => {
            return (
                <Card
                    key={helpItem.forwardTo}
                    onClick={
                        this.openHelpItem.bind(this, helpItem.forwardTo)
                    }
                    style={this.cardStyle}>

                    <CardContent
                        style={cardContentStyle}>

                        <Icon
                            style={helpItemIconStyle}>
                            {helpItem.iconString}
                        </Icon>

                        <Typography
                            color="primary"
                            variant="h5"
                            style={this.helpItemLabelStyle}>
                            {helpItem.label}
                        </Typography>

                    </CardContent>
                </Card>
            );
        });

        return (
            <Background theme={this.props.theme}>
                <div style={helpPageStyle}>
                    {helpItemCards}
                </div>
            </Background>
        );
    }

    private openHelpItem = (url: AppUrls): void => {
        this.props.history.push(url);
    }

}

export default withTheme(withRouter(HelpPage));

const helpPageStyle: React.CSSProperties = {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
}

const cardContentStyle: React.CSSProperties = {
    alignItems: "center",
    display: "flex",
    justifyContent: "start",
    margin: "auto",
    width: "90%"
};

const helpItemIconStyle: React.CSSProperties = {
    display: "inline-block"
};