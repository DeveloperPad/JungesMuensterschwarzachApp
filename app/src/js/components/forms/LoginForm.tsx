import * as log from "loglevel";
import * as React from "react";
import { useNavigate } from "react-router";

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
} from "@mui/material";

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
import { AccountSessionSignInRequest } from "../../networking/account_session/AccountSessionSignInRequest";
import { CookieService } from "../../services/CookieService";
import EMailAddressInput, {
    E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGES,
} from "../form_elements/EMailAddressInput";
import ForwardButton from "../form_elements/ForwardButton";
import PasswordInput, {
    PASSWORD_INPUT_LOCAL_ERROR_MESSAGE,
} from "../form_elements/PasswordInput";
import SubmitButton from "../form_elements/SubmitButton";
import { useRequestQueue } from "../utilities/CustomHooks";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";
import { showNotification } from "../utilities/Notifier";

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
    const [form, setForm] = React.useState<IForm>({
        [IUserKeys.eMailAddress]: "",
        [IUserKeys.password]: "",
    });
    const [formError, setFormError] = React.useState<IFormError>({
        [IUserKeys.eMailAddress]: null,
        [IUserKeys.password]: null,
    });
    const [showGuestSignInDialog, setShowGuestSignInDialog] =
        React.useState<boolean>(false);
    const [request, isRequestRunning] = useRequestQueue();
    const suppressErrorMsgs = React.useRef<boolean>(true);
    const navigate = useNavigate();

    const topMarginStyle: React.CSSProperties = React.useMemo(
        () => ({
            marginTop: 2 * theme.spacing(),
        }),
        [theme]
    );
    const passwordResetTypographyStyle: React.CSSProperties = React.useMemo(
        () => ({
            color: CustomTheme.COLOR_WHITE,
            cursor: "pointer",
            display: "inline-block",
            marginTop: theme.spacing(),
            textAlign: "center",
        }),
        [theme]
    );
    const legalNoticeTypographyStyle: React.CSSProperties = React.useMemo(
        () => ({
            color: CustomTheme.COLOR_LINK,
            cursor: "pointer",
        }),
        []
    );

    const updateForm = React.useCallback(
        (key: IFormKeys, value: string): void => {
            setForm((form: IForm) => ({
                ...form,
                [key]: value,
            }));
            suppressErrorMsgs.current = false;
        },
        []
    );
    const updateFormError = React.useCallback(
        (key: IFormKeys, value: string | null): void => {
            setFormError((formError: IFormError) => ({
                ...formError,
                [key]: value,
            }));
        },
        []
    );
    const validate = React.useCallback((): boolean => {
        return (
            !E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGES.includes(
                formError[IUserKeys.eMailAddress]
            ) &&
            formError[IUserKeys.password] !== PASSWORD_INPUT_LOCAL_ERROR_MESSAGE
        );
    }, [formError]);
    const signIn = React.useCallback((): void => {
        if (!validate()) {
            return;
        }

        setFormError({
            [IUserKeys.eMailAddress]: null,
            [IUserKeys.password]: null,
        });
        request(
            new AccountSessionSignInRequest(
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
                                return {
                                    ...formError,
                                    [errorKey]: Dict[errorMsg] ?? errorMsg,
                                };
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
                },
                (error: any) => {
                    showNotification(Dict.error_message_timeout);
                }
            )
        );
    }, [form, navigate, request, setIsLoggedIn, validate]);
    const signInAsGuest = React.useCallback((): void => {
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
    }, [navigate, setIsLoggedIn]);

    return (
        <>
            <Grid>
                <GridItem style={grid5Style}>
                    <Grid>
                        <EMailAddressInput
                            errorMessage={formError[IUserKeys.eMailAddress]}
                            onError={updateFormError}
                            onUpdateValue={updateForm}
                            suppressErrorMsg={suppressErrorMsgs.current}
                            themeType={ThemeTypes.LIGHT}
                            value={form[IUserKeys.eMailAddress]}
                        />

                        <PasswordInput
                            errorMessage={formError[IUserKeys.password]}
                            onError={updateFormError}
                            onKeyPressEnter={signIn}
                            onUpdateValue={updateForm}
                            suppressErrorMsg={suppressErrorMsgs.current}
                            style={topMarginStyle}
                            themeType={ThemeTypes.LIGHT}
                            value={form[IUserKeys.password]}
                        />

                        <Typography
                            onClick={navigate.bind(
                                this,
                                AppUrls.HELP_RESET_PASSWORD
                            )}
                            style={passwordResetTypographyStyle}
                        >
                            <span>
                                {Dict.navigation_request_password_reset}
                            </span>
                        </Typography>

                        <SubmitButton
                            disabled={isRequestRunning}
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
                            onClick={setShowGuestSignInDialog.bind(this, true)}
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
                onClose={setShowGuestSignInDialog.bind(this, false)}
                open={showGuestSignInDialog}
            >
                <DialogTitle>{Dict.legal_notice_consent_heading}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {Dict.legal_notice_consent_paragraph_prefix}
                        <span
                            onClick={navigate.bind(
                                this,
                                AppUrls.LEGAL_INFORMATION
                            )}
                            style={legalNoticeTypographyStyle}
                        >
                            {Dict.legal_notice_heading}
                        </span>
                        {Dict.legal_notice_consent_paragraph_suffix}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={setShowGuestSignInDialog.bind(this, false)}
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
