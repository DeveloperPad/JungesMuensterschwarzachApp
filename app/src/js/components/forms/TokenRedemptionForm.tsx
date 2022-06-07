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
import { TokenRedemptionRequest } from "../../networking/account_data/TokenRedemptionRequest";
import { IResponse } from "../../networking/Request";
import SubmitButton from "../form_elements/SubmitButton";
import TokenInput, { ITokenInputKeys } from "../form_elements/TokenInput";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";
import { showNotification } from "../utilities/Notifier";
import { useRequestQueue } from "../utilities/CustomHooks";

type ITokenRedemptionFormProps = WithTheme;

type IFormKeys = ITokenInputKeys.tokenCode;

interface IForm {
    [ITokenInputKeys.tokenCode]: string;
}

interface IFormError {
    [ITokenInputKeys.tokenCode]: string | null;
}

const TokenRedemptionForm = (props: ITokenRedemptionFormProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = props;
    const tokenCode = React.useMemo((): string => {
        return decodeURI(
            location.pathname.slice(
                AppUrls.HELP_REDEEM_TOKEN.slice(0, -1).length
            )
        );
    }, [location]);
    const [form, setForm] = React.useState<IForm>({
        [ITokenInputKeys.tokenCode]: tokenCode,
    });
    const [formError, setFormError] = React.useState<IFormError>({
        [ITokenInputKeys.tokenCode]: null,
    });
    const [successMsg, setSuccessMsg] = React.useState<string>();
    const [request, isRequestRunning] = useRequestQueue();

    const redeemTokenTypographyStyle: React.CSSProperties = React.useMemo(
        () => ({
            color: "#ffffff",
            display: "inline-block",
            marginBottom: 3 * theme.spacing(),
            textAlign: "center",
        }),
        [theme]
    );
    const marginTopStyle: React.CSSProperties = React.useMemo(
        () => ({
            marginTop: 2 * theme.spacing(),
        }),
        [theme]
    );

    const updateForm = React.useCallback(
        (key: IFormKeys, value: string): void => {
            setForm((form: IForm) => ({
                ...form,
                [key]: value,
            }));
        },
        []
    );
    const updateFormError = React.useCallback(
        (key: IFormKeys, value: string): void => {
            setFormError((formError: IFormError) => ({
                ...formError,
                [key]: value,
            }));
        },
        []
    );
    const sendRequest = React.useCallback((): void => {
        request(
            new TokenRedemptionRequest(
                form[ITokenInputKeys.tokenCode],
                (response: IResponse) => {
                    const errorMsg = response.errorMsg;
                    const successMsg = response.successMsg;

                    if (errorMsg) {
                        if (
                            errorMsg.indexOf("token") > -1 ||
                            errorMsg.indexOf("account") > -1
                        ) {
                            updateFormError(
                                ITokenInputKeys.tokenCode,
                                Dict[errorMsg] ?? errorMsg
                            );
                        } else {
                            showNotification(errorMsg);
                        }
                    } else if (successMsg) {
                        if (successMsg === "account_password_new") {
                            navigate(
                                AppUrls.HELP_REDEEM_TOKEN_RESET_PASSWORD.slice(
                                    0,
                                    -1
                                ) + encodeURI(form[ITokenInputKeys.tokenCode])
                            );
                        } else {
                            setSuccessMsg(Dict[successMsg] ?? successMsg);
                        }
                    }
                },
                (error: any) => {
                    showNotification(Dict.error_message_timeout);
                }
            )
        );
    }, [form, navigate, request, updateFormError]);

    React.useEffect(() => {
        if (
            form[ITokenInputKeys.tokenCode] &&
            form[ITokenInputKeys.tokenCode].trim().length > 0
        ) {
            sendRequest();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showRequestGrid = React.useCallback((): React.ReactElement<any> => {
        return (
            <Grid>
                <Typography variant="h5" style={redeemTokenTypographyStyle}>
                    <span>{Dict.navigation_redeem_token}</span>
                </Typography>

                <TokenInput
                    errorMessage={formError[ITokenInputKeys.tokenCode]}
                    onUpdateValue={updateForm}
                    themeType={ThemeTypes.LIGHT}
                    value={form[ITokenInputKeys.tokenCode]}
                />

                <SubmitButton
                    disabled={isRequestRunning}
                    onClick={sendRequest}
                    style={marginTopStyle}
                />
            </Grid>
        );
    }, [
        form,
        formError,
        isRequestRunning,
        marginTopStyle,
        redeemTokenTypographyStyle,
        sendRequest,
        updateForm,
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

export default withTheme(TokenRedemptionForm);
