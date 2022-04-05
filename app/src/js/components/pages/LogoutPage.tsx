import * as log from "loglevel";
import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { Dict } from "../../constants/dict";
import { unregisterPushManager } from "../../constants/global-functions";
import { LogTags } from "../../constants/log-tags";
import { AppUrls } from "../../constants/specific-urls";
import { IUserKeys } from "../../networking/account_data/IUser";
import { AccountSessionSignOutRequest } from "../../networking/account_session/AccountSessionSignOutRequest";
import { CookieService } from "../../services/CookieService";
import { showNotification } from "../utilities/Notifier";

type ILogoutPageProps = {
    setIsLoggedIn(isLoggedIn: boolean): void;
};

const LogoutPage = (props: ILogoutPageProps) => {
    const { setIsLoggedIn } = props;
    const [signOutRequest, setSignOutRequest] = useState(null);
    const navigate = useNavigate();

    const newSignOutRequest = (): AccountSessionSignOutRequest => {
        return new AccountSessionSignOutRequest(
            (response) => {
                setSignOutRequest(null);
            },
            (error) => {
                showNotification(Dict.error_message_timeout);
                setSignOutRequest(null);
            }
        );
    };

    useEffect(() => {
        return () => {
            if (signOutRequest) {
                signOutRequest.cancel();
            }
        };
    });

    CookieService.get<number>(IUserKeys.userId)
        .then((userId) => {
            setSignOutRequest(userId !== null ? newSignOutRequest() : null);
        })
        .then(() => {
            return Promise.all([
                signOutRequest
                    ? signOutRequest.execute()
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
