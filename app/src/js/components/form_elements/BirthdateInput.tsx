import moment from "moment";
import * as React from "react";

import { DatePicker } from "@material-ui/pickers";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { formatDate } from "../../constants/global-functions";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";

interface IBirthdateInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.birthdate, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.birthdate, value: Date | null) => void;
    onBlur: (key: IUserKeys.birthdate, value: string | null) => void;
    required?: boolean;
    value: Date | null;
}

const BirthdateInput = (props: IBirthdateInputProps) => {
    const LOCAL_ERROR_MESSAGES = React.useMemo(
        () => [Dict.account_birthdate_required, Dict.account_birthdate_invalid],
        []
    );

    const { errorMessage, onBlur, onError, onUpdateValue, required, value } =
        props;

    const onChange = React.useCallback(
        (date: any): void => {
            if (errorMessage) {
                onError(IUserKeys.birthdate, null);
            }
            onUpdateValue(IUserKeys.birthdate, date);
        },
        [errorMessage, onError, onUpdateValue]
    );
    const onLocalBlur = React.useCallback(
        (_: any): void => {
            onBlur(
                IUserKeys.birthdate,
                value ? formatDate(value, Formats.DATE.DATE_DATABASE) : null
            );
        },
        [onBlur, value]
    );

    React.useEffect(() => {
        let localErrorMessage = null;
        if (required && !value) {
            localErrorMessage = Dict.account_birthdate_required;
        } else if (value && moment(value).isAfter(moment())) {
            localErrorMessage = Dict.account_birthdate_invalid;
        }

        // do not overwrite server side error messages
        if (
            errorMessage !== localErrorMessage &&
            (!errorMessage || LOCAL_ERROR_MESSAGES.includes(errorMessage))
        ) {
            onError(IUserKeys.birthdate, localErrorMessage);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

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
            onBlur={onLocalBlur}
            placeholder={Dict.account_birthdate_placeholder}
            style={grid1Style}
            value={value}
        />
    );
};

export default BirthdateInput;
