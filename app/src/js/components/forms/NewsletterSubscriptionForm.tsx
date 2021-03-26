import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Card, CardContent, CardHeader, Typography, withTheme, WithTheme } from '@material-ui/core';

import Dict from '../../constants/dict';
import {
    grid1Style, grid6Style, linkMsgTypographyStyle, successMsgTypographyStyle, ThemeTypes
} from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';
import {
    NewsletterSubscriptionRequest
} from '../../networking/newsletter/NewsletterSubscriptionRequest';
import { IResponse } from '../../networking/Request';
import EMailAddressInput from '../form_elements/EMailAddressInput';
import SubmitButton from '../form_elements/SubmitButton';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';
import { showNotification } from '../utilities/Notifier';
import { AppUrls } from '../../constants/specific-urls';
import LegalInformationConsentCheckbox, { ILegalInformationConsentCheckBoxKeys } from '../form_elements/LegalInformationConsentCheckbox';

type INewsletterSubscriptionFormProps = RouteComponentProps<any, StaticContext> & WithTheme;

interface INewsletterSubscriptionFormState {
    form: IForm;
    formError: IFormError;
    subscriptionRequest: NewsletterSubscriptionRequest | null;
    successMsg: string | null;
}

type IFormKeys = IUserKeys.eMailAddress | ILegalInformationConsentCheckBoxKeys.LegalInformationConsent;

interface IForm {
    [IUserKeys.eMailAddress]: string;
    [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]: boolean;
}

interface IFormError {
    [IUserKeys.eMailAddress]: string | null;
    [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]: string | null;
}

class NewsletterSubscriptionForm 
    extends React.Component<INewsletterSubscriptionFormProps, INewsletterSubscriptionFormState> {

    private marginTopStyle: React.CSSProperties = {
        marginTop: 2 * this.props.theme.spacing()
    };
    private cardHeaderStyle: React.CSSProperties = {
        backgroundColor: "#cccccc",
        color: "#ff0000",
        padding: "4px 8px"
    }
    private cardContentStyle: React.CSSProperties = {
        backgroundColor: "#eeeeee",
        padding: "4px 8px"
    }
    private cardTypographyStyle: React.CSSProperties = {
        display: "inline-block",
        textAlign: "center"
    }
    private typographyStyle: React.CSSProperties = {
        color: "#ffffff",
        display: "inline-block",
        textAlign: "center"
    };

    constructor(props: INewsletterSubscriptionFormProps) {
        super(props);

        this.state = {
            form: {
                [IUserKeys.eMailAddress]: "",
                [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]: false
            },
            formError: {
                [IUserKeys.eMailAddress]: null,
                [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]: null
            },
            subscriptionRequest: null,
            successMsg: null
        };
    }

    public componentWillUnmount(): void {
        if (this.state.subscriptionRequest) {
            this.state.subscriptionRequest.cancel();
        }
    }

    public render(): React.ReactNode {
        if (this.state.subscriptionRequest) {
            this.state.subscriptionRequest.execute();
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
                <div style={this.marginTopStyle}/>
                <Typography
                    style={this.typographyStyle}
                    variant="h5">
                    <span>{Dict.navigation_newsletter_subscribe}</span>
                </Typography>

                <div style={this.marginTopStyle}/>
                <Typography
                    style={this.typographyStyle}>
                    <span>{Dict.account_allowNewsletter_registration}</span>
                </Typography>

                <EMailAddressInput
                    errorMessage={this.state.formError[IUserKeys.eMailAddress]}
                    onError={this.updateFormError}
                    onUpdateValue={this.updateForm}
                    showErrorMessageOnLoad={false}
                    themeType={ThemeTypes.LIGHT}
                    value={this.state.form[IUserKeys.eMailAddress]}
                />

                <LegalInformationConsentCheckbox
                    checked={this.state.form[ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]}
                    errorMessage={this.state.formError[ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]}
                    onError={this.updateFormError}
                    onForwardToLegalInformation={this.forwardToLegalInformation}
                    onUpdateValue={this.updateForm}
                    showErrorMessageOnLoad={false}
                    style={this.marginTopStyle}
                />

                <SubmitButton
                    disabled={this.state.subscriptionRequest !== null || 
                        this.state.form[ILegalInformationConsentCheckBoxKeys.LegalInformationConsent] === false}
                    label={Dict.account_sign_in}
                    onClick={this.sendRequest}
                    style={this.marginTopStyle}
                />

                <Card variant="outlined" style={this.marginTopStyle}>
                    <CardHeader
                        disableTypography={true}
                        title={
                            <Typography variant="body1">
                                {Dict.label_notice}
                            </Typography>
                        }
                        style={this.cardHeaderStyle} />
                    <CardContent style={this.cardContentStyle}>
                        <Typography style={this.cardTypographyStyle}>
                            {Dict.account_allowNewsletter_account_notice_prefix}
                            <span onClick={this.forwardToProfile} style={linkMsgTypographyStyle}>
                                {Dict.navigation_profile}
                            </span>
                            {Dict.account_allowNewsletter_account_notice_suffix}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        );
    }

    private forwardToLegalInformation = (): void => {
        this.props.history.push(
            AppUrls.LEGAL_INFORMATION
        );
    }

    private forwardToProfile = (): void => {
        this.props.history.push(
            AppUrls.PROFILE
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

    public updateForm = (key: IFormKeys, value: string|boolean): void => {
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
                subscriptionRequest: new NewsletterSubscriptionRequest(
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
                            subscriptionRequest: null
                        });
                    },
                    (error: any) => {
                        showNotification(Dict.error_message_timeout);
                        this.setState(innerPrevState => {
                            return {
                                ...innerPrevState,
                                subscriptionRequest: null
                            }
                        });
                    }
                )
            }
        });
    }

}

export default withTheme(withRouter(NewsletterSubscriptionForm));