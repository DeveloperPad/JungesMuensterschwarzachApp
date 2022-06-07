import * as React from "react";
import { useNavigate } from "react-router";

import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    withTheme,
    WithTheme,
} from "@material-ui/core";

import { Dict } from "../../constants/dict";
import { AppUrls } from "../../constants/specific-urls";
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
    E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGES,
} from "../form_elements/EMailAddressInput";
import LegalInformationConsentCheckbox, {
    ILegalInformationConsentCheckBoxKeys,
} from "../form_elements/LegalInformationConsentCheckbox";
import SubmitButton from "../form_elements/SubmitButton";
import { useRequestQueue } from "../utilities/CustomHooks";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";
import { showNotification } from "../utilities/Notifier";

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
    const navigate = useNavigate();
    const { theme } = props;
    const [form, setForm] = React.useState<IForm>({
        [IUserKeys.eMailAddress]: "",
        [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]: false,
    });
    const [formError, setFormError] = React.useState<IFormError>({
        [IUserKeys.eMailAddress]: null,
        [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]: null,
    });
    const [successMsg, setSuccessMsg] = React.useState<string>();
    const [request, isRequestRunning] = useRequestQueue();
    const suppressErrorMsgs = React.useRef<boolean>(true);

    const marginTopStyle: React.CSSProperties = React.useMemo(
        () => ({
            marginTop: 2 * theme.spacing(),
        }),
        [theme]
    );
    const cardHeaderStyle: React.CSSProperties = React.useMemo(
        () => ({
            backgroundColor: "#cccccc",
            color: "#ff0000",
            padding: "4px 8px",
        }),
        []
    );
    const cardContentStyle: React.CSSProperties = React.useMemo(
        () => ({
            backgroundColor: "#eeeeee",
            padding: "4px 8px",
        }),
        []
    );
    const cardTypographyStyle: React.CSSProperties = React.useMemo(
        () => ({
            display: "inline-block",
            textAlign: "center",
        }),
        []
    );
    const typographyStyle: React.CSSProperties = React.useMemo(
        () => ({
            color: "#ffffff",
            display: "inline-block",
            textAlign: "center",
        }),
        []
    );

    const updateForm = React.useCallback(
        (key: IFormKeys, value: string | boolean): void => {
            setForm((form) => ({
                ...form,
                [key]: value,
            }));
            suppressErrorMsgs.current = false;
        },
        []
    );
    const updateFormError = React.useCallback(
        (key: IFormKeys, value: string | null): void => {
            setFormError((formError) => ({
                ...formError,
                [key]: value,
            }));
        },
        []
    );
    const disableSubmitButton = React.useMemo((): boolean => {
        return (
            isRequestRunning ||
            form[
                ILegalInformationConsentCheckBoxKeys.LegalInformationConsent
            ] === false
        );
    }, [form, isRequestRunning]);
    const sendRequest = React.useCallback((): void => {
        if (
            E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGES.includes(
                formError[IUserKeys.eMailAddress]
            )
        ) {
            return;
        }

        request(
            new NewsletterSubscriptionRequest(
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
                },
                (error: any) => {
                    showNotification(Dict.error_message_timeout);
                }
            )
        );
    }, [form, formError, request, updateFormError]);

    const requestGrid = React.useMemo((): React.ReactElement<any> => {
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
                    suppressErrorMsg={suppressErrorMsgs.current}
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
                    suppressErrorMsg={suppressErrorMsgs.current}
                    style={marginTopStyle}
                />

                <SubmitButton
                    disabled={disableSubmitButton}
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
    }, [
        cardContentStyle,
        cardHeaderStyle,
        cardTypographyStyle,
        disableSubmitButton,
        form,
        formError,
        marginTopStyle,
        navigate,
        sendRequest,
        typographyStyle,
        updateForm,
        updateFormError,
    ]);
    const responseGrid = React.useMemo((): React.ReactElement<any> => {
        return (
            <Grid>
                <Typography variant="h5" style={successMsgTypographyStyle}>
                    <span>{successMsg}</span>
                </Typography>
            </Grid>
        );
    }, [successMsg]);
    return (
        <Grid>
            <GridItem style={grid6Style}>
                {successMsg ? responseGrid : requestGrid}
            </GridItem>
            <GridItem style={grid1Style}>
                <span />
            </GridItem>
        </Grid>
    );
};

export default withTheme(NewsletterSubscriptionForm);
