import * as React from "react";

import {
    Card,
    CardContent,
    Typography,
    withTheme,
    WithTheme,
} from "@material-ui/core";

import ChangelogIcon from "../../../assets/images/changelog.png";
import ContactIcon from "../../../assets/images/contact.png";
import EventIcon from "../../../assets/images/event.png";
import InstallationIcon from "../../../assets/images/installation.png";
import LegalTextIcon from "../../../assets/images/legal_texts.png";
import NewsIcon from "../../../assets/images/news.png";
import ProfileIcon from "../../../assets/images/profile.png";
import { Dict } from "../../constants/dict";
import { AppUrls } from "../../constants/specific-urls";
import { IUserKeys, IUserValues } from "../../networking/account_data/IUser";
import { CookieService } from "../../services/CookieService";
import HomePageListItem from "../list_items/HomePageListItem";
import Background from "../utilities/Background";
import { ConfigService } from "../../services/ConfigService";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

type IHomePageProps = WithTheme;

const HomePage = (props: IHomePageProps) => {
    const { theme } = props;
    const [guestSession, setGuestSession] = useState(true);
    const navigate = useNavigate();

    const h1Style: React.CSSProperties = {
        fontSize: 1.8 * theme.typography.fontSize.valueOf(),
        marginBottom: 0.8 * theme.spacing(),
    };
    const listStyle: React.CSSProperties = {
        alignContent: "center",
        alignItems: "stretch",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
    };

    useEffect(() => {
        CookieService.get<number>(IUserKeys.accessLevel)
            .then((accessLevel) => {
                if (accessLevel === null) {
                    navigate(AppUrls.LOGIN);
                } else {
                    setGuestSession(
                        accessLevel === IUserValues[IUserKeys.accessLevel].guest
                    );
                }
            })
            .catch((error) => {
                navigate(AppUrls.LOGIN);
            });
    }, [navigate]);

    return (
        <Background theme={theme}>
            <Card>
                <CardContent>
                    <Typography style={h1Style}>
                        {Dict.navigation_app_content_overview}
                    </Typography>
                    <div style={listStyle}>
                        <HomePageListItem
                            icon={NewsIcon}
                            title={Dict.navigation_app_news}
                            target={AppUrls.NEWS_LIST}
                        />
                        <HomePageListItem
                            icon={EventIcon}
                            title={Dict.navigation_events}
                            target={AppUrls.EVENTS_LIST}
                        />
                        {!guestSession && (
                            <HomePageListItem
                                icon={ProfileIcon}
                                title={Dict.navigation_profile}
                                target={AppUrls.PROFILE}
                            />
                        )}
                    </div>
                    <div
                        style={{
                            height: theme.spacing(),
                        }}
                    />
                    <Typography style={h1Style}>
                        {Dict.navigation_app_meta_overview}
                    </Typography>
                    <div style={listStyle}>
                        <HomePageListItem
                            icon={InstallationIcon}
                            title={Dict.installation_heading}
                            target={AppUrls.INSTALLATION}
                        />
                        <HomePageListItem
                            icon={ChangelogIcon}
                            title={Dict.changelog}
                            target={AppUrls.CHANGELOG}
                        />
                        <HomePageListItem
                            icon={LegalTextIcon}
                            title={Dict.legal_notice_heading}
                            target={AppUrls.LEGAL_INFORMATION}
                        />
                        <HomePageListItem
                            icon={ContactIcon}
                            title={Dict.navigation_app_contact}
                            target={
                                ConfigService.getConfig().BaseUrls.CONTACT_LINK
                            }
                        />
                    </div>
                </CardContent>
            </Card>
        </Background>
    );
};

export default withTheme(HomePage);
