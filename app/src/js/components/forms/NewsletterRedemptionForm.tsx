import * as React from "react";
import { useLocation } from "react-router";

import { Typography, withTheme, WithTheme } from "@mui/material";

import { Dict } from "../../constants/dict";
import { AppUrls } from "../../constants/specific-urls";
import {
    grid1Style,
    grid6Style,
    successMsgTypographyStyle,
    ThemeTypes,
} from "../../constants/theme";
import { NewsletterRedemptionRequest } from "../../networking/newsletter/NewsletterRedemptionRequest";
import { IResponse } from "../../networking/Request";
import SubmitButton from "../form_elements/SubmitButton";
import TokenInput, { ITokenInputKeys } from "../form_elements/TokenInput";
import { useRequestQueue } from "../utilities/CustomHooks";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";
import { showNotification } from "../utilities/Notifier";

type INewsletterRedemptionFormProps = WithTheme;

type IFormKeys = ITokenInputKeys.tokenCode;

interface IForm {
    [ITokenInputKeys.tokenCode]: string;
}

interface IFormError {
    [ITokenInputKeys.tokenCode]: string | null;
}

const NewsletterRedemptionForm = (props: INewsletterRedemptionFormProps) => {
    const location = useLocation();
    const { theme } = props;
    const [successMsg, setSuccessMsg] = React.useState<string>();
    const tokenCode = React.useMemo(
        () =>
            decodeURI(
                location.pathname.slice(
                    AppUrls.HELP_NEWSLETTER_REDEEM.slice(0, -1).length
                )
            ),
        [location.pathname]
    );
    const [form, setForm] = React.useState<IForm>({
        [ITokenInputKeys.tokenCode]: tokenCode,
    });
    const [formError, setFormError] = React.useState<IFormError>({
        [ITokenInputKeys.tokenCode]: null,
    });
    const [request, isRequestRunning] = useRequestQueue();

    const typographyStyle: React.CSSProperties = React.useMemo(
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
            setForm((form) => ({
                ...form,
                [key]: value,
            }));
        },
        []
    );
    const updateFormError = React.useCallback(
        (key: IFormKeys, value: string): void => {
            setFormError((formError) => ({
                ...formError,
                [key]: value,
            }));
        },
        []
    );
    const sendRequest = React.useCallback((): void => {
        request(
            new NewsletterRedemptionRequest(
                form[ITokenInputKeys.tokenCode],
                (response: IResponse) => {
                    const errorMsg = response.errorMsg;
                    const successMsg = response.successMsg;

                    if (errorMsg) {
                        if (errorMsg.indexOf("token") > -1) {
                            updateFormError(
                                ITokenInputKeys.tokenCode,
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
    }, [form, request, updateFormError]);

    React.useEffect(() => {
        if (
            form[ITokenInputKeys.tokenCode] &&
            form[ITokenInputKeys.tokenCode].trim().length > 0
        ) {
            sendRequest();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const requestGrid = React.useMemo((): React.ReactElement<any> => {
        return (
            <Grid>
                <Typography variant="h5" style={typographyStyle}>
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
        sendRequest,
        typographyStyle,
        updateForm,
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

export default withTheme(NewsletterRedemptionForm);
