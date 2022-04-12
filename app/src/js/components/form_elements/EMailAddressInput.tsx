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

interface IEMailAddressInputProps {
    disabled?: boolean;
    errorMessage: string | null;
    onBlur?: (key: IUserKeys.eMailAddress, value: string) => void;
    onError: (key: IUserKeys.eMailAddress, value: string) => void;
    onUpdateValue: (key: IUserKeys.eMailAddress, value: string) => void;
    suppressErrorMsg?: boolean;
    style?: React.CSSProperties;
    themeType?: ThemeTypes;
    value: string;
}

export const E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGE =
    Dict.account_eMailAddress_invalid;

const EMailAddressInput = (props: IEMailAddressInputProps) => {
    const {
        disabled,
        errorMessage,
        onBlur,
        onError,
        onUpdateValue,
        suppressErrorMsg,
        style,
        themeType,
        value,
    } = props;

    const onChange = React.useCallback(
        (event: any): void => {
            onUpdateValue(IUserKeys.eMailAddress, event.target.value);
        },
        [onUpdateValue]
    );
    const onLocalBlur = React.useCallback(
        (_: any): void => {
            if (onBlur) {
                onBlur(IUserKeys.eMailAddress, value);
            }
        },
        [onBlur, value]
    );

    React.useEffect(() => {
        const localErrorMessage = Formats.REGEXPS.E_MAIL_ADDRESS.test(value)
            ? null
            : E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGE;

        if (
            errorMessage !== localErrorMessage &&
            (!errorMessage ||
                errorMessage === E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGE)
        ) {
            onError(IUserKeys.eMailAddress, localErrorMessage);
        }
    }, [errorMessage, onError, value]);

    return (
        <MuiThemeProvider theme={getTextFieldTheme(themeType)}>
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
        </MuiThemeProvider>
    );
};

export default EMailAddressInput;
