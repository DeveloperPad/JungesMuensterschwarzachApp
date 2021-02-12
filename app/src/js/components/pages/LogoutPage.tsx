import * as log from 'loglevel';
import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import Dict from '../../constants/dict';
import { unregisterPushManager } from '../../constants/global-functions';
import { LogTags } from '../../constants/log-tags';
import { AppUrls } from '../../constants/specific-urls';
import { IUserKeys } from '../../networking/account_data/IUser';
import {
    AccountSessionSignOutRequest
} from '../../networking/account_session/AccountSessionSignOutRequest';
import { CookieService } from '../../services/CookieService';
import { showNotification } from '../utilities/Notifier';

type ILogoutPageProps = RouteComponentProps<any, StaticContext> & {
    setIsLoggedIn(isLoggedIn: boolean): void;
};
interface ILogoutPageState {
    signOutRequest: AccountSessionSignOutRequest|null;
}

class LogoutPage extends React.Component<ILogoutPageProps, ILogoutPageState> {

    constructor(props: ILogoutPageProps) {
        super(props);

        CookieService.get<number>(IUserKeys.userId)
            .then(userId => {
                this.state = {
                    signOutRequest: userId !== null ? this.newSignOutRequest() : null
                };
            })
            .then(() => {
                return Promise.all([
                    this.state && this.state.signOutRequest ? 
                        this.state.signOutRequest.execute() :
                        CookieService.remove(IUserKeys.accessLevel)
                            .then(() => CookieService.remove(IUserKeys.accessIdentifier)),
                    unregisterPushManager()
                ]);
            })
            .catch(error => {
                log.warn(LogTags.STORAGE_MANAGER + error);
            })
            .then(() => {
                this.props.setIsLoggedIn(false);
                this.props.history.push(AppUrls.LOGIN);
            });
    }

    public componentWillUnmount(): void {
        if (this.state && this.state.signOutRequest) {
            this.state.signOutRequest.cancel();
        }
    }

    public render(): React.ReactNode {
        return null;
    }

    private newSignOutRequest(): AccountSessionSignOutRequest {
        return new AccountSessionSignOutRequest(
            response => {
                this.setState(innerPrevState => {
                    return {
                        ...innerPrevState,
                        signOutRequest: null
                    }
                });
            },
            error => {
                showNotification(Dict.error_message_timeout);
                this.setState(innerPrevState => {
                    return {
                        ...innerPrevState,
                        signOutRequest: null
                    }
                });
            }
        );
    };

}

export default withRouter(LogoutPage);