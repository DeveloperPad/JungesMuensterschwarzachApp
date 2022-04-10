import * as React from "react";

import { TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";

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

    const onChange = React.useCallback(
        (event: any): void => {
            onUpdateValue(IUserKeys.firstName, event.target.value);
        },
        [onUpdateValue]
    );
    const onLocalBlur = React.useCallback(
        (_: any): void => {
            if (value) {
                onUpdateValue(IUserKeys.firstName, value.trim());
            }

            onBlur(IUserKeys.firstName, value);
        },
        [onBlur, onUpdateValue, value]
    );

    React.useEffect(() => {
        const localErrorMessage =
            !value ||
            (value.length > 0 && value.length <= Formats.LENGTH.MAX.FIRST_NAME)
                ? null
                : LOCAL_ERROR_MESSAGE;

        // do not overwrite server side error messages
        if (
            errorMessage !== localErrorMessage &&
            (!errorMessage || errorMessage === LOCAL_ERROR_MESSAGE)
        ) {
            onError(IUserKeys.firstName, localErrorMessage);
        }
    }, [errorMessage, LOCAL_ERROR_MESSAGE, onBlur, onError, value]);

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
