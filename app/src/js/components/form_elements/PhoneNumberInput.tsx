import * as React from "react";

import { TextField } from "@mui/material";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";

interface IPhoneNumberInputProps {
    errorMessage: string | null;
    onBlur: (key: IUserKeys.phoneNumber, value: string | null) => void;
    onError: (key: IUserKeys.phoneNumber, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.phoneNumber, value: string) => void;
    value: string;
}

const PhoneNumberInput = (props: IPhoneNumberInputProps) => {
    const LOCAL_ERROR_MESSAGE = Dict.account_phoneNumber_invalid;

    const { errorMessage, onBlur, onError, onUpdateValue, value } = props;

    const onChange = React.useCallback(
        (event: any): void => {
            onUpdateValue(IUserKeys.phoneNumber, event.target.value);
        },
        [onUpdateValue]
    );
    const onLocalBlur = React.useCallback(
        (_: any): void => {
            if (value) {
                onUpdateValue(IUserKeys.phoneNumber, value.trim());
            }

            onBlur(IUserKeys.phoneNumber, value);
        },
        [onBlur, onUpdateValue, value]
    );

    React.useEffect(() => {
        const localErrorMessage =
            !value ||
            (value.length > 0 &&
                value.length <= Formats.LENGTH.MAX.PHONE_NUMBER)
                ? null
                : LOCAL_ERROR_MESSAGE;

        // do not overwrite server side error messages
        if (
            errorMessage !== localErrorMessage &&
            (!errorMessage || errorMessage === LOCAL_ERROR_MESSAGE)
        ) {
            onError(IUserKeys.phoneNumber, localErrorMessage);
        }
    }, [LOCAL_ERROR_MESSAGE, errorMessage, onError, value]);

    return (
        <TextField
            error={errorMessage != null}
            helperText={errorMessage}
            inputProps={{
                ...textFieldInputProps,
                maxLength: Formats.LENGTH.MAX.PHONE_NUMBER,
            }}
            label={Dict.account_phoneNumber}
            margin="dense"
            name={IUserKeys.phoneNumber}
            onBlur={onLocalBlur}
            onChange={onChange}
            style={grid1Style}
            type="text"
            value={value}
            variant="outlined"
        />
    );
};

export default PhoneNumberInput;
