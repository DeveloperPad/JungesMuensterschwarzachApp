import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Card, CardContent, Typography, withTheme, WithTheme } from '@material-ui/core';

import ChangelogIcon from '../../../assets/images/changelog.png';
import ContactIcon from '../../../assets/images/contact.png';
import EventIcon from '../../../assets/images/event.png';
import InstallationIcon from '../../../assets/images/installation.png';
import LegalTextIcon from '../../../assets/images/legal_texts.png';
import NewsIcon from '../../../assets/images/news.png';
import ProfileIcon from '../../../assets/images/profile.png';
import { Dict } from '../../constants/dict';
import { AppUrls } from '../../constants/specific-urls';
import { IUserKeys, IUserValues } from '../../networking/account_data/IUser';
import { CookieService } from '../../services/CookieService';
import HomePageListItem from '../list_items/HomePageListItem';
import Background from '../utilities/Background';
import { ConfigService } from '../../services/ConfigService';

type IHomePageProps = RouteComponentProps<any, StaticContext> & WithTheme;

interface IHomePageState {
    isNoGuestSession: boolean;
}

class HomePage extends React.Component<IHomePageProps, IHomePageState> {

    private h1Style: React.CSSProperties = {
        fontSize: 1.8 * this.props.theme.typography.fontSize.valueOf(),
        marginBottom: 0.8 * this.props.theme.spacing()
    }
    private separatorStyle: React.CSSProperties = {
        height: this.props.theme.spacing()
    };

    constructor(props: IHomePageProps) {
        super(props);

        this.state = {
            isNoGuestSession: false
        }

        CookieService.get<number>(IUserKeys.accessLevel)
            .then(accessLevel => {
                if (accessLevel === null) {
                    this.props.history.push(
                        AppUrls.LOGIN
                    );
                } else {
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            isNoGuestSession: (accessLevel !== IUserValues[IUserKeys.accessLevel].guest ? true : false)
                        };
                    });
                }
            })
            .catch(error => {
                this.props.history.push(
                    AppUrls.LOGIN
                );
            });
    }

    public render(): React.ReactNode {
        return (
            <Background theme={this.props.theme}>
                <Card>
                    <CardContent>
                        <Typography style={this.h1Style}>{Dict.navigation_app_content_overview}</Typography>
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
                            {this.state.isNoGuestSession &&
                                <HomePageListItem
                                    icon={ProfileIcon}
                                    title={Dict.navigation_profile}
                                    target={AppUrls.PROFILE}
                                />
                            }
                        </div>
                        <div style={this.separatorStyle} />
                        <Typography style={this.h1Style}>{Dict.navigation_app_meta_overview}</Typography>
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
                                target={ConfigService.getConfig().BaseUrls.CONTACT_LINK}
                            />
                        </div>
                    </CardContent>
                </Card>
            </Background>
        );
    }

}

export default withTheme(withRouter(HomePage));

const listStyle: React.CSSProperties = {
    alignContent: "center",
    alignItems: "stretch",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly"
}