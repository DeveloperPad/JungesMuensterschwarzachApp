import * as React from "react";

import { Typography, withTheme, WithTheme } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import {
    grid1Style,
    grid6Style,
    infoMessageTypographyStyle,
    ThemeTypes,
} from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { UpdateAccountDataRequest } from "../../networking/account_data/UpdateAccountDataRequest";
import { IResponse } from "../../networking/Request";
import PasswordInput, {
    PASSWORD_INPUT_LOCAL_ERROR_MESSAGE,
} from "../form_elements/PasswordInput";
import SubmitButton from "../form_elements/SubmitButton";
import { useRequestQueue } from "../utilities/CustomHooks";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";
import { showNotification } from "../utilities/Notifier";

type IProfilePasswordChangeFormProps = WithTheme;

type IFormKeys =
    | IUserKeys.password
    | IUserKeys.passwordRepetition
    | IUserKeys.eMailAddress;

interface IForm {
    [IUserKeys.password]: string;
    [IUserKeys.passwordRepetition]: string;
}

interface IFormError {
    [IUserKeys.password]: string | null;
    [IUserKeys.passwordRepetition]: string | null;
}

const ProfilePasswordChangeForm = (props: IProfilePasswordChangeFormProps) => {
    const { theme } = props;
    const [form, setForm] = React.useState<IForm>({
        [IUserKeys.password]: "",
        [IUserKeys.passwordRepetition]: "",
    });
    const [formError, setFormError] = React.useState<IFormError>({
        [IUserKeys.password]: null,
        [IUserKeys.passwordRepetition]: null,
    });
    const [infoMsg, setInfoMsg] = React.useState<string>();
    const [request, isRequestRunning] = useRequestQueue();
    const suppressErrorMsgs = React.useRef<boolean>(true);

    const topMarginStyle: React.CSSProperties = React.useMemo(
        () => ({
            marginTop: 2 * theme.spacing(),
        }),
        [theme]
    );
    const newPasswortTypographyStyle: React.CSSProperties = React.useMemo(
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
    const validate = React.useCallback((): boolean => {
        let valid = true;

        if (
            formError[IUserKeys.passwordRepetition] ===
                PASSWORD_INPUT_LOCAL_ERROR_MESSAGE ||
            formError[IUserKeys.password] === PASSWORD_INPUT_LOCAL_ERROR_MESSAGE
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
    const sendRequest = React.useCallback((): void => {
        setFormError({
            [IUserKeys.password]: null,
            [IUserKeys.passwordRepetition]: null,
        });

        if (!validate()) {
            return;
        }

        request(
            new UpdateAccountDataRequest(
                IUserKeys.password,
                form[IUserKeys.password],
                (response: IResponse) => {
                    const errorMsg = response.errorMsg;
                    const successMsg = response.successMsg;

                    if (errorMsg) {
                        if (
                            errorMsg.indexOf(IUserKeys.passwordRepetition) > -1
                        ) {
                            setFormError((formError) => ({
                                ...formError,
                                [IUserKeys.passwordRepetition]:
                                    Dict[errorMsg] ?? errorMsg,
                            }));
                        } else if (errorMsg.indexOf(IUserKeys.password) > -1) {
                            setFormError((formError) => ({
                                ...formError,
                                [IUserKeys.password]:
                                    Dict[errorMsg] ?? errorMsg,
                            }));
                        } else {
                            showNotification(errorMsg);
                        }
                    } else {
                        setInfoMsg(Dict[successMsg] ?? successMsg);
                    }
                },
                () => {
                    showNotification(Dict.error_message_timeout);
                }
            )
        );
    }, [form, request, validate]);

    const requestGrid = React.useMemo((): React.ReactElement<any> => {
        return (
            <Grid>
                <Typography variant="h5" style={newPasswortTypographyStyle}>
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
                    style={topMarginStyle}
                    themeType={ThemeTypes.LIGHT}
                    value={form[IUserKeys.passwordRepetition]}
                />

                <SubmitButton
                    disabled={isRequestRunning}
                    onClick={sendRequest}
                    style={topMarginStyle}
                />
            </Grid>
        );
    }, [
        form,
        formError,
        isRequestRunning,
        newPasswortTypographyStyle,
        sendRequest,
        topMarginStyle,
        updateForm,
        updateFormError,
    ]);
    const responseGrid = React.useMemo((): React.ReactElement<any> => {
        return (
            <Grid>
                <Typography variant="h5" style={infoMessageTypographyStyle}>
                    <span>{infoMsg}</span>
                </Typography>
            </Grid>
        );
    }, [infoMsg]);
    return (
        <Grid>
            <GridItem style={grid6Style}>
                {infoMsg ? responseGrid : requestGrid}
            </GridItem>
            <GridItem style={grid1Style}>
                <span />
            </GridItem>
        </Grid>
    );
};

export default withTheme(ProfilePasswordChangeForm);
