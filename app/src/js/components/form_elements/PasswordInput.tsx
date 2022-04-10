import * as React from "react";

import { MuiThemeProvider, TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import {
    getTextFieldTheme,
    textFieldInputProps,
    ThemeTypes,
} from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";

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
    suppressErrorMsg?: boolean;
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
        suppressErrorMsg,
        style,
        themeType,
        value,
    } = props;

    const onKeyPress = React.useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>): void => {
            if (onKeyPressEnter && event.key === "Enter") {
                onKeyPressEnter();
            }
        },
        [onKeyPressEnter]
    );
    const onChange = React.useCallback(
        (event: any): void => {
            onUpdateValue(name ? name : IUserKeys.password, event.target.value);
        },
        [name, onUpdateValue]
    );

    React.useEffect(() => {
        const localErrorMessage =
            value && value.length >= 4
                ? null
                : PASSWORD_INPUT_LOCAL_ERROR_MESSAGE;

        // do not overwrite combined and server side error messages
        if (
            errorMessage !== localErrorMessage &&
            (!errorMessage ||
                errorMessage === PASSWORD_INPUT_LOCAL_ERROR_MESSAGE)
        ) {
            onError(name ? name : IUserKeys.password, localErrorMessage);
        }
    }, [errorMessage, name, onError, value]);

    return (
        <MuiThemeProvider theme={getTextFieldTheme(themeType)}>
            <TextField
                error={errorMessage != null && !suppressErrorMsg}
                fullWidth={true}
                helperText={suppressErrorMsg ? null : errorMessage}
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
