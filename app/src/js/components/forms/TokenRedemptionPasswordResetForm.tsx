import * as React from "react";
import { useLocation, useNavigate } from "react-router";

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
import { useRequestQueue } from "../utilities/CustomHooks";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";
import { showNotification } from "../utilities/Notifier";

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
    const [form, setForm] = React.useState<IForm>({
        [IUserKeys.password]: "",
        [IUserKeys.passwordRepetition]: "",
    });
    const [formError, setFormError] = React.useState<IFormError>({
        [IUserKeys.password]: null,
        [IUserKeys.passwordRepetition]: null,
    });
    const [successMsg, setSuccessMsg] = React.useState<string>();
    const [request, isRequestRunning] = useRequestQueue();
    const suppressErrorMsgs = React.useRef<boolean>(true);

    const accountNewPasswortTypographyStyle: React.CSSProperties =
        React.useMemo(
            () => ({
                color: "#ffffff",
                display: "inline-block",
                marginBottom: theme.spacing(3),
                textAlign: "center",
            }),
            [theme]
        );
    const marginTopStyle: React.CSSProperties = React.useMemo(
        () => ({
            marginTop: theme.spacing(2),
        }),
        [theme]
    );

    const updateForm = React.useCallback(
        (key: IFormKeys, value: string | boolean): void => {
            setForm((form: IForm) => ({
                ...form,
                [key]: value,
            }));
            suppressErrorMsgs.current = false;
        },
        []
    );
    const updateFormError = React.useCallback(
        (key: IFormKeys, value: string | null): void => {
            setFormError((formError: IFormError) => ({
                ...formError,
                [key]: value,
            }));
        },
        []
    );
    const tokenCode = React.useMemo((): string => {
        return decodeURI(
            location.pathname.slice(
                AppUrls.HELP_REDEEM_TOKEN_RESET_PASSWORD.slice(0, -1).length
            )
        );
    }, [location]);
    const sendRequest = React.useCallback((): void => {
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

        request(
            new TokenRedemptionPasswordResetRequest(
                tokenCode,
                form[IUserKeys.password],
                (response: IResponse) => {
                    const errorMsg = response.errorMsg;
                    const successMsg = response.successMsg;

                    if (errorMsg) {
                        if (errorMsg.indexOf("token") > -1) {
                            showNotification(errorMsg);
                            navigate(AppUrls.HELP_REDEEM_TOKEN.slice(0, -2));
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
                },
                (error: any) => {
                    showNotification(Dict.error_message_timeout);
                }
            )
        );
    }, [form, formError, navigate, request, tokenCode, updateFormError]);

    const showRequestGrid = React.useCallback((): React.ReactElement<any> => {
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
                    suppressErrorMsg={suppressErrorMsgs.current}
                    themeType={ThemeTypes.LIGHT}
                    value={form[IUserKeys.password]}
                />

                <PasswordInput
                    errorMessage={formError[IUserKeys.passwordRepetition]}
                    name={IUserKeys.passwordRepetition}
                    onError={updateFormError}
                    onUpdateValue={updateForm}
                    suppressErrorMsg={suppressErrorMsgs.current}
                    style={marginTopStyle}
                    themeType={ThemeTypes.LIGHT}
                    value={form[IUserKeys.passwordRepetition]}
                />

                <SubmitButton
                    disabled={isRequestRunning}
                    onClick={sendRequest}
                    style={marginTopStyle}
                />
            </Grid>
        );
    }, [
        accountNewPasswortTypographyStyle,
        form,
        formError,
        isRequestRunning,
        marginTopStyle,
        sendRequest,
        updateForm,
        updateFormError,
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
            <GridItem style={grid6Style}>
                {successMsg ? showResponseGrid() : showRequestGrid()}
            </GridItem>
            <GridItem style={grid1Style}>
                <span />
            </GridItem>
        </Grid>
    );
};

export default withTheme(TokenRedemptionPasswordResetPage);
