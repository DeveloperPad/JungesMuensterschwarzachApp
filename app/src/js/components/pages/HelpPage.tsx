import {
    Card,
    CardContent,
    Icon,
    Typography,
    withTheme,
    WithTheme,
} from "@material-ui/core";
import * as React from "react";
import { useNavigate } from "react-router";
import { Dict } from "../../constants/dict";
import { AppUrls } from "../../constants/specific-urls";
import { CustomTheme } from "../../constants/theme";
import Background from "../utilities/Background";

type IHelpPageProps = WithTheme;

type HelpItem = {
    forwardTo: AppUrls;
    iconString: string;
    label: string;
};

const HelpPage = (props: IHelpPageProps) => {
    const { theme } = props;
    const navigate = useNavigate();

    const getHelpItems = (): HelpItem[] => {
        return [
            {
                forwardTo: AppUrls.INSTALLATION,
                iconString: "menu_book",
                label: Dict.installation_heading,
            },
            {
                forwardTo: AppUrls.HELP_NEWSLETTER_SUBSCRIBE,
                iconString: "move_to_inbox",
                label: Dict.navigation_newsletter_subscribe,
            },
            {
                forwardTo: AppUrls.HELP_REQUEST_ACTIVATION_MAIL,
                iconString: "mail_outline",
                label: Dict.navigation_request_activation_link,
            },
            {
                forwardTo: AppUrls.HELP_RESET_PASSWORD,
                iconString: "vpn_key",
                label: Dict.navigation_request_password_reset,
            },
            {
                forwardTo: AppUrls.HELP_REQUEST_ACCOUNT_TRANSFER_MAIL,
                iconString: "alternate_email",
                label: Dict.navigation_request_account_transfer_mail,
            },
        ];
    };

    const helpItemCards: React.ReactNode[] = getHelpItems().map((helpItem) => {
        return (
            <Card
                key={helpItem.forwardTo}
                onClick={navigate.bind(this, helpItem.forwardTo)}
                style={{
                    backgroundColor: CustomTheme.COLOR_BODY_INNER,
                    cursor: "pointer",
                    marginBottom: theme.spacing(2),
                    width: "100%",
                }}
            >
                <CardContent
                    style={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "start",
                        margin: "auto",
                        width: "90%",
                    }}
                >
                    <Icon
                        style={{
                            display: "inline-block",
                        }}
                    >
                        {helpItem.iconString}
                    </Icon>

                    <Typography
                        color="primary"
                        variant="h5"
                        style={{
                            display: "inline-block",
                            marginLeft: theme.spacing(5),
                        }}
                    >
                        {helpItem.label}
                    </Typography>
                </CardContent>
            </Card>
        );
    });

    return (
        <Background theme={theme}>
            <div
                style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                {helpItemCards}
            </div>
        </Background>
    );
};

export default withTheme(HelpPage);
