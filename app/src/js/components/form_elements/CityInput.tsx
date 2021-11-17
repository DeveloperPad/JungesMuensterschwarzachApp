import * as React from "react";
import { useState } from "react";

import { TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { useEffect } from "react";

interface ICityInputProps {
    errorMessage: string | null;
    onBlur: (key: IUserKeys.city, value: string | null) => void;
    onError: (key: IUserKeys.city, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.city, value: string) => void;
    value: string;
}

const CityInput = (props: ICityInputProps) => {
    const LOCAL_ERROR_MESSAGE = Dict.account_city_invalid;

    const { errorMessage, onBlur, onError, onUpdateValue, value } = props;
    const [submit, setSubmit] = useState(false);

    const onChange = (event: any): void => {
        onError(IUserKeys.city, null);
        onUpdateValue(IUserKeys.city, event.target.value);
    };
    const localOnBlur = (_: any): void => {
        if (value) {
            onUpdateValue(IUserKeys.city, value.trim());
        }

        setSubmit(true);
    };

    useEffect(() => {
        const localErrorMessage =
            !value ||
            (value.length > 0 && value.length <= Formats.LENGTH.MAX.CITY)
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

        onError(IUserKeys.city, localErrorMessage);

        if (!submit) {
            return;
        }

        if (onBlur) {
            onBlur(IUserKeys.city, value || null);
        }

        setSubmit(false);
    }, [
        errorMessage,
        LOCAL_ERROR_MESSAGE,
        onBlur,
        onError,
        submit,
        value,
    ]);

    return (
        <TextField
            error={errorMessage != null}
            helperText={errorMessage}
            inputProps={{
                ...textFieldInputProps,
                maxLength: Formats.LENGTH.MAX.CITY,
            }}
            label={Dict.account_city}
            margin="dense"
            name={IUserKeys.city}
            onBlur={localOnBlur}
            onChange={onChange}
            style={grid1Style}
            type="text"
            value={value}
            variant="outlined"
        />
    );
};

export default CityInput;
