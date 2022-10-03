import * as React from "react";

import { TextField } from "@mui/material";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";

interface IStreetNameInputProps {
    errorMessage: string | null;
    onBlur: (key: IUserKeys.streetName, value: string | null) => void;
    onError: (key: IUserKeys.streetName, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.streetName, value: string) => void;
    required?: boolean;
    style?: React.CSSProperties;
    value: string;
}

const StreetNameInput = (props: IStreetNameInputProps) => {
    const LOCAL_ERROR_MESSAGES = React.useMemo(
        () => [
            Dict.account_streetName_required,
            Dict.account_streetName_invalid,
        ],
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
                onError(IUserKeys.streetName, null);
            }
            onUpdateValue(IUserKeys.streetName, event.target.value);
        },
        [errorMessage, onError, onUpdateValue]
    );
    const onLocalBlur = React.useCallback(
        (_: any): void => {
            if (value) {
                onUpdateValue(IUserKeys.streetName, value.trim());
            }

            onBlur(IUserKeys.streetName, value);
        },
        [onBlur, onUpdateValue, value]
    );

    React.useEffect(() => {
        const valueLength = value.trim().length;

        let localErrorMessage = null;
        if (required && (!value || valueLength === 0)) {
            localErrorMessage = Dict.account_streetName_required;
        } else if (value && Formats.LENGTH.MAX.STREET_NAME < valueLength) {
            localErrorMessage = Dict.account_streetName_invalid;
        }

        // do not overwrite server side error messages
        if (
            errorMessage !== localErrorMessage &&
            (!errorMessage || LOCAL_ERROR_MESSAGES.includes(errorMessage))
        ) {
            onError(IUserKeys.streetName, localErrorMessage);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <TextField
            error={errorMessage != null}
            helperText={errorMessage}
            inputProps={{
                ...textFieldInputProps,
                maxLength: Formats.LENGTH.MAX.STREET_NAME,
            }}
            label={Dict.account_streetName}
            margin="dense"
            name={IUserKeys.streetName}
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

export default StreetNameInput;
