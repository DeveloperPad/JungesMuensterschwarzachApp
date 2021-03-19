import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Typography, withTheme, WithTheme } from '@material-ui/core';

import Dict from '../../constants/dict';
import { AppUrls } from '../../constants/specific-urls';
import { grid7Style, successMsgTypographyStyle, ThemeTypes } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';
import { SignUpRequest } from '../../networking/account_data/SignUpRequest';
import { IResponse } from '../../networking/Request';
import AllowNewsletterCheckbox from '../form_elements/AllowNewsletterCheckbox';
import DisplayNameInput from '../form_elements/DisplayNameInput';
import EMailAddressInput from '../form_elements/EMailAddressInput';
import LegalInformationConsentCheckbox, { ILegalInformationConsentCheckBoxKeys } from '../form_elements/LegalInformationConsentCheckbox';
import PasswordInput from '../form_elements/PasswordInput';
import SubmitButton from '../form_elements/SubmitButton';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';
import { showNotification } from '../utilities/Notifier';

type IRegistrationFormProps = RouteComponentProps<any, StaticContext> & WithTheme;

interface IRegistrationFormState {
    form: IForm;
    formError: IFormError;
    signUpRequest: SignUpRequest | null;
    successMsg: string | null;
}

type IFormKeys = 
    IUserKeys.displayName |
    IUserKeys.eMailAddress |
    IUserKeys.allowNewsletter | 
    ILegalInformationConsentCheckBoxKeys.LegalInformationConsent |
    IUserKeys.password |
    IUserKeys.passwordRepetition;

interface IForm {
    [IUserKeys.displayName]: string;
    [IUserKeys.eMailAddress]: string;
    [IUserKeys.allowNewsletter]: number;
    [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]: boolean;
    [IUserKeys.password]: string;
    [IUserKeys.passwordRepetition]: string;
}

interface IFormError {
    [IUserKeys.displayName]: string | null;
    [IUserKeys.eMailAddress]: string | null;
    [IUserKeys.allowNewsletter]: string | null;
    [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]: string | null;
    [IUserKeys.password]: string | null;
    [IUserKeys.passwordRepetition]: string | null;
}

class RegistrationForm extends React.Component<IRegistrationFormProps, IRegistrationFormState> {

    private upperInputStyle: React.CSSProperties = {
        marginTop: this.props.theme.spacing(2)
    };

    constructor(props: IRegistrationFormProps) {
        super(props);

        this.state = {
            form: {
                [IUserKeys.displayName]: "",
                [IUserKeys.eMailAddress]: "",
                [IUserKeys.allowNewsletter]: 0,
                [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]: false,
                [IUserKeys.password]: "",
                [IUserKeys.passwordRepetition]: ""
            },
            formError: {
                [IUserKeys.displayName]: null,
                [IUserKeys.eMailAddress]: null,
                [IUserKeys.allowNewsletter]: null,
                [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]: null,
                [IUserKeys.password]: null,
                [IUserKeys.passwordRepetition]: null
            },
            signUpRequest: null,
            successMsg: null
        };
    }

    public componentWillUnmount(): void {
        if (this.state.signUpRequest) {
            this.state.signUpRequest.cancel();
        }
    }

    public render(): React.ReactNode {
        if (this.state.signUpRequest) {
            this.state.signUpRequest.execute();
        }

        return (
            <Grid>

                <GridItem
                    style={grid7Style}>
                    {this.state.successMsg ? this.showResponseGrid() : this.showRequestGrid()}
                </GridItem>

            </Grid >
        );
    }

    private showRequestGrid = (): React.ReactNode => {
        return (
            <Grid>

                <DisplayNameInput
                    errorMessage={this.state.formError[IUserKeys.displayName]}
                    onError={this.updateFormError}
                    onUpdateValue={this.updateForm}
                    showErrorMessageOnLoad={false}
                    style={this.upperInputStyle}
                    themeType={ThemeTypes.LIGHT}
                    value={this.state.form[IUserKeys.displayName]}
                />

                <EMailAddressInput
                    errorMessage={this.state.formError[IUserKeys.eMailAddress]}
                    onError={this.updateFormError}
                    onUpdateValue={this.updateForm}
                    showErrorMessageOnLoad={false}
                    style={this.upperInputStyle}
                    themeType={ThemeTypes.LIGHT}
                    value={this.state.form[IUserKeys.eMailAddress]}
                />

                <PasswordInput
                    errorMessage={this.state.formError[IUserKeys.password]}
                    onError={this.updateFormError}
                    onUpdateValue={this.updateForm}
                    showErrorMessageOnLoad={false}
                    style={this.upperInputStyle}
                    themeType={ThemeTypes.LIGHT}
                    value={this.state.form[IUserKeys.password]}
                />

                <PasswordInput
                    errorMessage={this.state.formError[IUserKeys.passwordRepetition]}
                    name={IUserKeys.passwordRepetition}
                    onError={this.updateFormError}
                    onUpdateValue={this.updateForm}
                    showErrorMessageOnLoad={false}
                    style={this.upperInputStyle}
                    themeType={ThemeTypes.LIGHT}
                    value={this.state.form[IUserKeys.passwordRepetition]}
                />

                <AllowNewsletterCheckbox
                    checked={this.state.form[IUserKeys.allowNewsletter] === 1}
                    errorMessage={this.state.formError[IUserKeys.allowNewsletter]}
                    onUpdateValue={this.updateForm}
                    showErrorMessageOnLoad={false}
                    style={this.upperInputStyle}
                    themeType={ThemeTypes.LIGHT}
                />

                <LegalInformationConsentCheckbox
                    checked={this.state.form[ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]}
                    errorMessage={this.state.formError[ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]}
                    onError={this.updateFormError}
                    onForwardToLegalInformation={this.forwardToLegalInformation}
                    onUpdateValue={this.updateForm}
                    showErrorMessageOnLoad={false}
                    style={this.upperInputStyle}
                />

                <SubmitButton
                    disabled={this.state.signUpRequest !== null}
                    label={Dict.account_sign_up}
                    onClick={this.signUp}
                    style={this.upperInputStyle}
                />

            </Grid>
        );
    }

