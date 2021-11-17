import log from 'loglevel';
import * as React from 'react';
import { Routes } from 'react-router';
import { Route } from 'react-router-dom';

import HeaderNavigation from './js/components/navigation/HeaderNavigation';
import ChangelogPage from './js/components/pages/ChangelogPage';
import EventItemPage from './js/components/pages/EventItemPage';
import EventListPage from './js/components/pages/EventListPage';
import HelpPage from './js/components/pages/HelpPage';
import HomePage from './js/components/pages/HomePage';
import InstallationDetailsPage from './js/components/pages/InstallationDetailsPage';
import InstallationPage from './js/components/pages/InstallationPage';
import LegalInformationPage from './js/components/pages/LegalInformationPage';
import LoginPage from './js/components/pages/LoginPage';
import LogoutPage from './js/components/pages/LogoutPage';
import NewsItemPage from './js/components/pages/NewsItemPage';
import NewsletterRedemptionPage from './js/components/pages/NewsletterRedemptionPage';
import NewsletterSubscriptionPage from './js/components/pages/NewsletterSubscriptionPage';
import NewsListPage from './js/components/pages/NewsListPage';
import ProfilePage from './js/components/pages/ProfilePage';
import ProfilePasswordChangePage from './js/components/pages/ProfilePasswordChangePage';
import RegistrationPage from './js/components/pages/RegistrationPage';
import RequestAccountTransferMailPage from './js/components/pages/RequestAccountTransferMailPage';
import RequestActivationMailPage from './js/components/pages/RequestActivationMailPage';
import RequestPasswordResetPage from './js/components/pages/RequestPasswordResetPage';
import TokenRedemptionPage from './js/components/pages/TokenRedemptionPage';
import TokenRedemptionPasswordResetPage from './js/components/pages/TokenRedemptionPasswordResetPage';
import Notifier, { showNotification } from './js/components/utilities/Notifier';
import { registerPushManager } from './js/constants/global-functions';
import { LogTags } from './js/constants/log-tags';
import { AppUrls } from './js/constants/specific-urls';
import { IUserKeys, IUserValues } from './js/networking/account_data/IUser';
import {
    AccountSessionSignOnRequest
} from './js/networking/account_session/AccountSessionSignOnRequest';
import { CookieService } from './js/services/CookieService';

interface IAppProps {
}
interface IAppState {
  isLoggedIn: boolean;
  sessionObservationSchedule: NodeJS.Timer|null;
  signOnRequest: AccountSessionSignOnRequest|null;
}

class App extends React.Component<IAppProps, IAppState> {

  private static readonly SESSION_OBSERVATION_INTERVAL: number = 1 * 60 * 1000;

  public constructor(props: IAppProps) {
    super(props);

    this.state = {
        isLoggedIn: false,
        sessionObservationSchedule: null,
        signOnRequest: null
    };
  }

  public componentDidMount(): void {
    this.validateAccessLevel();
    this.startSessionObservation();
  }

  public componentWillUnmount(): void {
    this.stopSessionObservation();
  }

  public componentDidUpdate(prevProps: IAppProps, prevState: IAppState): void {
    if (!prevState.isLoggedIn && this.state.isLoggedIn) {
      this.startSessionObservation();
    } else if (prevState.isLoggedIn && !this.state.isLoggedIn) {
      this.stopSessionObservation();
    }

    if (this.state.signOnRequest) {
      this.state.signOnRequest.execute()
        .then(() => {
          this.setState(prevState => {
            return {
              ...prevState,
              signOnRequest: null
            }
          });
        })
        .then(() => {
          return registerPushManager();
        });
    }
  } 

  public render(): React.ReactNode {
    return (
      <div id="app" style={appRouteStyle}>
        <HeaderNavigation rerenderApp={this.rerenderApp} isLoggedIn={this.state.isLoggedIn} />

        <div>
          <Routes>
            <Route path={AppUrls.CHANGELOG}>
              <ChangelogPage/>
            </Route>
            <Route path={AppUrls.EVENTS_LIST}>
              <EventListPage/>
            </Route>
            <Route path={AppUrls.EVENTS_ITEM}>
              <EventItemPage/>
            </Route>
            <Route path={AppUrls.HELP_NEWSLETTER_REDEEM}>
              <NewsletterRedemptionPage/>
            </Route>
            <Route path={AppUrls.HELP_NEWSLETTER_SUBSCRIBE}>
              <NewsletterSubscriptionPage/>
            </Route>
            <Route path={AppUrls.HELP_REDEEM_TOKEN_RESET_PASSWORD}>
              <TokenRedemptionPasswordResetPage/>
            </Route>
            <Route path={AppUrls.HELP_REDEEM_TOKEN}>
              <TokenRedemptionPage/>
            </Route>
            <Route path={AppUrls.HELP_REQUEST_ACCOUNT_TRANSFER_MAIL}>
              <RequestAccountTransferMailPage/>
            </Route>
            <Route path={AppUrls.HELP_REQUEST_ACTIVATION_MAIL}>
              <RequestActivationMailPage/>
            </Route>
            <Route path={AppUrls.HELP_RESET_PASSWORD}>
              <RequestPasswordResetPage/>
            </Route>
            <Route path={AppUrls.HELP}>
              <HelpPage/>
            </Route>
            <Route path={AppUrls.INSTALLATION}>
              <InstallationPage/>
            </Route>
            <Route path={AppUrls.INSTALLATION_DETAILS}>
              <InstallationDetailsPage/>
            </Route>
            <Route path={AppUrls.LEGAL_INFORMATION}>
              <LegalInformationPage/>
            </Route>
            <Route path={AppUrls.LOGIN}>
              <LoginPage setIsLoggedIn={this.setIsLoggedIn}/>
            </Route>
            <Route path={AppUrls.LOGOUT}>
              <LogoutPage setIsLoggedIn={this.setIsLoggedIn}/>
            </Route>
            <Route path={AppUrls.NEWS_LIST}>
              <NewsListPage/>
            </Route>
            <Route path={AppUrls.NEWS_ITEM}>
              <NewsItemPage/>
            </Route>
            <Route path={AppUrls.PROFILE_CHANGE_PASSWORD}>
              <ProfilePasswordChangePage/>
            </Route>
            <Route path={AppUrls.PROFILE}>
              <ProfilePage/>
            </Route>
            <Route path={AppUrls.REGISTER}>
              <RegistrationPage/>
            </Route>
            <Route path={AppUrls.HOME}>
              <HomePage/>
            </Route>
            {/* may add a 404 page here */}
          </Routes>
        </div>

        <Notifier />
      </div>
    );
  }

