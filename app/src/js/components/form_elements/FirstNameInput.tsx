import * as React from "react";

import { TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { useState } from "react";
import { useEffect } from "react";

interface IFirstNameInputProps {
    errorMessage: string | null;
    onBlur: (key: IUserKeys.firstName, value: string | null) => void;
    onError: (key: IUserKeys.firstName, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.firstName, value: string) => void;
    value: string;
}

const FirstNameInput = (props: IFirstNameInputProps) => {
    const LOCAL_ERROR_MESSAGE = Dict.account_firstName_invalid;

    const { errorMessage, onBlur, onError, onUpdateValue, value } = props;
    const [submit, setSubmit] = useState(false);

    const onChange = (event: any): void => {
        onError(IUserKeys.firstName, null);
        onUpdateValue(IUserKeys.firstName, event.target.value);
    };
    const onLocalBlur = (_: any): void => {
        if (value) {
            onUpdateValue(IUserKeys.firstName, value.trim());
        }

        setSubmit(true);
    };

    useEffect(() => {
        const localErrorMessage =
            !value ||
            (value.length > 0 && value.length <= Formats.LENGTH.MAX.FIRST_NAME)
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

        onError(IUserKeys.firstName, localErrorMessage);

        if (!submit) {
            return;
        }

        if (onBlur) {
            onBlur(IUserKeys.firstName, value || null);
        }

        setSubmit(false);
    }, [errorMessage, LOCAL_ERROR_MESSAGE, onBlur, onError, submit, value]);

    return (
        <TextField
            error={errorMessage != null}
            helperText={errorMessage}
            inputProps={{
                ...textFieldInputProps,
                maxLength: Formats.LENGTH.MAX.FIRST_NAME,
            }}
            label={Dict.account_firstName}
            margin="dense"
            name={IUserKeys.firstName}
            onBlur={onLocalBlur}
            onChange={onChange}
            style={grid1Style}
            type="text"
            value={value}
            variant="outlined"
        />
    );
};

export default FirstNameInput;
