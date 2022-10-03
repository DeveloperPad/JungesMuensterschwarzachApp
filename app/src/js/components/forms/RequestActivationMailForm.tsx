import * as React from "react";

import { Typography, withTheme, WithTheme } from "@mui/material";

import { Dict } from "../../constants/dict";
import {
    grid1Style,
    grid6Style,
    successMsgTypographyStyle,
    ThemeTypes,
} from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { RequestActivationMailRequest } from "../../networking/account_data/RequestActivationMailRequest";
import { IResponse } from "../../networking/Request";
import EMailAddressInput, {
    E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGES,
} from "../form_elements/EMailAddressInput";
import SubmitButton from "../form_elements/SubmitButton";
import { useRequestQueue } from "../utilities/CustomHooks";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";
import { showNotification } from "../utilities/Notifier";

type IRequestActivationMailFormProps = WithTheme;

type IFormKeys = IUserKeys.eMailAddress;

interface IForm {
    [IUserKeys.eMailAddress]: string;
}

interface IFormError {
    [IUserKeys.eMailAddress]: string | null;
}

const RequestActivationMailForm = (props: IRequestActivationMailFormProps) => {
    const { theme } = props;
    const [form, setForm] = React.useState<IForm>({
        [IUserKeys.eMailAddress]: "",
    });
    const [formError, setFormError] = React.useState<IFormError>({
        [IUserKeys.eMailAddress]: null,
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
    const accountActivationMailTypographyStyle: React.CSSProperties =
        React.useMemo(
            () => ({
                color: "#ffffff",
                display: "inline-block",
                marginBottom: 3 * theme.spacing(),
                textAlign: "center",
            }),
            [theme]
        );

    const updateForm = React.useCallback(
        (key: IFormKeys, value: string): void => {
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
    const sendRequest = React.useCallback((): void => {
        if (
            E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGES.includes(
                formError[IUserKeys.eMailAddress]
            )
        ) {
            return;
        }

        request(
            new RequestActivationMailRequest(
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
                <Typography
                    variant="h5"
                    style={accountActivationMailTypographyStyle}
                >
                    <span>{Dict.navigation_request_activation_link}</span>
                </Typography>

                <EMailAddressInput
                    errorMessage={formError[IUserKeys.eMailAddress]}
                    onError={updateFormError}
                    onUpdateValue={updateForm}
                    suppressErrorMsg={suppressErrorMsgs.current}
                    themeType={ThemeTypes.LIGHT}
                    value={form[IUserKeys.eMailAddress]}
                />

                <SubmitButton
                    disabled={isRequestRunning}
                    onClick={sendRequest}
                    style={marginTopStyle}
                />
            </Grid>
        );
    }, [
        accountActivationMailTypographyStyle,
        form,
        formError,
        isRequestRunning,
        marginTopStyle,
        sendRequest,
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

export default withTheme(RequestActivationMailForm);
