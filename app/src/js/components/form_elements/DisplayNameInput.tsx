import * as React from 'react';
import Formats from '../../constants/formats';
import { Dict } from '../../constants/dict';
import { IUserKeys } from '../../networking/account_data/IUser';
import { StyledEngineProvider, TextField, ThemeProvider } from '@mui/material';

import {
    getTextFieldTheme,
    textFieldInputProps,
    ThemeTypes,
} from "../../constants/theme";

interface IDisplayNameInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.displayName, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.displayName, value: string) => void;
    onBlur?: (key: IUserKeys.displayName, value: string) => void;
    suppressErrorMsg?: boolean;
    style?: React.CSSProperties;
    themeType?: ThemeTypes;
    value: string;
}

export const DISPLAY_NAME_INPUT_LOCAL_ERROR_MESSAGE: string =
    Dict.account_displayName_invalid;

const DisplayNameInput = (props: IDisplayNameInputProps) => {
    const {
        errorMessage,
        onError,
        onUpdateValue,
        onBlur,
        suppressErrorMsg,
        style,
        themeType,
        value,
    } = props;

    const onChange = React.useCallback(
        (event: any): void => {
            onError(IUserKeys.displayName, null);
            onUpdateValue(IUserKeys.displayName, event.target.value);
        },
        [onError, onUpdateValue]
    );
    const onLocalBlur = React.useCallback(
        (_: any): void => {
            if (value) {
                onUpdateValue(IUserKeys.displayName, value.trim());
            }

            if (onBlur) {
                onBlur(IUserKeys.displayName, value);
            }
        },
        [onBlur, onUpdateValue, value]
    );

    React.useEffect(() => {
        const localErrorMessage =
            value != null &&
            value.length > 0 &&
            value.length <= Formats.LENGTH.MAX.DISPLAY_NAME
                ? null
                : DISPLAY_NAME_INPUT_LOCAL_ERROR_MESSAGE;

        // do not overwrite server side error messages
        if (
            errorMessage !== localErrorMessage &&
            (!errorMessage ||
                errorMessage === DISPLAY_NAME_INPUT_LOCAL_ERROR_MESSAGE)
        ) {
            onError(IUserKeys.displayName, localErrorMessage);
        }
    }, [errorMessage, onError, value]);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={getTextFieldTheme(themeType)}>
                <TextField
                    error={errorMessage != null && !suppressErrorMsg}
                    fullWidth={true}
                    helperText={suppressErrorMsg ? null : errorMessage}
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
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default DisplayNameInput;
