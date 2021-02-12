import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Typography, withTheme, WithTheme } from '@material-ui/core';

import Dict from '../../constants/dict';
import {
    grid1Style, grid6Style, successMsgTypographyStyle, ThemeTypes
} from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';
import {
    RequestAccountTransferMailRequest
} from '../../networking/account_data/RequestAccountTransferMailRequest';
import { IResponse } from '../../networking/Request';
import EMailAddressInput from '../form_elements/EMailAddressInput';
import SubmitButton from '../form_elements/SubmitButton';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';
import { showNotification } from '../utilities/Notifier';

type IRequestAccountTransferMailFormProps = RouteComponentProps<any, StaticContext> & WithTheme;

interface IRequestAccountTransferMailFormState {
    form: IForm;
    formError: IFormError;
    requestAccountTransferMailRequest: RequestAccountTransferMailRequest | null;
    successMsg: string | null;
}

type IFormKeys = IUserKeys.eMailAddress;

interface IForm {
    [IUserKeys.eMailAddress]: string;
}

interface IFormError {
    [IUserKeys.eMailAddress]: string | null;
}

class RequestAccountTransferMailForm extends React.Component<IRequestAccountTransferMailFormProps, IRequestAccountTransferMailFormState> {

    private accountTransferMailTypographyStyle: React.CSSProperties = {
        color: "#ffffff",
        display: "inline-block",
        marginBottom: 3 * this.props.theme.spacing(),
        textAlign: "center"
    };
    private marginTopStyle: React.CSSProperties = {
        marginTop: 2 * this.props.theme.spacing()
    };

    constructor(props: IRequestAccountTransferMailFormProps) {
        super(props);

        this.state = {
            form: {
                [IUserKeys.eMailAddress]: ""
            },
            formError: {
                [IUserKeys.eMailAddress]: null
            },
            requestAccountTransferMailRequest: null,
            successMsg: null
        };
    }

    public componentWillUnmount(): void {
        if (this.state.requestAccountTransferMailRequest) {
            this.state.requestAccountTransferMailRequest.cancel();
        }
    }

    public render(): React.ReactNode {
        if (this.state.requestAccountTransferMailRequest) {
            this.state.requestAccountTransferMailRequest.execute();
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
                    style={this.accountTransferMailTypographyStyle}>
                    <span>{Dict.navigation_request_account_transfer_mail}</span>
                </Typography>

                <EMailAddressInput
                    errorMessage={this.state.formError[IUserKeys.eMailAddress]}
                    onError={this.updateFormError}
                    onUpdateValue={this.updateForm}
                    showErrorMessageOnLoad={false}
                    themeType={ThemeTypes.LIGHT}
                    value={this.state.form[IUserKeys.eMailAddress]}
                />

                <SubmitButton
                    disabled={this.state.requestAccountTransferMailRequest !== null}
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

    private sendRequest = (): void => {
        if (this.state.formError[IUserKeys.eMailAddress] === EMailAddressInput.LOCAL_ERROR_MESSAGE) {
            return;
        }

        this.setState(prevState => {
            return {
                ...prevState,
                requestAccountTransferMailRequest: new RequestAccountTransferMailRequest(
                    this.state.form[IUserKeys.eMailAddress],
                    (response: IResponse) => {
                        const errorMsg = response.errorMsg;
                        const successMsg = response.successMsg;
                        const stateUpdateObj = {
                            ...this.state
                        };

                        if (errorMsg) {
                            if (errorMsg.indexOf(IUserKeys.eMailAddress) > -1) {
                                stateUpdateObj.formError[IUserKeys.eMailAddress]
                                    = Dict.hasOwnProperty(errorMsg) ? Dict[errorMsg] : errorMsg;
                            } else {
                                showNotification(errorMsg);
                            }
                        } else if (successMsg) {
                            stateUpdateObj.successMsg = Dict.hasOwnProperty(successMsg) ? Dict[successMsg] : successMsg;
                        }
                        this.setState({
                            ...stateUpdateObj,
                            requestAccountTransferMailRequest: null
                        });
                    },
                    (error: any) => {
                        showNotification(Dict.error_message_timeout);
                        this.setState(innerPrevState => {
                            return {
                                ...innerPrevState,
                                requestAccountTransferMailRequest: null
                            }
                        });
                    }
                )
            };
        });
    }

}

export default withTheme(withRouter(RequestAccountTransferMailForm));