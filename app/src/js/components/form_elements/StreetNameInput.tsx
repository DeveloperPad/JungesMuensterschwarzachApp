import * as React from "react";

import { TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { useState } from "react";
import { useEffect } from "react";

interface IStreetNameInputProps {
    errorMessage: string | null;
    onBlur: (key: IUserKeys.streetName, value: string | null) => void;
    onError: (key: IUserKeys.streetName, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.streetName, value: string) => void;
    style?: React.CSSProperties;
    value: string;
}

const StreetNameInput = (props: IStreetNameInputProps) => {
    const LOCAL_ERROR_MESSAGE = Dict.account_streetName_invalid;

    const { errorMessage, onBlur, onError, onUpdateValue, style, value } =
        props;
    const [submit, setSubmit] = useState(false);

    const onChange = (event: any): void => {
        onError(IUserKeys.streetName, null);
        onUpdateValue(IUserKeys.streetName, event.target.value);
    };
    const localOnBlur = (_: any): void => {
        if (value) {
            onUpdateValue(IUserKeys.streetName, value.trim());
        }

        setSubmit(true);
    };

    useEffect(() => {
        const localErrorMessage =
            !value ||
            (value.length > 0 && value.length <= Formats.LENGTH.MAX.STREET_NAME)
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

        onError(IUserKeys.streetName, localErrorMessage);

        if (!submit) {
            return;
        }

        if (onBlur) {
            onBlur(IUserKeys.streetName, value || null);
        }

        setSubmit(false);
    }, [errorMessage, LOCAL_ERROR_MESSAGE, onBlur, onError, submit, value]);

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
            onBlur={localOnBlur}
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
