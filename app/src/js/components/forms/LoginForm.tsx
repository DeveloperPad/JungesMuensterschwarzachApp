import * as log from 'loglevel';
import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography,
    withTheme, WithTheme
} from '@material-ui/core';

import Dict from '../../constants/dict';
import { registerPushManager } from '../../constants/global-functions';
import { LogTags } from '../../constants/log-tags';
import { AppUrls } from '../../constants/specific-urls';
import { CustomTheme, grid2Style, grid5Style, ThemeTypes } from '../../constants/theme';
import { IUserKeys, IUserValues } from '../../networking/account_data/IUser';
import { IAccountSessionResponse } from '../../networking/account_session/AccountSessionRequest';
import EMailAddressInput from '../form_elements/EMailAddressInput';
import ForwardButton from '../form_elements/ForwardButton';
import PasswordInput from '../form_elements/PasswordInput';
import SubmitButton from '../form_elements/SubmitButton';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';
import { showNotification } from '../utilities/Notifier';
import { AccountSessionSignInRequest } from '../../networking/account_session/AccountSessionSignInRequest';
import { CookieService } from '../../services/CookieService';

type ILoginFormProps = RouteComponentProps<any, StaticContext> & WithTheme & {
    setIsLoggedIn(isLoggedIn: boolean): void;
};

interface ILoginFormState {
    form: IForm;
    formError: IFormError;
    showGuestSignInDialog: boolean;
    signInRequest: AccountSessionSignInRequest | null;
}

type IFormKeys =
    IUserKeys.eMailAddress |
    IUserKeys.password |
    IUserKeys.passwordRepetition;

interface IForm {
    [IUserKeys.eMailAddress]: string;
    [IUserKeys.password]: string;
}

interface IFormError {
    [IUserKeys.eMailAddress]: string | null;
    [IUserKeys.password]: string | null;
}

class LoginForm extends React.Component<ILoginFormProps, ILoginFormState> {

    private topMarginStyle: React.CSSProperties = {
        marginTop: 2 * this.props.theme.spacing()
    };
    private passwordResetTypographyStyle: React.CSSProperties = {
        color: CustomTheme.COLOR_WHITE,
        cursor: "pointer",
        display: "inline-block",
        marginTop: this.props.theme.spacing(),
        textAlign: "center"
    }
    private legalNoticeTypographyStyle: React.CSSProperties = {
        color: CustomTheme.COLOR_LINK,
        cursor: "pointer"
    }

    constructor(props: ILoginFormProps) {
        super(props);
        this.state = {
            form: {
                [IUserKeys.eMailAddress]: "",
                [IUserKeys.password]: ""
            },
            formError: {
                [IUserKeys.eMailAddress]: null,
                [IUserKeys.password]: null
            },
            showGuestSignInDialog: false,
            signInRequest: null
        };
    }

    public componentWillUnmount(): void {
        if (this.state.signInRequest) {
            this.state.signInRequest.cancel();
        }
    }

    public render(): React.ReactNode {
        if (this.state.signInRequest) {
            this.state.signInRequest.execute();
        }

        return (
            <>
                <Grid>

                    <GridItem
                        style={grid5Style}>
                        <Grid>
                            <EMailAddressInput
                                errorMessage={this.state.formError[IUserKeys.eMailAddress]}
                                onError={this.updateFormError}
                                onUpdateValue={this.updateForm}
                                showErrorMessageOnLoad={false}
                                themeType={ThemeTypes.LIGHT}
                                value={this.state.form[IUserKeys.eMailAddress]}
                            />

                            <PasswordInput
                                errorMessage={this.state.formError[IUserKeys.password]}
                                onError={this.updateFormError}
                                onKeyPressEnter={this.signIn}
                                onUpdateValue={this.updateForm}
                                showErrorMessageOnLoad={false}
                                style={this.topMarginStyle}
                                themeType={ThemeTypes.LIGHT}
                                value={this.state.form[IUserKeys.password]}
                            />

                            <Typography
                                onClick={this.forwardToResetPassword}
                                style={this.passwordResetTypographyStyle}>
                                <span>{Dict.navigation_request_password_reset}</span>
                            </Typography>

                            <SubmitButton
                                disabled={this.state.signInRequest !== null}
                                label={Dict.account_sign_in}
                                onClick={this.signIn}
                                style={this.topMarginStyle}
                            />

                        </Grid>
                    </GridItem>

                    <GridItem
                        style={grid2Style}>
                        <div>
                            <SubmitButton
                                label={Dict.account_sign_in_guest}
                                onClick={this.setGuestDialogVisible.bind(this, true)} />
                        </div>
                        <div
                            style={this.topMarginStyle}>
                            <ForwardButton
                                forwardTo={AppUrls.REGISTER}
                                label={Dict.account_sign_up} />
                        </div>
                    </GridItem>

                </Grid >

                <Dialog
                    onClose={this.setGuestDialogVisible.bind(this, false)}
                    open={this.state.showGuestSignInDialog!}
                >
                    <DialogTitle>{Dict.legal_notice_consent_heading}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {Dict.legal_notice_consent_paragraph_prefix}
                            <span onClick={this.forwardToLegalInformation} style={this.legalNoticeTypographyStyle}>
                                {Dict.legal_notice_heading}
                            </span>
                            {Dict.legal_notice_consent_paragraph_suffix}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.setGuestDialogVisible.bind(this, false)} color="primary">{Dict.label_cancel}</Button>
                        <Button onClick={this.signInAsGuest} color="primary">{Dict.label_confirm}</Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }

