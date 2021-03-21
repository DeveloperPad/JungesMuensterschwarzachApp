import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Typography, withTheme, WithTheme } from '@material-ui/core';

import Dict from '../../constants/dict';
import { AppUrls } from '../../constants/specific-urls';
import {
    grid1Style, grid6Style, successMsgTypographyStyle, ThemeTypes
} from '../../constants/theme';
import { NewsletterRedemptionRequest } from '../../networking/newsletter/NewsletterRedemptionRequest';
import { IResponse } from '../../networking/Request';
import SubmitButton from '../form_elements/SubmitButton';
import TokenInput, { ITokenInputKeys } from '../form_elements/TokenInput';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';
import { showNotification } from '../utilities/Notifier';

type INewsletterRedemptionFormProps = RouteComponentProps<any, StaticContext> & WithTheme;

interface INewsletterRedemptionFormState {
    form: IForm;
    formError: IFormError;
    successMsg: string | null;
    redemptionRequest: NewsletterRedemptionRequest | null;
}

type IFormKeys = ITokenInputKeys.tokenCode;

interface IForm {
    [ITokenInputKeys.tokenCode]: string;
}

interface IFormError {
    [ITokenInputKeys.tokenCode]: string | null;
}

class NewsletterRedemptionForm 
    extends React.Component<INewsletterRedemptionFormProps, INewsletterRedemptionFormState> {

    private typographyStyle: React.CSSProperties = {
        color: "#ffffff",
        display: "inline-block",
        marginBottom: 3 * this.props.theme.spacing(),
        textAlign: "center"
    };
    private marginTopStyle: React.CSSProperties = {
        marginTop: 2 * this.props.theme.spacing()
    };

    constructor(props: INewsletterRedemptionFormProps) {
        super(props);

        this.state = {
            form: {
                [ITokenInputKeys.tokenCode]: this.getTokenCode()
            },
            formError: {
                [ITokenInputKeys.tokenCode]: null
            },
            successMsg: null,
            redemptionRequest: null
        };
    }

    public componentDidMount(): void {
        if (this.state.form[ITokenInputKeys.tokenCode] 
            && this.state.form[ITokenInputKeys.tokenCode].trim().length > 0) {
            this.sendRequest();
        }
    }

    public componentWillUnmount(): void {
        if (this.state.redemptionRequest) {
            this.state.redemptionRequest.cancel();
        }
    }

    public render(): React.ReactNode {
        if (this.state.redemptionRequest) {
            this.state.redemptionRequest.execute();
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
                    style={this.typographyStyle}>
                    <span>{Dict.navigation_redeem_token}</span>
                </Typography>

                <TokenInput
                    errorMessage={this.state.formError[ITokenInputKeys.tokenCode]}
                    onUpdateValue={this.updateForm}
                    themeType={ThemeTypes.LIGHT}
                    value={this.state.form[ITokenInputKeys.tokenCode]}
                />

                <SubmitButton
                    disabled={this.state.redemptionRequest !== null}
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
                redemptionRequest: this.createRedemptionRequest()
            }
        });
    }

    private createRedemptionRequest = (): NewsletterRedemptionRequest => {
        return new NewsletterRedemptionRequest(
            this.state.form[ITokenInputKeys.tokenCode],
            (response: IResponse) => {
                const errorMsg = response.errorMsg;
                const successMsg = response.successMsg;
                const stateUpdateObj = {
                    ...this.state
                };

                if (errorMsg) {
                    if (errorMsg.indexOf("token") > -1) {
                        stateUpdateObj.formError[ITokenInputKeys.tokenCode] =
                            Dict.hasOwnProperty(errorMsg) ? Dict[errorMsg] : errorMsg;
                    } else {
                        showNotification(errorMsg);
                    }
                } else if (successMsg) {
                    stateUpdateObj.successMsg = Dict.hasOwnProperty(successMsg) ? Dict[successMsg] : successMsg;
                }

                this.setState({
                    ...stateUpdateObj,
                    redemptionRequest: null
                });
            },
            (error: any) => {
                showNotification(Dict.error_message_timeout);
                this.setState(innerPrevState => {
                    return {
                        ...innerPrevState,
                        redemptionRequest: null
                    }
                });
            }
        );
    }

    private getTokenCode = (): string => {
        return decodeURI(this.props.location.pathname.slice((AppUrls.HELP_NEWSLETTER_REDEEM + "/").length));
    }

}

export default withTheme(withRouter(NewsletterRedemptionForm));