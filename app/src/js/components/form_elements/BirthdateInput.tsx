import moment from "moment";
import * as React from "react";

import { DatePicker } from "@material-ui/pickers";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { formatDate } from "../../constants/global-functions";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { useState } from "react";
import { useEffect } from "react";

interface IBirthdateInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.birthdate, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.birthdate, value: Date | null) => void;
    onBlur: (key: IUserKeys.birthdate, value: string | null) => void;
    value: Date | null;
}

const BirthdateInput = (props: IBirthdateInputProps) => {
    const LOCAL_ERROR_MESSAGE = Dict.account_birthdate_invalid;

    const { errorMessage, onBlur, onError, onUpdateValue, value } = props;
    const [submit, setSubmit] = useState(false);

    const onChange = (date: any): void => {
        onError(IUserKeys.birthdate, null);
        onUpdateValue(IUserKeys.birthdate, date);
    };
    const localOnBlur = (_: any): void => {
        setSubmit(true);
    };

    useEffect(() => {
        const localErrorMessage =
            value === null || moment().isAfter(moment(value))
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

        onError(IUserKeys.birthdate, localErrorMessage);

        if (!submit) {
            return;
        }

        if (onBlur) {
            onBlur(
                IUserKeys.birthdate,
                value ? formatDate(value, Formats.DATE.DATE_DATABASE) : null
            );
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
        <DatePicker
            cancelLabel={Dict.label_cancel}
            clearable={true}
            clearLabel={Dict.label_delete}
            disableFuture={true}
            error={errorMessage != null}
            format={Formats.DATE.DATE_PICKER}
            helperText={errorMessage}
            inputProps={textFieldInputProps}
            inputVariant="outlined"
            label={Dict.account_birthdate}
            margin="dense"
            name={IUserKeys.birthdate}
            okLabel={Dict.label_confirm}
            onChange={onChange}
            onBlur={localOnBlur}
            placeholder={Dict.account_birthdate_placeholder}
            style={grid1Style}
            value={value}
        />
    );
};

export default BirthdateInput;