    private showResponseGrid = (): React.ReactNode => {
        return (
            <Grid>
                <Typography
                    variant="h5"
                    style={successMsgTypographyStyle}>
                    <span>{this.state.successMsg}</span>
                </Typography>
            </Grid>
        );
    }

    private forwardToLegalInformation = (): void => {
        this.props.history.push(
            AppUrls.LEGAL_INFORMATION
        );
    }

    public updateForm = (key: IFormKeys, value: string | number | boolean): void => {
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

    private signUp = (): void => {
        this.scheduleLocalRevalidation();

        if (!this.validate()) {
            return;
        }

        this.setState(prevState => {
            return {
                ...prevState,
                signUpRequest: new SignUpRequest(
                    this.state.form[IUserKeys.displayName],
                    this.state.form[IUserKeys.eMailAddress],
                    this.state.form[IUserKeys.password],
                    this.state.form[IUserKeys.allowNewsletter],
                    (response: IResponse) => {
                        const errorMsg = response.errorMsg;
                        const successMsg = response.successMsg;
                        const stateUpdateObj = {
                            ...this.state
                        };
    
                        if (errorMsg) {
                            let errorKey = null;
                            
                            if (errorMsg.indexOf(IUserKeys.displayName) > -1) {
                                errorKey = IUserKeys.displayName;
                            } else if (errorMsg.indexOf(IUserKeys.eMailAddress) > -1) {
                                errorKey = IUserKeys.eMailAddress;
                            } else if (errorMsg.indexOf(IUserKeys.passwordRepetition) > -1) {
                                errorKey = IUserKeys.passwordRepetition;
                            } else if (errorMsg.indexOf(IUserKeys.password) > -1) {
                                errorKey = IUserKeys.password;
                            } else if (errorMsg.indexOf(IUserKeys.allowNewsletter) > -1) {
                                errorKey = IUserKeys.allowNewsletter;
                            }
    
                            if (errorKey) {
                                stateUpdateObj.formError[errorKey] = Dict.hasOwnProperty(errorMsg) ? Dict[errorMsg] : errorMsg;
                            } else {
                                showNotification(errorMsg);
                            }
                        } else if (successMsg) {
                            stateUpdateObj.successMsg = Dict.hasOwnProperty(successMsg) ? Dict[successMsg] : successMsg;
                        }
    
                        this.setState({
                            ...stateUpdateObj,
                            signUpRequest: null
                        });
                    },
                    (error: any) => {
                        showNotification(Dict.error_message_timeout);
                        this.setState(innerPrevState => {
                            return {
                                ...innerPrevState,
                                signUpRequest: null
                            }
                        });
                    }
                )
            }
        });
    }

    private scheduleLocalRevalidation = (): void => {
        this.setState(prevState => {
            return {
                ...prevState,
                formError: {
                    [IUserKeys.displayName]: null,
                    [IUserKeys.eMailAddress]: null,
                    [IUserKeys.allowNewsletter]: null,
                    [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]: null,
                    [IUserKeys.password]: null,
                    [IUserKeys.passwordRepetition]: null
                },
            };
        });
    }

    private validate = (): boolean => {
        let valid = true

        if (this.state.formError[IUserKeys.displayName] === DisplayNameInput.LOCAL_ERROR_MESSAGE
            || this.state.formError[IUserKeys.eMailAddress] === EMailAddressInput.LOCAL_ERROR_MESSAGE
            || this.state.formError[IUserKeys.passwordRepetition] === PasswordInput.LOCAL_ERROR_MESSAGE
            || this.state.formError[IUserKeys.password] === PasswordInput.LOCAL_ERROR_MESSAGE
            || this.state.formError[ILegalInformationConsentCheckBoxKeys.LegalInformationConsent] 
                === LegalInformationConsentCheckbox.LOCAL_ERROR_MESSAGE) {
            valid = false;
        }
        if (this.state.form[IUserKeys.password] !== this.state.form[IUserKeys.passwordRepetition]) {
            this.updateFormError(
                IUserKeys.passwordRepetition,
                Dict.account_passwordRepetition_incorrect
            );
            valid = false;
        }

        return valid;
    }

}

export default withTheme(withRouter(RegistrationForm));