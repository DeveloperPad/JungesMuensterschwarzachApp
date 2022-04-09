import * as React from "react";
import { useNavigate } from "react-router";

import { Typography, withTheme, WithTheme } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import { AppUrls } from "../../constants/specific-urls";
import {
    grid1Style,
    grid6Style,
    successMsgTypographyStyle,
    ThemeTypes,
} from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { TokenRedemptionPasswordResetRequest } from "../../networking/account_data/TokenRedemptionPasswordResetRequest";
import { IResponse } from "../../networking/Request";
import PasswordInput, {
    PASSWORD_INPUT_LOCAL_ERROR_MESSAGE,
} from "../form_elements/PasswordInput";
import SubmitButton from "../form_elements/SubmitButton";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";
import { showNotification } from "../utilities/Notifier";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

type ITokenRedemptionPasswordResetFormProps = WithTheme;

type IFormKeys = IUserKeys.password | IUserKeys.passwordRepetition;

interface IForm {
    [IUserKeys.password]: string;
    [IUserKeys.passwordRepetition]: string;
}

interface IFormError {
    [IUserKeys.password]: string | null;
    [IUserKeys.passwordRepetition]: string | null;
}

const TokenRedemptionPasswordResetPage = (
    props: ITokenRedemptionPasswordResetFormProps
) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = props;
    const [form, setForm] = useState<IForm>({
        [IUserKeys.password]: "",
        [IUserKeys.passwordRepetition]: "",
    });
    const [formError, setFormError] = useState<IFormError>({
        [IUserKeys.password]: null,
        [IUserKeys.passwordRepetition]: null,
    });
    const [successMsg, setSuccessMsg] = useState<string>();
    const tokenRedemptionPasswordResetRequest =
        useRef<TokenRedemptionPasswordResetRequest>();

    const accountNewPasswortTypographyStyle: React.CSSProperties = {
        color: "#ffffff",
        display: "inline-block",
        marginBottom: theme.spacing(3),
        textAlign: "center",
    };
    const marginTopStyle: React.CSSProperties = {
        marginTop: theme.spacing(2),
    };

    const updateForm = (key: IFormKeys, value: string | boolean): void => {
        setForm((form: IForm) => {
            return {
                ...form,
                [key]: value,
            };
        });
    };
    const updateFormError = (key: IFormKeys, value: string | null): void => {
        setFormError((formError: IFormError) => {
            formError[key] = value;
            return formError;
        });
    };
    const getTokenCode = (): string => {
        return decodeURI(
            location.pathname.slice(
                (AppUrls.HELP_REDEEM_TOKEN_RESET_PASSWORD + "/").length
            )
        );
    };
    const sendRequest = (): void => {
        if (
            formError[IUserKeys.passwordRepetition] ===
                PASSWORD_INPUT_LOCAL_ERROR_MESSAGE ||
            formError[IUserKeys.password] === PASSWORD_INPUT_LOCAL_ERROR_MESSAGE
        ) {
            return;
        }

        if (form[IUserKeys.password] !== form[IUserKeys.passwordRepetition]) {
            updateFormError(
                IUserKeys.passwordRepetition,
                Dict.account_passwordRepetition_incorrect
            );
            return;
        }

        tokenRedemptionPasswordResetRequest.current =
            new TokenRedemptionPasswordResetRequest(
                getTokenCode(),
                form[IUserKeys.password],
                (response: IResponse) => {
                    const errorMsg = response.errorMsg;
                    const successMsg = response.successMsg;

                    if (errorMsg) {
                        if (errorMsg.indexOf("token") > -1) {
                            showNotification(errorMsg);
                            navigate(AppUrls.HELP_REDEEM_TOKEN);
                        } else if (
                            errorMsg.indexOf(IUserKeys.passwordRepetition) > -1
                        ) {
                            updateFormError(
                                IUserKeys.passwordRepetition,
                                Dict[errorMsg] ?? errorMsg
                            );
                        } else if (errorMsg.indexOf(IUserKeys.password) > -1) {
                            updateFormError(
                                IUserKeys.password,
                                Dict[errorMsg] ?? errorMsg
                            );
                        } else {
                            showNotification(errorMsg);
                        }
                    } else if (successMsg) {
                        setSuccessMsg(Dict[successMsg] ?? successMsg);
                    }

                    tokenRedemptionPasswordResetRequest.current = null;
                },
                (error: any) => {
                    showNotification(Dict.error_message_timeout);
                    tokenRedemptionPasswordResetRequest.current = null;
                }
            );
    };

    useEffect(() => {
        return () => {
            if (tokenRedemptionPasswordResetRequest.current) {
                tokenRedemptionPasswordResetRequest.current.cancel();
            }
        };
    }, []);

    const showRequestGrid = (): React.ReactElement<any> => {
        return (
            <Grid>
                <Typography
                    variant="h5"
                    style={accountNewPasswortTypographyStyle}
                >
                    <span>{Dict.account_password_new}</span>
                </Typography>

                <PasswordInput
                    errorMessage={formError[IUserKeys.password]}
                    onError={updateFormError}
                    onUpdateValue={updateForm}
                    showErrorMessageOnLoad={false}
                    themeType={ThemeTypes.LIGHT}
                    value={form[IUserKeys.password]}
                />

                <PasswordInput
                    errorMessage={formError[IUserKeys.passwordRepetition]}
                    name={IUserKeys.passwordRepetition}
                    onError={updateFormError}
                    onUpdateValue={updateForm}
                    showErrorMessageOnLoad={false}
                    style={marginTopStyle}
                    themeType={ThemeTypes.LIGHT}
                    value={form[IUserKeys.passwordRepetition]}
                />

                <SubmitButton
                    disabled={
                        tokenRedemptionPasswordResetRequest.current !== null
                    }
                    onClick={sendRequest}
                    style={marginTopStyle}
                />
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
                <span></span>
            </GridItem>
        </Grid>
    );
};

export default withTheme(TokenRedemptionPasswordResetPage);
