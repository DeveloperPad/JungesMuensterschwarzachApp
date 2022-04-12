import * as React from "react";
import { useNavigate } from "react-router";

import { Typography, withTheme, WithTheme } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import { AppUrls } from "../../constants/specific-urls";
import {
    grid7Style,
    successMsgTypographyStyle,
    ThemeTypes,
} from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { SignUpRequest } from "../../networking/account_data/SignUpRequest";
import { IResponse } from "../../networking/Request";
import AllowNewsletterCheckbox from "../form_elements/AllowNewsletterCheckbox";
import DisplayNameInput, {
    DISPLAY_NAME_INPUT_LOCAL_ERROR_MESSAGE,
} from "../form_elements/DisplayNameInput";
import EMailAddressInput, {
    E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGE,
} from "../form_elements/EMailAddressInput";
import LegalInformationConsentCheckbox, {
    ILegalInformationConsentCheckBoxKeys,
    LEGAL_INFORMATION_CONSENT_CHECKBOX_LOCAL_ERROR_MESSAGE,
} from "../form_elements/LegalInformationConsentCheckbox";
import PasswordInput, {
    PASSWORD_INPUT_LOCAL_ERROR_MESSAGE,
} from "../form_elements/PasswordInput";
import SubmitButton from "../form_elements/SubmitButton";
import { useStateRequest } from "../utilities/CustomHooks";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";
import { showNotification } from "../utilities/Notifier";

type IRegistrationFormProps = WithTheme;

type IFormKeys =
    | IUserKeys.displayName
    | IUserKeys.eMailAddress
    | IUserKeys.allowNewsletter
    | ILegalInformationConsentCheckBoxKeys.LegalInformationConsent
    | IUserKeys.password
    | IUserKeys.passwordRepetition;

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
    [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]:
        | string
        | null;
    [IUserKeys.password]: string | null;
    [IUserKeys.passwordRepetition]: string | null;
}

