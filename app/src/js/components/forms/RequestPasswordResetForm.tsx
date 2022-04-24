import * as React from "react";

import { Typography, withTheme, WithTheme } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import {
    grid1Style,
    grid6Style,
    successMsgTypographyStyle,
    ThemeTypes,
} from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { RequestPasswordResetRequest } from "../../networking/account_data/RequestPasswordResetRequest";
import { IResponse } from "../../networking/Request";
import EMailAddressInput, {
    E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGES,
} from "../form_elements/EMailAddressInput";
import SubmitButton from "../form_elements/SubmitButton";
import { useStateRequest } from "../utilities/CustomHooks";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";
import { showNotification } from "../utilities/Notifier";

type IRequestPasswordResetFormProps = WithTheme;

type IFormKeys = IUserKeys.eMailAddress;

interface IForm {
    [IUserKeys.eMailAddress]: string;
}

interface IFormError {
    [IUserKeys.eMailAddress]: string | null;
}

const RequestPasswordResetForm = (props: IRequestPasswordResetFormProps) => {
    const { theme } = props;
    const [form, setForm] = React.useState<IForm>({
        [IUserKeys.eMailAddress]: "",
    });
    const [formError, setFormError] = React.useState<IForm>({
        [IUserKeys.eMailAddress]: null,
    });
    const [successMsg, setSuccessMsg] = React.useState<string>();
    const [requestPasswordResetRequest, setRequestPasswordResetRequest] =
        useStateRequest();
    const suppressErrorMsgs = React.useRef<boolean>(true);

    const accountPasswortResetTypographyStyle: React.CSSProperties =
        React.useMemo(
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
    const sendRequest = React.useCallback((): void => {
        if (
            E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGES.includes(formError[IUserKeys.eMailAddress])
        ) {
            return;
        }

        setRequestPasswordResetRequest(
            new RequestPasswordResetRequest(
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

                    setRequestPasswordResetRequest(null);
                },
                (error: any) => {
                    showNotification(Dict.error_message_timeout);
                    setRequestPasswordResetRequest(null);
                }
            )
        );
    }, [form, formError, setRequestPasswordResetRequest, updateFormError]);

    const showRequestGrid = (): React.ReactElement<any> => {
        return (
            <Grid>
                <Typography
                    variant="h5"
                    style={accountPasswortResetTypographyStyle}
                >
                    <span>{Dict.navigation_request_password_reset}</span>
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
                    disabled={!!requestPasswordResetRequest}
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
                <span />
            </GridItem>
        </Grid>
    );
};

export default withTheme(RequestPasswordResetForm);
