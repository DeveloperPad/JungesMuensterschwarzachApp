import * as React from "react";

import { TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { useState } from "react";
import { useEffect } from "react";

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
    const [submit, setSubmit] = useState(false);

    const onChange = (event: any): void => {
        onError(IUserKeys.phoneNumber, null);
        onUpdateValue(IUserKeys.phoneNumber, event.target.value);
    };
    const localOnBlur = (_: any): void => {
        if (value) {
            onUpdateValue(IUserKeys.phoneNumber, value.trim());
        }

        setSubmit(true);
    };

    useEffect(() => {
        const localErrorMessage =
            !value ||
            (value.length > 0 &&
                value.length <= Formats.LENGTH.MAX.PHONE_NUMBER)
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

        onError(IUserKeys.phoneNumber, localErrorMessage);

        if (!submit) {
            return;
        }

        if (onBlur) {
            onBlur(IUserKeys.phoneNumber, value || null);
        }

        setSubmit(false);
    }, [errorMessage, LOCAL_ERROR_MESSAGE, onBlur, onError, submit, value]);

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
            onBlur={localOnBlur}
            onChange={onChange}
            style={grid1Style}
            type="text"
            value={value}
            variant="outlined"
        />
    );
};

export default PhoneNumberInput;
