import * as log from "loglevel";
import * as React from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
    withTheme,
    WithTheme,
} from "@material-ui/core";

import { Dict } from "../../constants/dict";
import { registerPushManager } from "../../constants/global-functions";
import { LogTags } from "../../constants/log-tags";
import { AppUrls } from "../../constants/specific-urls";
import {
    CustomTheme,
    grid2Style,
    grid5Style,
    ThemeTypes,
} from "../../constants/theme";
import { IUserKeys, IUserValues } from "../../networking/account_data/IUser";
import { IAccountSessionResponse } from "../../networking/account_session/AccountSessionRequest";
import EMailAddressInput, {
    E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGE,
} from "../form_elements/EMailAddressInput";
import ForwardButton from "../form_elements/ForwardButton";
import PasswordInput, {
    PASSWORD_INPUT_LOCAL_ERROR_MESSAGE,
} from "../form_elements/PasswordInput";
import SubmitButton from "../form_elements/SubmitButton";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";
import { showNotification } from "../utilities/Notifier";
import { AccountSessionSignInRequest } from "../../networking/account_session/AccountSessionSignInRequest";
import { CookieService } from "../../services/CookieService";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

type ILoginFormProps = WithTheme & {
    setIsLoggedIn(isLoggedIn: boolean): void;
};

type IFormKeys =
    | IUserKeys.eMailAddress
    | IUserKeys.password
    | IUserKeys.passwordRepetition;

interface IForm {
    [IUserKeys.eMailAddress]: string;
    [IUserKeys.password]: string;
}

interface IFormError {
    [IUserKeys.eMailAddress]: string | null;
    [IUserKeys.password]: string | null;
}

