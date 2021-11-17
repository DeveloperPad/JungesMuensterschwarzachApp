import * as React from "react";

import { TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { useState } from "react";

interface IHouseNumberInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.houseNumber, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.houseNumber, value: string) => void;
    onBlur: (key: IUserKeys.houseNumber, value: string | null) => void;
    value: string;
}

const HouseNumberInput = (props: IHouseNumberInputProps) => {
    const LOCAL_ERROR_MESSAGE = Dict.account_houseNumber_invalid;

    const { errorMessage, onBlur, onError, onUpdateValue, value } = props;
    const [submit, setSubmit] = useState(false);

    const onChange = (event: any): void => {
        onError(IUserKeys.houseNumber, null);
        onUpdateValue(IUserKeys.houseNumber, event.target.value);
    };
    const onLocalBlur = (_: any): void => {
        if (value) {
            onUpdateValue(IUserKeys.houseNumber, value.trim());
        }

        setSubmit(true);
    };

    useState(() => {
        const localErrorMessage =
            !value ||
            (value.length > 0 &&
                value.length <= Formats.LENGTH.MAX.HOUSE_NUMBER)
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

        onError(IUserKeys.houseNumber, localErrorMessage);

        if (!submit) {
            return;
        }

        if (onBlur) {
            onBlur(IUserKeys.houseNumber, value || null);
        }

        setSubmit(false);
    });

    return (
        <TextField
            error={errorMessage != null}
            helperText={errorMessage}
            inputProps={{
                ...textFieldInputProps,
                maxLength: Formats.LENGTH.MAX.HOUSE_NUMBER,
            }}
            label={Dict.account_houseNumber}
            margin="dense"
            name={IUserKeys.houseNumber}
            onBlur={onLocalBlur}
            onChange={onChange}
            style={grid1Style}
            type="text"
            value={value}
            variant="outlined"
        />
    );
};

export default HouseNumberInput;
