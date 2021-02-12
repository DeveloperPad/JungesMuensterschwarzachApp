import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Typography, withTheme, WithTheme } from '@material-ui/core';

import Dict from '../../constants/dict';
import { AppUrls } from '../../constants/specific-urls';
import {
    grid1Style, grid6Style, successMsgTypographyStyle, ThemeTypes
} from '../../constants/theme';
import { TokenRedemptionRequest } from '../../networking/account_data/TokenRedemptionRequest';
import { IResponse } from '../../networking/Request';
import SubmitButton from '../form_elements/SubmitButton';
import TokenInput, { ITokenInputKeys } from '../form_elements/TokenInput';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';
import { showNotification } from '../utilities/Notifier';

type ITokenRedemptionFormProps = RouteComponentProps<any, StaticContext> & WithTheme;

interface ITokenRedemptionFormState {
    form: IForm;
    formError: IFormError;
    successMsg: string | null;
    tokenRedemptionRequest: TokenRedemptionRequest | null;
}

type IFormKeys = ITokenInputKeys.tokenCode;

interface IForm {
    [ITokenInputKeys.tokenCode]: string;
}

interface IFormError {
    [ITokenInputKeys.tokenCode]: string | null;
}

class TokenRedemptionForm extends React.Component<ITokenRedemptionFormProps, ITokenRedemptionFormState> {

    private redeemTokenTypographyStyle: React.CSSProperties = {
        color: "#ffffff",
        display: "inline-block",
        marginBottom: 3 * this.props.theme.spacing(),
        textAlign: "center"
    };
    private marginTopStyle: React.CSSProperties = {
        marginTop: 2 * this.props.theme.spacing()
    };

    constructor(props: ITokenRedemptionFormProps) {
        super(props);

        this.state = {
            form: {
                [ITokenInputKeys.tokenCode]: this.getTokenCode()
            },
            formError: {
                [ITokenInputKeys.tokenCode]: null
            },
            successMsg: null,
            tokenRedemptionRequest: null
        };
    }

    public componentDidMount(): void {
        if (this.state.form[ITokenInputKeys.tokenCode] 
            && this.state.form[ITokenInputKeys.tokenCode].trim().length > 0) {
            this.sendRequest();
        }
    }

    public componentWillUnmount(): void {
        if (this.state.tokenRedemptionRequest) {
            this.state.tokenRedemptionRequest.cancel();
        }
    }

    public render(): React.ReactNode {
        if (this.state.tokenRedemptionRequest) {
            this.state.tokenRedemptionRequest.execute();
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
                    style={this.redeemTokenTypographyStyle}>
                    <span>{Dict.navigation_redeem_token}</span>
                </Typography>

                <TokenInput
                    errorMessage={this.state.formError[ITokenInputKeys.tokenCode]}
                    onUpdateValue={this.updateForm}
                    themeType={ThemeTypes.LIGHT}
                    value={this.state.form[ITokenInputKeys.tokenCode]}
                />

                <SubmitButton
                    disabled={this.state.tokenRedemptionRequest !== null}
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

    private sendRequest = (): void => {
        this.setState(prevState => {
            return {
                ...prevState,
                tokenRedemptionRequest: this.createTokenRedemptionRequest()
            }
        });
    }

    private createTokenRedemptionRequest = (): TokenRedemptionRequest => {
        return new TokenRedemptionRequest(
            this.state.form[ITokenInputKeys.tokenCode],
            (response: IResponse) => {
                const errorMsg = response.errorMsg;
                const successMsg = response.successMsg;
                const stateUpdateObj = {
                    ...this.state
                };

                if (errorMsg) {
                    if (errorMsg.indexOf("token") > -1 || errorMsg.indexOf("account") > -1) {
                        stateUpdateObj.formError[ITokenInputKeys.tokenCode] =
                            Dict.hasOwnProperty(errorMsg) ? Dict[errorMsg] : errorMsg;
                    } else {
                        showNotification(errorMsg);
                    }
                } else if (successMsg) {
                    if (successMsg === "account_password_new") {
                        this.props.history.push(
                            AppUrls.HELP_REDEEM_TOKEN_RESET_PASSWORD + "/" + encodeURI(this.state.form[ITokenInputKeys.tokenCode])
                        );
                    } else {
                        stateUpdateObj.successMsg = Dict.hasOwnProperty(successMsg) ? Dict[successMsg] : successMsg;
                    }
                }

                this.setState({
                    ...stateUpdateObj,
                    tokenRedemptionRequest: null
                });
            },
            (error: any) => {
                showNotification(Dict.error_message_timeout);
                this.setState(innerPrevState => {
                    return {
                        ...innerPrevState,
                        tokenRedemptionRequest: null
                    }
                });
            }
        );
    }

    private getTokenCode = (): string => {
        return decodeURI(this.props.location.pathname.slice((AppUrls.HELP_REDEEM_TOKEN + "/").length));
    }

}

export default withTheme(withRouter(TokenRedemptionForm));