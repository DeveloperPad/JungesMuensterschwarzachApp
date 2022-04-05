import * as React from "react";

import { TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { useState } from "react";
import { useEffect } from "react";

interface ILastNameInputProps {
    errorMessage: string | null;
    onBlur: (key: IUserKeys.lastName, value: string | null) => void;
    onError: (key: IUserKeys.lastName, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.lastName, value: string) => void;
    value: string;
}

const LastNameInput = (props: ILastNameInputProps) => {
    const LOCAL_ERROR_MESSAGE = Dict.account_lastName_invalid;

    const { errorMessage, onBlur, onError, onUpdateValue, value } = props;
    const [submit, setSubmit] = useState(false);

    const onChange = (event: any): void => {
        onError(IUserKeys.lastName, null);
        onUpdateValue(IUserKeys.lastName, event.target.value);
    };
    const onLocalBlur = (_: any): void => {
        if (value) {
            onUpdateValue(IUserKeys.lastName, value.trim());
        }

        setSubmit(true);
    };

    useEffect(() => {
        const localErrorMessage =
            !value ||
            (value.length > 0 && value.length <= Formats.LENGTH.MAX.LAST_NAME)
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

        onError(IUserKeys.lastName, localErrorMessage);

        if (!submit) {
            return;
        }

        if (onBlur) {
            onBlur(IUserKeys.lastName, value || null);
        }

        setSubmit(false);
    }, [errorMessage, LOCAL_ERROR_MESSAGE, onBlur, onError, submit, value]);

    return (
        <TextField
            error={errorMessage != null}
            helperText={errorMessage}
            inputProps={{
                ...textFieldInputProps,
                maxLength: Formats.LENGTH.MAX.LAST_NAME,
            }}
            label={Dict.account_lastName}
            margin="dense"
            name={IUserKeys.lastName}
            onBlur={onLocalBlur}
            onChange={onChange}
            style={grid1Style}
            type="text"
            value={value}
            variant="outlined"
        />
    );
};

export default LastNameInput;
