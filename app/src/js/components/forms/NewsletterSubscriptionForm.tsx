import * as React from "react";

import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    withTheme,
    WithTheme,
} from "@material-ui/core";

import { Dict } from "../../constants/dict";
import {
    grid1Style,
    grid6Style,
    linkMsgTypographyStyle,
    successMsgTypographyStyle,
    ThemeTypes,
} from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { NewsletterSubscriptionRequest } from "../../networking/newsletter/NewsletterSubscriptionRequest";
import { IResponse } from "../../networking/Request";
import EMailAddressInput, {
    E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGE,
} from "../form_elements/EMailAddressInput";
import SubmitButton from "../form_elements/SubmitButton";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";
import { showNotification } from "../utilities/Notifier";
import { AppUrls } from "../../constants/specific-urls";
import LegalInformationConsentCheckbox, {
    ILegalInformationConsentCheckBoxKeys,
} from "../form_elements/LegalInformationConsentCheckbox";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

type INewsletterSubscriptionFormProps = WithTheme;

type IFormKeys =
    | IUserKeys.eMailAddress
    | ILegalInformationConsentCheckBoxKeys.LegalInformationConsent;

interface IForm {
    [IUserKeys.eMailAddress]: string;
    [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]: boolean;
}

interface IFormError {
    [IUserKeys.eMailAddress]: string | null;
    [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]:
        | string
        | null;
}

const NewsletterSubscriptionForm = (
    props: INewsletterSubscriptionFormProps
) => {
    const { theme } = props;

    const [form, setForm] = useState<IForm>({
        [IUserKeys.eMailAddress]: "",
        [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]: false,
    });
    const [formError, setFormError] = useState<IFormError>({
        [IUserKeys.eMailAddress]: null,
        [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]: null,
    });
    const [successMsg, setSuccessMsg] = useState<string>();
    const subscriptionRequest = useRef<NewsletterSubscriptionRequest>();

    const navigate = useNavigate();

    const marginTopStyle: React.CSSProperties = {
        marginTop: 2 * theme.spacing(),
    };
    const cardHeaderStyle: React.CSSProperties = {
        backgroundColor: "#cccccc",
        color: "#ff0000",
        padding: "4px 8px",
    };
    const cardContentStyle: React.CSSProperties = {
        backgroundColor: "#eeeeee",
        padding: "4px 8px",
    };
    const cardTypographyStyle: React.CSSProperties = {
        display: "inline-block",
        textAlign: "center",
    };
    const typographyStyle: React.CSSProperties = {
        color: "#ffffff",
        display: "inline-block",
        textAlign: "center",
    };

    const updateForm = (key: IFormKeys, value: string | boolean): void => {
        setForm((form) => {
            return {
                ...form,
                [key]: value,
            };
        });
    };
    const updateFormError = (key: IFormKeys, value: string | null): void => {
        setFormError((formError) => {
            formError[key] = value;
            return formError;
        });
    };
    const sendRequest = (): void => {
        if (
            formError[IUserKeys.eMailAddress] ===
            E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGE
        ) {
            return;
        }

        subscriptionRequest.current = new NewsletterSubscriptionRequest(
            form[IUserKeys.eMailAddress],
            (response: IResponse) => {
                const errorMsg = response.errorMsg;
                const successMsg = response.successMsg;

                if (errorMsg) {
                    if (errorMsg.indexOf(IUserKeys.eMailAddress) > -1) {
                        updateFormError(
                            IUserKeys.eMailAddress,
                            Dict[errorMsg] ?? errorMsg
                        );
                    } else {
                        showNotification(errorMsg);
                    }
                } else if (successMsg) {
                    setSuccessMsg(Dict[successMsg] ?? successMsg);
                }

                subscriptionRequest.current = null;
            },
            (error: any) => {
                showNotification(Dict.error_message_timeout);
                subscriptionRequest.current = null;
            }
        );
        subscriptionRequest.current.execute();
    };

    useEffect(() => {
        return () => {
            if (subscriptionRequest.current) {
                subscriptionRequest.current.cancel();
            }
        };
    });

    const showRequestGrid = (): React.ReactElement<any> => {
        return (
            <Grid>
                <div style={marginTopStyle} />
                <Typography style={typographyStyle} variant="h5">
                    <span>{Dict.navigation_newsletter_subscribe}</span>
                </Typography>

                <div style={marginTopStyle} />
                <Typography style={typographyStyle}>
                    <span>{Dict.account_allowNewsletter_registration}</span>
                </Typography>

                <EMailAddressInput
                    errorMessage={formError[IUserKeys.eMailAddress]}
                    onError={updateFormError}
                    onUpdateValue={updateForm}
                    showErrorMessageOnLoad={false}
                    themeType={ThemeTypes.LIGHT}
                    value={form[IUserKeys.eMailAddress]}
                />

                <LegalInformationConsentCheckbox
                    checked={
                        form[
                            ILegalInformationConsentCheckBoxKeys
                                .LegalInformationConsent
                        ]
                    }
                    errorMessage={
                        formError[
                            ILegalInformationConsentCheckBoxKeys
                                .LegalInformationConsent
                        ]
                    }
                    onError={updateFormError}
                    onForwardToLegalInformation={navigate.bind(
                        this,
                        AppUrls.LEGAL_INFORMATION
                    )}
                    onUpdateValue={updateForm}
                    showErrorMessageOnLoad={false}
                    style={marginTopStyle}
                />

                <SubmitButton
                    disabled={
                        subscriptionRequest !== null ||
                        form[
                            ILegalInformationConsentCheckBoxKeys
                                .LegalInformationConsent
                        ] === false
                    }
                    label={Dict.account_sign_in}
                    onClick={sendRequest}
                    style={marginTopStyle}
                />

                <Card variant="outlined" style={marginTopStyle}>
                    <CardHeader
                        disableTypography={true}
                        title={
                            <Typography variant="body1">
                                {Dict.label_notice}
                            </Typography>
                        }
                        style={cardHeaderStyle}
                    />
                    <CardContent style={cardContentStyle}>
                        <Typography style={cardTypographyStyle}>
                            {Dict.account_allowNewsletter_account_notice_prefix}
                            <span
                                onClick={navigate.bind(this, AppUrls.PROFILE)}
                                style={linkMsgTypographyStyle}
                            >
                                {Dict.navigation_profile}
                            </span>
                            {Dict.account_allowNewsletter_account_notice_suffix}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        );
    };
    const showResponseGrid = (): React.ReactElement<any> => {
        return (
            <Grid>
                <Typography variant="h5" style={successMsgTypographyStyle}>
                    <span>{successMsg}</span>
                </Typography>
            </Grid>
        );
    };
    return (
        <Grid>
            <GridItem style={grid6Style}>
                {successMsg ? showResponseGrid() : showRequestGrid()}
            </GridItem>
            <GridItem style={grid1Style}>
            </GridItem>
        </Grid>
    );
};

export default withTheme(NewsletterSubscriptionForm);