const LoginForm = (props: ILoginFormProps) => {
    const { setIsLoggedIn, theme } = props;
    const [form, setForm] = useState<IForm>({
        [IUserKeys.eMailAddress]: "",
        [IUserKeys.password]: "",
    });
    const [formError, setFormError] = useState<IFormError>({
        [IUserKeys.eMailAddress]: null,
        [IUserKeys.password]: null,
    });
    const [showGuestSignInDialog, setShowGuestSignInDialog] =
        useState<boolean>(false);
    const signInRequest = useRef<AccountSessionSignInRequest>();
    const navigate = useNavigate();

    const topMarginStyle: React.CSSProperties = {
        marginTop: 2 * theme.spacing(),
    };
    const passwordResetTypographyStyle: React.CSSProperties = {
        color: CustomTheme.COLOR_WHITE,
        cursor: "pointer",
        display: "inline-block",
        marginTop: theme.spacing(),
        textAlign: "center",
    };
    const legalNoticeTypographyStyle: React.CSSProperties = {
        color: CustomTheme.COLOR_LINK,
        cursor: "pointer",
    };

    const updateForm = (key: IFormKeys, value: string): void => {
        setForm((form) => {
            form[key] = value;
            return form;
        });
    };
    const updateFormError = (key: IFormKeys, value: string | null): void => {
        setFormError((formError) => {
            formError[key] = value;
            return formError;
        });
    };
    const setGuestDialogVisible = (visible: boolean): void => {
        setShowGuestSignInDialog(visible);
    };
    const forwardToResetPassword = (): void => {
        navigate(AppUrls.HELP_RESET_PASSWORD);
    };
    const forwardToLegalInformation = (): void => {
        navigate(AppUrls.LEGAL_INFORMATION);
    };

    const signIn = (): void => {
        scheduleLocalRevalidation();

        if (!validate()) {
            return;
        }

        if (signInRequest.current) {
            signInRequest.current.cancel();
        }

        signInRequest.current = new AccountSessionSignInRequest(
            form[IUserKeys.eMailAddress],
            form[IUserKeys.password],
            (response: IAccountSessionResponse) => {
                const errorMsg = response.errorMsg;

                if (errorMsg) {
                    let errorKey = null;

                    if (errorMsg.indexOf(IUserKeys.eMailAddress) > -1) {
                        errorKey = IUserKeys.eMailAddress;
                    } else if (errorMsg.indexOf(IUserKeys.password) > -1) {
                        errorKey = IUserKeys.password;
                    }

                    if (errorKey) {
                        setFormError((formError) => {
                            formError[errorKey] = Dict[errorMsg] ?? errorMsg;
                            return formError;
                        });
                    } else {
                        showNotification(errorMsg);
                    }
                } else {
                    registerPushManager()
                        .catch((exc) => {
                            log.warn(LogTags.PUSH_SUBSCRIPTION + exc);
                        })
                        .then(() => {
                            setIsLoggedIn(true);
                            navigate(AppUrls.HOME);
                        });
                }

                signInRequest.current = null;
            },
            (error: any) => {
                showNotification(Dict.error_message_timeout);
                signInRequest.current = null;
            }
        );
        signInRequest.current.execute();
    };
    const signInAsGuest = (): void => {
        Promise.all([
            CookieService.set(
                IUserKeys.accessLevel,
                IUserValues[IUserKeys.accessLevel].guest
            ),
            CookieService.set(
                IUserKeys.accessIdentifier,
                IUserValues[IUserKeys.accessIdentifier][
                    IUserValues[IUserKeys.accessLevel].guest
                ]
            ),
            registerPushManager(),
        ])
            .catch((exc) => {
                log.warn(LogTags.AUTHENTICATION + exc);
            })
            .then((values) => {
                setIsLoggedIn(true);
                navigate(AppUrls.HOME);
            });
    };
    const scheduleLocalRevalidation = (): void => {
        setFormError({
            [IUserKeys.eMailAddress]: null,
            [IUserKeys.password]: null,
        });
    };
    const validate = (): boolean => {
        return (
            formError[IUserKeys.eMailAddress] !==
                E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGE &&
            formError[IUserKeys.password] !== PASSWORD_INPUT_LOCAL_ERROR_MESSAGE
        );
    };

    useEffect(() => {
        return () => {
            if (signInRequest.current) {
                signInRequest.current.cancel();
            }
        };
    });

    return (
        <>
            <Grid>
                <GridItem style={grid5Style}>
                    <Grid>
                        <EMailAddressInput
                            errorMessage={formError[IUserKeys.eMailAddress]}
                            onError={updateFormError}
                            onUpdateValue={updateForm}
                            showErrorMessageOnLoad={false}
                            themeType={ThemeTypes.LIGHT}
                            value={form[IUserKeys.eMailAddress]}
                        />

                        <PasswordInput
                            errorMessage={formError[IUserKeys.password]}
                            onError={updateFormError}
                            onKeyPressEnter={signIn}
                            onUpdateValue={updateForm}
                            showErrorMessageOnLoad={false}
                            style={topMarginStyle}
                            themeType={ThemeTypes.LIGHT}
                            value={form[IUserKeys.password]}
                        />

                        <Typography
                            onClick={forwardToResetPassword}
                            style={passwordResetTypographyStyle}
                        >
                            <span>
                                {Dict.navigation_request_password_reset}
                            </span>
                        </Typography>

                        <SubmitButton
                            disabled={signInRequest !== null}
                            label={Dict.account_sign_in}
                            onClick={signIn}
                            style={topMarginStyle}
                        />
                    </Grid>
                </GridItem>

                <GridItem style={grid2Style}>
                    <div>
                        <SubmitButton
                            label={Dict.account_sign_in_guest}
                            onClick={setGuestDialogVisible.bind(this, true)}
                        />
                    </div>
                    <div style={topMarginStyle}>
                        <ForwardButton
                            forwardTo={AppUrls.REGISTER}
                            label={Dict.account_sign_up}
                        />
                    </div>
                </GridItem>
            </Grid>

            <Dialog
                onClose={setGuestDialogVisible.bind(this, false)}
                open={showGuestSignInDialog}
            >
                <DialogTitle>{Dict.legal_notice_consent_heading}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {Dict.legal_notice_consent_paragraph_prefix}
                        <span
                            onClick={forwardToLegalInformation}
                            style={legalNoticeTypographyStyle}
                        >
                            {Dict.legal_notice_heading}
                        </span>
                        {Dict.legal_notice_consent_paragraph_suffix}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={setGuestDialogVisible.bind(this, false)}
                        color="primary"
                    >
                        {Dict.label_cancel}
                    </Button>
                    <Button onClick={signInAsGuest} color="primary">
                        {Dict.label_confirm}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default withTheme(LoginForm);