    public updateForm = (key: IFormKeys, value: string): void => {
        this.setState(prevState => {
            return {
                ...prevState,
                form: {
                    ...prevState.form,
                    [key]: value
                }
            }
        });
    }

    public updateFormError = (key: IFormKeys, value: string | null): void => {
        this.setState(prevState => {
            return {
                ...prevState,
                formError: {
                    ...prevState.formError,
                    [key]: value
                }
            }
        });
    }

    private setGuestDialogVisible = (visible: boolean): void => {
        this.setState({
            showGuestSignInDialog: visible
        });
    }

    private forwardToResetPassword = (): void => {
        this.props.history.push(
            AppUrls.HELP_RESET_PASSWORD
        );
    }

    private forwardToLegalInformation = (): void => {
        this.props.history.push(
            AppUrls.LEGAL_INFORMATION
        );
    }

    private signIn = (): void => {
        this.scheduleLocalRevalidation();

        if (!this.validate()) {
            return;
        }

        this.setState(prevState => {
            return {
                ...prevState,
                signInRequest: new AccountSessionSignInRequest(
                    this.state.form[IUserKeys.eMailAddress],
                    this.state.form[IUserKeys.password],
                    (response: IAccountSessionResponse) => {
                        const errorMsg = response.errorMsg;
                        const stateUpdateObj = {
                            ...this.state
                        }

                        if (errorMsg) {
                            let errorKey = null;

                            if (errorMsg.indexOf(IUserKeys.eMailAddress) > -1) {
                                errorKey = IUserKeys.eMailAddress;
                            } else if (errorMsg.indexOf(IUserKeys.password) > -1) {
                                errorKey = IUserKeys.password;
                            }

                            if (errorKey) {
                                stateUpdateObj.formError[errorKey] = Dict.hasOwnProperty(errorMsg) ? Dict[errorMsg] : errorMsg;
                            } else {
                                showNotification(errorMsg);
                            }
                        } else {
                            return registerPushManager()
                                .catch(exc => {
                                    log.warn(LogTags.PUSH_SUBSCRIPTION + exc);
                                })
                                .then(() => {
                                    this.props.setIsLoggedIn(true);
                                    this.props.history.push(AppUrls.HOME);
                                });
                        }

                        this.setState({
                            ...stateUpdateObj,
                            signInRequest: null
                        });
                    },
                    (error: any) => {
                        showNotification(Dict.error_message_timeout);
                        this.setState(innerPrevState => {
                            return {
                                ...innerPrevState,
                                signInRequest: null
                            }
                        });
                    }
                )
            }
        });
    }

    private signInAsGuest = (): void => {
        Promise.all([
            CookieService.set(
                IUserKeys.accessLevel,
                IUserValues[IUserKeys.accessLevel].guest
            ),
            CookieService.set(
                IUserKeys.accessIdentifier,
                IUserValues[IUserKeys.accessIdentifier][IUserValues[IUserKeys.accessLevel].guest]
            ),
            registerPushManager()
        ])
        .catch(exc => {
            log.warn(LogTags.AUTHENTICATION + exc);
        })
        .then(values => {
            this.props.setIsLoggedIn(true);
            this.props.history.push(
                AppUrls.HOME
            );
        });
    }

    private scheduleLocalRevalidation = (): void => {
        this.setState(prevState => {
            return {
                ...prevState,
                formError: {
                    [IUserKeys.eMailAddress]: null,
                    [IUserKeys.password]: null
                },
            };
        });
    }

    private validate = (): boolean => {
        return this.state.formError[IUserKeys.eMailAddress] !== EMailAddressInput.LOCAL_ERROR_MESSAGE
            && this.state.formError[IUserKeys.password] !== PasswordInput.LOCAL_ERROR_MESSAGE;
    }

}

export default withTheme(withRouter(LoginForm));