  public rerenderApp = (): void => {
    this.forceUpdate();
  }

  private validateAccessLevel = (): void => {
    CookieService.get<number>(IUserKeys.accessLevel)
      .then(accessLevel => {
        if (!this.isValidAccessLevel(accessLevel)) {
          log.warn(LogTags.AUTHENTICATION + "session terminated due to invalid access level!")
          this.setIsLoggedIn(false);
        } else {
          this.setIsLoggedIn(true);
        }
      })
      .catch(error => {
        log.warn(LogTags.AUTHENTICATION + "session terminated due to not loadable access level: " + error);
        this.setIsLoggedIn(false);
      });
  }

  private isValidAccessLevel = (accessLevel: any): boolean => {
    let isValid: boolean = false;

    if (accessLevel !== null) {
      Object.keys(IUserValues[IUserKeys.accessLevel]).forEach((accessLevelKey: string) => {
        if (Number(accessLevel) === IUserValues[IUserKeys.accessLevel][accessLevelKey]) {
          isValid = true;
        }
      });
    }

    return isValid;
  }

  public setIsLoggedIn = (isLoggedIn: boolean): void => {
    this.setState(prevState => {
      return {
        ...prevState,
        isLoggedIn
      };
    })
  }

  private startSessionObservation = (): void => {
    this.stopSessionObservation();

    if (!this.state.isLoggedIn) {
      return;
    }

    CookieService.get<number>(IUserKeys.userId)
      .then(userId => {
        if (userId === null) {
          return;
        }

        this.setState(prevState => {
          return {
            ...prevState,
            sessionObservationSchedule: setInterval(
              this.runSessionObservation,
              App.SESSION_OBSERVATION_INTERVAL
            ),
            signOnRequest: this.newSignOnRequest()
          }
        });
        log.info(LogTags.AUTHENTICATION + "Session observation started.");
      })
      .catch(() => {
        log.warn(LogTags.STORAGE_MANAGER + "userId could not be loaded.");
      });
  }

  private runSessionObservation = (): void => {
    this.setState(prevState => {
      return {
        ...prevState,
        signOnRequest: this.newSignOnRequest()
      }
    });
  }

  private stopSessionObservation = (): void => {
    this.stopSignOnRequest();

    if (!this.state.sessionObservationSchedule) {
      return;
    }

    clearInterval(this.state.sessionObservationSchedule);
    this.setState(prevState => {
      return {
        ...prevState,
        sessionObservationSchedule: null
      }
    });
    log.info(LogTags.AUTHENTICATION + "Session observation stopped.");
  }

  private stopSignOnRequest = (): void => {
    if (!this.state.signOnRequest) {
      return;
    }

    this.state.signOnRequest.cancel();
    this.setState(prevState => {
      return {
        ...prevState,
        signOnRequest: null
      }
    });
  }

  private newSignOnRequest = (): AccountSessionSignOnRequest => {
    return new AccountSessionSignOnRequest(
      response => {
        const errorMsg = response.errorMsg;

        if (errorMsg) {
          showNotification(errorMsg);
          log.warn(LogTags.AUTHENTICATION + "Session is not valid anymore.");
          this.stopSessionObservation();
          this.props.history.push(AppUrls.LOGOUT);
        } else {
          log.info(
            LogTags.AUTHENTICATION 
            + "Session is valid, has been updated and extended. "
            + "Rechecking in " + App.SESSION_OBSERVATION_INTERVAL / (60 * 1000) + " minute(s)..."
          );
        }
      },
      error => {
        log.warn(LogTags.AUTHENTICATION + "Session validity could not be checked: " + error);
        this.stopSessionObservation();
        this.props.history.push(AppUrls.LOGOUT);
      }
    );
  }

}

export default App;

const appRouteStyle: React.CSSProperties = {
  margin: "auto",
  maxWidth: "600px"
}
