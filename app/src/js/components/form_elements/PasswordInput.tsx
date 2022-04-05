import * as React from "react";

import { MuiThemeProvider, TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import {
    getTextFieldTheme,
    textFieldInputProps,
    ThemeTypes,
} from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { useState } from "react";
import { useEffect } from "react";

interface IPasswordInputProps {
    errorMessage: string | null;
    name?: IUserKeys.password | IUserKeys.passwordRepetition | null;
    onError: (
        key: IUserKeys.password | IUserKeys.passwordRepetition,
        value: string
    ) => void;
    onKeyPressEnter?: () => void;
    onUpdateValue: (
        key: IUserKeys.password | IUserKeys.passwordRepetition,
        value: string
    ) => void;
    showErrorMessageOnLoad?: boolean; // default: true
    style?: React.CSSProperties;
    themeType?: ThemeTypes;
    value: string;
}

export const PASSWORD_INPUT_LOCAL_ERROR_MESSAGE = Dict.account_password_invalid;

const PasswordInput = (props: IPasswordInputProps) => {
    const {
        errorMessage,
        name,
        onError,
        onKeyPressEnter,
        onUpdateValue,
        showErrorMessageOnLoad,
        style,
        themeType,
        value,
    } = props;
    const [showErrorMessage, setShowErrorMessage] = useState(
        showErrorMessageOnLoad === undefined || showErrorMessageOnLoad
    );

    const onKeyPress = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (onKeyPressEnter && event.key === "Enter") {
            onKeyPressEnter();
        }
    };
    const onChange = (event: any): void => {
        onUpdateValue(name ? name : IUserKeys.password, event.target.value);
    };

    useEffect(() => {
        const localErrorMessage =
            value && value.length >= 4 ? null : PASSWORD_INPUT_LOCAL_ERROR_MESSAGE;

        // do not overwrite combined and server side error messages
        if (
            errorMessage &&
            !localErrorMessage &&
            errorMessage !== PASSWORD_INPUT_LOCAL_ERROR_MESSAGE
        ) {
            return;
        }

        onError(name ? name : IUserKeys.password, localErrorMessage);

        if (!showErrorMessage) {
            setShowErrorMessage(true);
        }
    }, [errorMessage, name, onError, showErrorMessage, value]);

    return (
        <MuiThemeProvider theme={getTextFieldTheme(themeType)}>
            <TextField
                error={showErrorMessage && errorMessage != null}
                fullWidth={true}
                helperText={showErrorMessage ? errorMessage : null}
                inputProps={textFieldInputProps}
                label={
                    name && name === IUserKeys.passwordRepetition
                        ? Dict.account_passwordRepetition
                        : Dict.account_password
                }
                margin="dense"
                name={name ? name : IUserKeys.password}
                onChange={onChange}
                onKeyPress={onKeyPress}
                style={style}
                type="password"
                value={value}
                variant="outlined"
            />
        </MuiThemeProvider>
    );
};

export default PasswordInput;