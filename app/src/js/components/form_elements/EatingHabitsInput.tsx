import * as React from "react";

import { TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { useState } from "react";
import { useEffect } from "react";

interface IEatingHabitsInputProps {
    errorMessage: string | null;
    onBlur: (key: IUserKeys.eatingHabits, value: string | null) => void;
    onError: (key: IUserKeys.eatingHabits, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.eatingHabits, value: string) => void;
    value: string;
}

const EatingHabitsInput = (props: IEatingHabitsInputProps) => {
    const LOCAL_ERROR_MESSAGE = Dict.account_eatingHabits_invalid;

    const { errorMessage, onBlur, onError, onUpdateValue, value } = props;
    const [submit, setSubmit] = useState(false);

    const onChange = (event: any): void => {
        onError(IUserKeys.eatingHabits, null);
        onUpdateValue(IUserKeys.eatingHabits, event.target.value);
    };
    const onLocalBlur = (_: any): void => {
        if (value) {
            onUpdateValue(IUserKeys.eatingHabits, value.trim());
        }

        setSubmit(true);
    };

    useEffect(() => {
        const localErrorMessage =
            !value || value.length <= Formats.LENGTH.MAX.EATING_HABITS
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

        onError(IUserKeys.eatingHabits, localErrorMessage);

        if (!submit) {
            return;
        }

        if (onBlur) {
            onBlur(IUserKeys.eatingHabits, value || null);
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
            error={errorMessage !== null}
            helperText={errorMessage}
            inputProps={{
                ...textFieldInputProps,
                maxLength: Formats.LENGTH.MAX.EATING_HABITS,
            }}
            label={Dict.account_eatingHabits}
            margin="dense"
            multiline={true}
            name={IUserKeys.eatingHabits}
            onBlur={onLocalBlur}
            onChange={onChange}
            rows={Formats.ROWS.STANDARD.EATING_HABITS}
            style={grid1Style}
            value={value}
            variant="outlined"
        />
    );
};

export default EatingHabitsInput;
