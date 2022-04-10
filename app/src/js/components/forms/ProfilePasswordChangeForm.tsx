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
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";
import { showNotification } from "../utilities/Notifier";
import { useEffect, useRef, useState } from "react";

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
    const [form, setForm] = useState<IForm>({
        [IUserKeys.password]: "",
        [IUserKeys.passwordRepetition]: "",
    });
    const [formError, setFormError] = useState<IFormError>({
        [IUserKeys.password]: null,
        [IUserKeys.passwordRepetition]: null,
    });
    const [infoMsg, setInfoMsg] = useState<string>();
    const updateAccountDataRequest = useRef<UpdateAccountDataRequest>();

    const topMarginStyle: React.CSSProperties = {
        marginTop: 2 * theme.spacing(),
    };
    const newPasswortTypographyStyle: React.CSSProperties = {
        color: "#ffffff",
        display: "inline-block",
        marginBottom: 3 * theme.spacing(),
        textAlign: "center",
    };

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
        (key: IFormKeys, value: string | null): void => {
            setFormError((formError) => ({
                ...formError,
                [key]: value,
            }));
        },
        []
    );
    const validate = (): boolean => {
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
    };
    const sendRequest = (): void => {
        setFormError({
            [IUserKeys.password]: null,
            [IUserKeys.passwordRepetition]: null,
        });

        if (!validate()) {
            return;
        }

        updateAccountDataRequest.current = new UpdateAccountDataRequest(
            IUserKeys.password,
            form[IUserKeys.password],
            (response: IResponse) => {
                const errorMsg = response.errorMsg;

                if (errorMsg) {
                    if (errorMsg.indexOf(IUserKeys.passwordRepetition) > -1) {
                        setFormError((formError) => {
                            formError[IUserKeys.passwordRepetition] =
                                Dict[errorMsg] ?? errorMsg;
                            return formError;
                        });
                    } else if (errorMsg.indexOf(IUserKeys.password) > -1) {
                        setFormError((formError) => {
                            formError[IUserKeys.password] =
                                Dict[errorMsg] ?? errorMsg;
                            return formError;
                        });
                    } else {
                        showNotification(errorMsg);
                    }
                } else {
                    setInfoMsg(Dict.account_password_updated);
                }

                updateAccountDataRequest.current = null;
            },
            () => {
                showNotification(Dict.error_message_timeout);
                updateAccountDataRequest.current = null;
            }
        );
        updateAccountDataRequest.current.execute();
    };

    useEffect(() => {
        return () => {
            if (updateAccountDataRequest.current) {
                updateAccountDataRequest.current.cancel();
            }
        };
    }, []);

    const showRequestGrid = (): React.ReactElement<any> => {
        return (
            <Grid>
                <Typography variant="h5" style={newPasswortTypographyStyle}>
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
                    style={topMarginStyle}
                    themeType={ThemeTypes.LIGHT}
                    value={form[IUserKeys.passwordRepetition]}
                />

                <SubmitButton
                    disabled={updateAccountDataRequest.current !== null}
                    onClick={sendRequest}
                    style={topMarginStyle}
                />
            </Grid>
        );
    };
    const showResponseGrid = (): React.ReactElement<any> => {
        return (
            <Grid>
                <Typography variant="h5" style={infoMessageTypographyStyle}>
                    <span>{infoMsg}</span>
                </Typography>
            </Grid>
        );
    };
    return (
        <Grid>
            <GridItem style={grid6Style}>
                {infoMsg ? showResponseGrid() : showRequestGrid()}
            </GridItem>
            <GridItem style={grid1Style}></GridItem>
        </Grid>
    );
};

export default withTheme(ProfilePasswordChangeForm);
