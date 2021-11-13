import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Typography, withTheme, WithTheme } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import { AppUrls } from '../../constants/specific-urls';
import {
    grid1Style, grid6Style, successMsgTypographyStyle, ThemeTypes
} from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';
import {
    TokenRedemptionPasswordResetRequest
} from '../../networking/account_data/TokenRedemptionPasswordResetRequest';
import { IResponse } from '../../networking/Request';
import PasswordInput from '../form_elements/PasswordInput';
import SubmitButton from '../form_elements/SubmitButton';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';
import { showNotification } from '../utilities/Notifier';

type ITokenRedemptionPasswordResetFormProps = RouteComponentProps<any, StaticContext> & WithTheme;

interface ITokenRedemptionPasswordResetFormState {
    form: IForm;
    formError: IFormError;
    successMsg: string | null;
    tokenCode: string;
    tokenRedemptionPasswordResetRequest: TokenRedemptionPasswordResetRequest | null;
}

type IFormKeys = 
    IUserKeys.password |
    IUserKeys.passwordRepetition;

interface IForm {
    [IUserKeys.password]: string;
    [IUserKeys.passwordRepetition]: string;
}

interface IFormError {
    [IUserKeys.password]: string | null;
    [IUserKeys.passwordRepetition]: string | null;
}

class TokenRedemptionPasswordResetPage extends React.Component<ITokenRedemptionPasswordResetFormProps, ITokenRedemptionPasswordResetFormState> {

    private accountNewPasswortTypographyStyle: React.CSSProperties = {
        color: "#ffffff",
        display: "inline-block",
        marginBottom: this.props.theme.spacing(3),
        textAlign: "center"
    };
    private marginTopStyle: React.CSSProperties = {
        marginTop: this.props.theme.spacing(2)
    };

    constructor(props: ITokenRedemptionPasswordResetFormProps) {
        super(props);

        this.state = {
            form: {
                [IUserKeys.password]: "",
                [IUserKeys.passwordRepetition]: ""
            },
            formError: {
                [IUserKeys.password]: null,
                [IUserKeys.passwordRepetition]: null
            },
            successMsg: null,
            tokenCode: this.getTokenCode(),
            tokenRedemptionPasswordResetRequest: null
        };
    }

    public componentWillUnmount(): void {
        if (this.state.tokenRedemptionPasswordResetRequest) {
            this.state.tokenRedemptionPasswordResetRequest.cancel();
        }
    }

    public render(): React.ReactNode {
        if (this.state.tokenRedemptionPasswordResetRequest) {
            this.state.tokenRedemptionPasswordResetRequest.execute();
        }

        return (
            <Grid>
                <GridItem
                    style={grid6Style}>
                    {this.state.successMsg ? this.showResponseGrid() : this.showRequestGrid()}
                </GridItem>
                <GridItem
                    style={grid1Style} />
            </Grid>
        );
    }    

    private showRequestGrid = (): React.ReactNode => {
        return (
            <Grid>
                <Typography
                    variant="h5"
                    style={this.accountNewPasswortTypographyStyle}>
                    <span>{Dict.account_password_new}</span>
                </Typography>

                <PasswordInput
                    errorMessage={this.state.formError[IUserKeys.password]}
                    onError={this.updateFormError}
                    onUpdateValue={this.updateForm}
                    showErrorMessageOnLoad={false}
                    themeType={ThemeTypes.LIGHT}
                    value={this.state.form[IUserKeys.password]}
                />

                <PasswordInput
                    errorMessage={this.state.formError[IUserKeys.passwordRepetition]}
                    name={IUserKeys.passwordRepetition}
                    onError={this.updateFormError}
                    onUpdateValue={this.updateForm}
                    showErrorMessageOnLoad={false}
                    style={this.marginTopStyle}
                    themeType={ThemeTypes.LIGHT}
                    value={this.state.form[IUserKeys.passwordRepetition]}
                />

                <SubmitButton
                    disabled={this.state.tokenRedemptionPasswordResetRequest !== null}
                    onClick={this.sendRequest}
                    style={this.marginTopStyle}
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

    public updateForm = (key: IFormKeys, value: string | boolean): void => {
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

    private sendRequest = (): void => {
        if (this.state.formError[IUserKeys.passwordRepetition] === PasswordInput.LOCAL_ERROR_MESSAGE
            || this.state.formError[IUserKeys.password] === PasswordInput.LOCAL_ERROR_MESSAGE) {
            return;
        }

        if (this.state.form[IUserKeys.password] !== this.state.form[IUserKeys.passwordRepetition]) {
            this.updateFormError(
                IUserKeys.passwordRepetition,
                Dict.account_passwordRepetition_incorrect
            );
            return;
        }

        this.setState(prevState => {
            return {
                ...prevState,
                tokenRedemptionPasswordResetRequest: new TokenRedemptionPasswordResetRequest(
                    this.state.tokenCode,
                    this.state.form[IUserKeys.password],
                    (response: IResponse) => {
                        const errorMsg = response.errorMsg;
                        const successMsg = response.successMsg;
                        const stateUpdateObj = {
                            ...this.state
                        };
    
                        if (errorMsg) {
                            if (errorMsg.indexOf("token") > -1) {
                                showNotification(errorMsg);
                                this.props.history.push(
                                    AppUrls.HELP_REDEEM_TOKEN
                                );
                            } else if (errorMsg.indexOf(IUserKeys.passwordRepetition) > -1) {
                                stateUpdateObj.formError[IUserKeys.passwordRepetition] = 
                                    Dict.hasOwnProperty(errorMsg) ? Dict[errorMsg] : errorMsg;
                            } else if (errorMsg.indexOf(IUserKeys.password) > -1) {
                                stateUpdateObj.formError[IUserKeys.password] =
                                    Dict.hasOwnProperty(errorMsg) ? Dict[errorMsg] : errorMsg;
                            } else {
                                showNotification(errorMsg);
                            }
                        } else if (successMsg) {
                            stateUpdateObj.successMsg = Dict.hasOwnProperty(successMsg) ? Dict[successMsg] : successMsg;
                        }
    
                        this.setState({
                            ...stateUpdateObj,
                            tokenRedemptionPasswordResetRequest: null
                        });
                    },
                    (error: any) => {
                        showNotification(Dict.error_message_timeout);
                        this.setState(innerPrevState => {
                            return {
                                ...innerPrevState,
                                tokenRedemptionPasswordResetRequest: null
                            }
                        });
                    }
                )
            }
        });
    }

    private getTokenCode = (): string => {
        return decodeURI(this.props.location.pathname.slice((AppUrls.HELP_REDEEM_TOKEN_RESET_PASSWORD + "/").length));
    }

}

export default withTheme(withRouter(TokenRedemptionPasswordResetPage));