const RegistrationForm = (props: IRegistrationFormProps) => {
    const navigate = useNavigate();
    const { theme } = props;
    const [form, setForm] = React.useState<IForm>({
        [IUserKeys.displayName]: "",
        [IUserKeys.eMailAddress]: "",
        [IUserKeys.allowNewsletter]: 0,
        [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]: false,
        [IUserKeys.password]: "",
        [IUserKeys.passwordRepetition]: "",
    });
    const [formError, setFormError] = React.useState<IFormError>({
        [IUserKeys.displayName]: null,
        [IUserKeys.eMailAddress]: null,
        [IUserKeys.allowNewsletter]: null,
        [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]: null,
        [IUserKeys.password]: null,
        [IUserKeys.passwordRepetition]: null,
    });
    const [successMsg, setSuccessMsg] = React.useState<string>();
    const suppressErrorMsgs = React.useRef<boolean>(true);
    const [signUpRequest, setSignUpRequest] = useStateRequest();

    const upperInputStyle: React.CSSProperties = React.useMemo(
        () => ({
            marginTop: theme.spacing(2),
        }),
        [theme]
    );

    const updateForm = React.useCallback(
        (key: IFormKeys, value: string | number | boolean): void => {
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
    const validate = React.useCallback((): boolean => {
        let valid = true;

        if (
            formError[IUserKeys.displayName] ===
                DISPLAY_NAME_INPUT_LOCAL_ERROR_MESSAGE ||
            formError[IUserKeys.eMailAddress] ===
                E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGE ||
            formError[IUserKeys.passwordRepetition] ===
                PASSWORD_INPUT_LOCAL_ERROR_MESSAGE ||
            formError[IUserKeys.password] ===
                PASSWORD_INPUT_LOCAL_ERROR_MESSAGE ||
            formError[
                ILegalInformationConsentCheckBoxKeys.LegalInformationConsent
            ] === LEGAL_INFORMATION_CONSENT_CHECKBOX_LOCAL_ERROR_MESSAGE
        ) {
            valid = false;
        }
        if (form[IUserKeys.password] !== form[IUserKeys.passwordRepetition]) {
            updateFormError(
                IUserKeys.passwordRepetition,
                Dict.account_passwordRepetition_incorrect
            );
            valid = false;
        }

        return valid;
    }, [form, formError, updateFormError]);
    const signUp = React.useCallback((): void => {
        if (!validate()) {
            return;
        }

        setFormError({
            [IUserKeys.displayName]: null,
            [IUserKeys.eMailAddress]: null,
            [IUserKeys.allowNewsletter]: null,
            [ILegalInformationConsentCheckBoxKeys.LegalInformationConsent]:
                null,
            [IUserKeys.password]: null,
            [IUserKeys.passwordRepetition]: null,
        });
        setSignUpRequest(
            new SignUpRequest(
                form[IUserKeys.displayName],
                form[IUserKeys.eMailAddress],
                form[IUserKeys.password],
                form[IUserKeys.allowNewsletter],
                (response: IResponse) => {
                    const errorMsg = response.errorMsg;
                    const successMsg = response.successMsg;

                    if (errorMsg) {
                        let errorKey = null;

                        if (errorMsg.indexOf(IUserKeys.displayName) > -1) {
                            errorKey = IUserKeys.displayName;
                        } else if (
                            errorMsg.indexOf(IUserKeys.eMailAddress) > -1
                        ) {
                            errorKey = IUserKeys.eMailAddress;
                        } else if (
                            errorMsg.indexOf(IUserKeys.passwordRepetition) > -1
                        ) {
                            errorKey = IUserKeys.passwordRepetition;
                        } else if (errorMsg.indexOf(IUserKeys.password) > -1) {
                            errorKey = IUserKeys.password;
                        } else if (
                            errorMsg.indexOf(IUserKeys.allowNewsletter) > -1
                        ) {
                            errorKey = IUserKeys.allowNewsletter;
                        }

                        if (errorKey) {
                            setFormError((formError) => {
                                return {
                                    ...formError,
                                    [errorKey]: Dict[errorMsg] ?? errorMsg,
                                };
                            });
                        } else {
                            showNotification(errorMsg);
                        }
                    } else if (successMsg) {
                        setSuccessMsg(Dict[successMsg] ?? successMsg);
                    }

                    setSignUpRequest(null);
                },
                (error: any) => {
                    showNotification(Dict.error_message_timeout);
                    setSignUpRequest(null);
                }
            )
        );
    }, [form, setSignUpRequest, validate]);

    const showRequestGrid = React.useCallback((): React.ReactElement<any> => {
        return (
            <Grid>
                <DisplayNameInput
                    errorMessage={formError[IUserKeys.displayName]}
                    onError={updateFormError}
                    onUpdateValue={updateForm}
                    suppressErrorMsg={suppressErrorMsgs.current}
                    style={upperInputStyle}
                    themeType={ThemeTypes.LIGHT}
                    value={form[IUserKeys.displayName]}
                />

                <EMailAddressInput
                    errorMessage={formError[IUserKeys.eMailAddress]}
                    onError={updateFormError}
                    onUpdateValue={updateForm}
                    suppressErrorMsg={suppressErrorMsgs.current}
                    style={upperInputStyle}
                    themeType={ThemeTypes.LIGHT}
                    value={form[IUserKeys.eMailAddress]}
                />

                <PasswordInput
                    errorMessage={formError[IUserKeys.password]}
                    onError={updateFormError}
                    onUpdateValue={updateForm}
                    suppressErrorMsg={suppressErrorMsgs.current}
                    style={upperInputStyle}
                    themeType={ThemeTypes.LIGHT}
                    value={form[IUserKeys.password]}
                />

                <PasswordInput
                    errorMessage={formError[IUserKeys.passwordRepetition]}
                    name={IUserKeys.passwordRepetition}
                    onError={updateFormError}
                    onUpdateValue={updateForm}
                    suppressErrorMsg={suppressErrorMsgs.current}
                    style={upperInputStyle}
                    themeType={ThemeTypes.LIGHT}
                    value={form[IUserKeys.passwordRepetition]}
                />

                <AllowNewsletterCheckbox
                    checked={form[IUserKeys.allowNewsletter] === 1}
                    errorMessage={formError[IUserKeys.allowNewsletter]}
                    onUpdateValue={updateForm}
                    suppressErrorMsg={suppressErrorMsgs.current}
                    style={upperInputStyle}
                    themeType={ThemeTypes.LIGHT}
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
                    style={upperInputStyle}
                />

                <SubmitButton
                    disabled={!!signUpRequest}
                    label={Dict.account_sign_up}
                    onClick={signUp}
                    style={upperInputStyle}
                />
            </Grid>
        );
    }, [
        form,
        formError,
        navigate,
        signUp,
        signUpRequest,
        updateForm,
        updateFormError,
        upperInputStyle,
    ]);
    const showResponseGrid = React.useCallback((): React.ReactElement<any> => {
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
            <GridItem style={grid7Style}>
                {successMsg ? showResponseGrid() : showRequestGrid()}
            </GridItem>
        </Grid>
    );
};

export default withTheme(RegistrationForm);
