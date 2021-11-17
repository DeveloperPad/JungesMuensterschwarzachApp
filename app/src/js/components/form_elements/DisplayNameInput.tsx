import * as React from "react";

import { MuiThemeProvider, TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import {
    getTextFieldTheme,
    textFieldInputProps,
    ThemeTypes,
} from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { useState } from "react";
import { useEffect } from "react";

interface IDisplayNameInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.displayName, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.displayName, value: string) => void;
    onBlur?: (key: IUserKeys.displayName, value: string) => void;
    showErrorMessageOnLoad?: boolean; // default: true
    style?: React.CSSProperties;
    themeType?: ThemeTypes;
    value: string;
}

const DisplayNameInput = (props: IDisplayNameInputProps) => {
    const LOCAL_ERROR_MESSAGE: string = Dict.account_displayName_invalid;

    const {
        errorMessage,
        onError,
        onUpdateValue,
        onBlur,
        showErrorMessageOnLoad,
        style,
        themeType,
        value,
    } = props;
    const [submit, setSubmit] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(
        showErrorMessageOnLoad === undefined || showErrorMessageOnLoad
    );

    const onChange = (event: any): void => {
        onError(IUserKeys.displayName, null);
        onUpdateValue(IUserKeys.displayName, event.target.value);
    };
    const onLocalBlur = (_: any): void => {
        if (value) {
            onUpdateValue(IUserKeys.displayName, value.trim());
        }

        setSubmit(true);
    };

    useEffect(() => {
        const localErrorMessage =
            value != null &&
            value.length > 0 &&
            value.length <= Formats.LENGTH.MAX.DISPLAY_NAME
                ? null
                : LOCAL_ERROR_MESSAGE;

        // do not overwrite server side error messages
        if (
            errorMessage &&
            !localErrorMessage &&
            errorMessage !== LOCAL_ERROR_MESSAGE
        ) {
            return;
        }

        onError(IUserKeys.displayName, localErrorMessage);

        if (!showErrorMessage) {
            setShowErrorMessage(true);
        }

        if (!submit) {
            return;
        }

        if (onBlur) {
            onBlur(IUserKeys.displayName, value);
        }

        setSubmit(false);
    }, [
        errorMessage,
        LOCAL_ERROR_MESSAGE,
        onBlur,
        onError,
        showErrorMessage,
        submit,
        value,
    ]);

    return (
        <MuiThemeProvider theme={getTextFieldTheme(themeType)}>
            <TextField
                error={showErrorMessage && errorMessage != null}
                fullWidth={true}
                helperText={showErrorMessage ? errorMessage : null}
                inputProps={{
                    ...textFieldInputProps,
                    maxLength: Formats.LENGTH.MAX.DISPLAY_NAME,
                }}
                label={Dict.account_displayName}
                margin="dense"
                name={IUserKeys.displayName}
                onBlur={onLocalBlur}
                onChange={onChange}
                style={style}
                type="text"
                value={value}
                variant="outlined"
            />
        </MuiThemeProvider>
    );
};

export default DisplayNameInput;
