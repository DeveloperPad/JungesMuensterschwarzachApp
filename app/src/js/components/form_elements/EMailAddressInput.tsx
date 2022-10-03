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

interface IEMailAddressInputProps {
    disabled?: boolean;
    errorMessage: string | null;
    onBlur?: (key: IUserKeys.eMailAddress, value: string) => void;
    onError: (key: IUserKeys.eMailAddress, value: string) => void;
    onUpdateValue: (key: IUserKeys.eMailAddress, value: string) => void;
    required?: boolean;
    suppressErrorMsg?: boolean;
    style?: React.CSSProperties;
    themeType?: ThemeTypes;
    value: string;
}

export const E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGES = [
    Dict.account_eMailAddress_required,
    Dict.account_eMailAddress_invalid,
];

const EMailAddressInput = (props: IEMailAddressInputProps) => {
    const {
        disabled,
        errorMessage,
        onBlur,
        onError,
        onUpdateValue,
        required,
        suppressErrorMsg,
        style,
        themeType,
        value,
    } = props;

    const onChange = React.useCallback(
        (event: any): void => {
            if (errorMessage) {
                onError(IUserKeys.eMailAddress, null);
            }
            onUpdateValue(IUserKeys.eMailAddress, event.target.value);
        },
        [errorMessage, onError, onUpdateValue]
    );
    const onLocalBlur = React.useCallback(
        (_: any): void => {
            const normalizedValue = value.trim().toLowerCase();

            onUpdateValue(IUserKeys.eMailAddress, normalizedValue);
            if (onBlur) {
                onBlur(IUserKeys.eMailAddress, normalizedValue);
            }
        },
        [onBlur, onUpdateValue, value]
    );

    React.useEffect(() => {
        let localErrorMessage = null;
        if (required && (!value || value.trim().length === 0)) {
            localErrorMessage = Dict.account_eMailAddress_required;
        } else if (!Formats.REGEXPS.E_MAIL_ADDRESS.test(value)) {
            localErrorMessage = Dict.account_eMailAddress_invalid;
        }

        if (
            errorMessage !== localErrorMessage &&
            (!errorMessage ||
                E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGES.includes(
                    errorMessage
                ))
        ) {
            onError(IUserKeys.eMailAddress, localErrorMessage);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={getTextFieldTheme(themeType)}>
                <TextField
                    disabled={disabled}
                    error={errorMessage !== null && !suppressErrorMsg}
                    fullWidth={true}
                    helperText={suppressErrorMsg ? null : errorMessage}
                    inputProps={textFieldInputProps}
                    label={Dict.account_eMailAddress}
                    margin="dense"
                    name={IUserKeys.eMailAddress}
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

export default EMailAddressInput;
