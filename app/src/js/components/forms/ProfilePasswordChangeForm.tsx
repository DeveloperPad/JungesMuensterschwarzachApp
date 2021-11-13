import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Typography, withTheme, WithTheme } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import {
    grid1Style, grid6Style, infoMessageTypographyStyle, ThemeTypes
} from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';
import { UpdateAccountDataRequest } from '../../networking/account_data/UpdateAccountDataRequest';
import { IResponse } from '../../networking/Request';
import PasswordInput from '../form_elements/PasswordInput';
import SubmitButton from '../form_elements/SubmitButton';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';
import { showNotification } from '../utilities/Notifier';

type IProfilePasswordChangeFormProps = RouteComponentProps<any, StaticContext> & WithTheme;

interface IProfilePasswordChangeFormState {
    infoMsg?: string | null;
    form: IForm;
    formError: IFormError;
    updateAccountDataRequest?: UpdateAccountDataRequest | null;
}

type IFormKeys = 
    IUserKeys.password | 
    IUserKeys.passwordRepetition | 
    IUserKeys.eMailAddress;

interface IForm {
    [IUserKeys.password]: string;
    [IUserKeys.passwordRepetition]: string;
}

interface IFormError {
    [IUserKeys.password]: string | null;
    [IUserKeys.passwordRepetition]: string | null;
}

class ProfilePasswordChangeForm extends React.Component<IProfilePasswordChangeFormProps, IProfilePasswordChangeFormState> {

    private topMarginStyle: React.CSSProperties = {
        marginTop: 2 * this.props.theme.spacing()
    }
    private newPasswortTypographyStyle: React.CSSProperties = {
        color: "#ffffff",
        display: "inline-block",
        marginBottom: 3 * this.props.theme.spacing(),
        textAlign: "center"
    }

    constructor(props: IProfilePasswordChangeFormProps) {
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
            infoMsg: null,
            updateAccountDataRequest: null
        };
    }

    public componentWillUnmount(): void {
        if (this.state.updateAccountDataRequest) {
            this.state.updateAccountDataRequest.cancel();
        }
    }

    public render(): React.ReactNode {
        if (this.state.updateAccountDataRequest) {
            this.state.updateAccountDataRequest.execute();
        }

        return (
            <Grid>
                <GridItem
                    style={grid6Style}>
                    {this.state.infoMsg ? this.showResponseGrid() : this.showRequestGrid()}
                </GridItem>
                <GridItem
                    style={grid1Style}
                />
            </Grid>
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

    private showRequestGrid = (): React.ReactNode => {
        return (
            <Grid>
                <Typography
                    variant="h5"
                    style={this.newPasswortTypographyStyle}>
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
                    style={this.topMarginStyle}
                    themeType={ThemeTypes.LIGHT}
                    value={this.state.form[IUserKeys.passwordRepetition]}
                />

                <SubmitButton
                    disabled={this.state.updateAccountDataRequest !== null}
                    onClick={this.sendRequest}
                    style={this.topMarginStyle}
                />
            </Grid>
        );
    }

    private showResponseGrid = (): React.ReactNode => {
        return (
            <Grid>
                <Typography
                    variant="h5"
                    style={infoMessageTypographyStyle}>
                    <span>{this.state.infoMsg}</span>
                </Typography>
            </Grid>
        );
    }

    private sendRequest = (): void => {
        this.scheduleLocalRevalidation();

        if (!this.validate()) {
            return;
        }
        
        this.setState(prevState => {
            return {
                ...prevState,
                updateAccountDataRequest: new UpdateAccountDataRequest(
                    IUserKeys.password,
                    this.state.form[IUserKeys.password],
                    (response: IResponse) => {
                        const errorMsg = response.errorMsg;
                        const stateUpdateObj = {
                            ...this.state
                        };

                        if (errorMsg) {
                            if (errorMsg.indexOf(IUserKeys.passwordRepetition) > -1) {
                                stateUpdateObj.formError[IUserKeys.passwordRepetition] = 
                                    Dict.hasOwnProperty(errorMsg) ? Dict[errorMsg] : errorMsg;
                            } else if (errorMsg.indexOf(IUserKeys.password) > -1) {
                                stateUpdateObj.formError[IUserKeys.password] = 
                                    Dict.hasOwnProperty(errorMsg) ? Dict[errorMsg] : errorMsg;
                            } else {
                                showNotification(errorMsg);
                            }
                        } else {
                            stateUpdateObj.infoMsg = Dict.account_password_updated;
                        }

                        this.setState({
                            ...stateUpdateObj,
                            updateAccountDataRequest: null
                        });
                    },
                    () => {
                        showNotification(Dict.error_message_timeout);
                        this.setState(innerPrevState => {
                            return {
                                ...innerPrevState,
                                updateAccountDataRequest: null
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
                    [IUserKeys.password]: null,
                    [IUserKeys.passwordRepetition]: null
                }
            };
        });
    }

    private validate = (): boolean => {
        let valid = true

        if (this.state.formError[IUserKeys.passwordRepetition] === PasswordInput.LOCAL_ERROR_MESSAGE
            || this.state.formError[IUserKeys.password] === PasswordInput.LOCAL_ERROR_MESSAGE) {
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

export default withTheme(withRouter(ProfilePasswordChangeForm));