import * as React from "react";

import { grid1Style, textFieldInputProps } from "../../constants/theme";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { IUserKeys } from "../../networking/account_data/IUser";
import { TextField } from "@mui/material";

interface IZipCodeInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.zipCode, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.zipCode, value: string) => void;
    onBlur: (key: IUserKeys.zipCode, value: string | null) => void;
    required?: boolean;
    style?: React.CSSProperties;
    value: string;
}

const ZipCodeInput = (props: IZipCodeInputProps) => {
    const LOCAL_ERROR_MESSAGES = React.useMemo(
        () => [Dict.account_zipCode_required, Dict.account_zipCode_invalid],
        []
    );

    const {
        errorMessage,
        onBlur,
        onError,
        onUpdateValue,
        required,
        style,
        value,
    } = props;

    const onChange = React.useCallback(
        (event: any): void => {
            if (errorMessage) {
                onError(IUserKeys.zipCode, null);
            }
            onUpdateValue(IUserKeys.zipCode, event.target.value);
        },
        [errorMessage, onError, onUpdateValue]
    );
    const onLocalBlur = React.useCallback(
        (_: any): void => {
            if (value) {
                onUpdateValue(IUserKeys.zipCode, value.trim());
            }

            onBlur(IUserKeys.zipCode, value);
        },
        [onBlur, onUpdateValue, value]
    );

    React.useEffect(() => {
        const valueLength = value.trim().length;

        let localErrorMessage = null;
        if (required && (!value || valueLength === 0)) {
            localErrorMessage = Dict.account_zipCode_required;
        } else if (value && Formats.LENGTH.MAX.ZIP_CODE < valueLength) {
            localErrorMessage = Dict.account_zipCode_invalid;
        }

        // do not overwrite server side error messages
        if (
            errorMessage !== localErrorMessage &&
            (!errorMessage || LOCAL_ERROR_MESSAGES.includes(errorMessage))
        ) {
            onError(IUserKeys.zipCode, localErrorMessage);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <TextField
            error={errorMessage != null}
            helperText={errorMessage}
            inputProps={{
                ...textFieldInputProps,
                maxLength: Formats.LENGTH.MAX.ZIP_CODE,
            }}
            label={Dict.account_zipCode}
            margin="dense"
            name={IUserKeys.zipCode}
            onBlur={onLocalBlur}
            onChange={onChange}
            style={{
                ...grid1Style,
                ...style,
            }}
            type="text"
            value={value}
            variant="outlined"
        />
    );
};

export default ZipCodeInput;
