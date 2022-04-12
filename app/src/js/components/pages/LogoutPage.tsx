import * as log from 'loglevel';
import * as React from 'react';
import { useNavigate } from 'react-router';

import { Dict } from '../../constants/dict';
import { unregisterPushManager } from '../../constants/global-functions';
import { LogTags } from '../../constants/log-tags';
import { AppUrls } from '../../constants/specific-urls';
import { IUserKeys } from '../../networking/account_data/IUser';
import {
    AccountSessionSignOutRequest
} from '../../networking/account_session/AccountSessionSignOutRequest';
import { CookieService } from '../../services/CookieService';
import { showNotification } from '../utilities/Notifier';

type ILogoutPageProps = {
    setIsLoggedIn(isLoggedIn: boolean): void;
};

const LogoutPage = (props: ILogoutPageProps) => {
    const navigate = useNavigate();
    const { setIsLoggedIn } = props;
    const signOutRequest = React.useRef<AccountSessionSignOutRequest>();

    const newSignOutRequest =
        React.useCallback((): AccountSessionSignOutRequest => {
            return new AccountSessionSignOutRequest(
                (response) => {
                    signOutRequest.current = null;
                },
                (error) => {
                    showNotification(Dict.error_message_timeout);
                    signOutRequest.current = null;
                }
            );
        }, []);

    React.useEffect(() => {
        return () => {
            if (signOutRequest.current) {
                signOutRequest.current.cancel();
            }
        };
    }, [signOutRequest]);

    CookieService.get<number>(IUserKeys.userId)
        .then((userId) => {
            signOutRequest.current =
                userId !== null ? newSignOutRequest() : null;
        })
        .then(() => {
            return Promise.all([
                signOutRequest.current
                    ? signOutRequest.current.execute()
                    : CookieService.remove(IUserKeys.accessLevel).then(() =>
                          CookieService.remove(IUserKeys.accessIdentifier)
                      ),
                unregisterPushManager(),
            ]);
        })
        .catch((error) => {
            log.warn(LogTags.STORAGE_MANAGER + error);
        })
        .then(() => {
            setIsLoggedIn(false);
            navigate(AppUrls.LOGIN);
        });

    return null;
};

export default LogoutPage;
