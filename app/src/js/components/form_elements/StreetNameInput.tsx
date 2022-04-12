import * as React from "react";

import { TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";

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

    const onChange = React.useCallback(
        (event: any): void => {
            onUpdateValue(IUserKeys.streetName, event.target.value);
        },
        [onUpdateValue]
    );
    const onLocalBlur = React.useCallback(
        (_: any): void => {
            if (value) {
                onUpdateValue(IUserKeys.streetName, value.trim());
            }

            onBlur(IUserKeys.streetName, value);
        },
        [onBlur, onUpdateValue, value]
    );

    React.useEffect(() => {
        const localErrorMessage =
            !value ||
            (value.length > 0 && value.length <= Formats.LENGTH.MAX.STREET_NAME)
                ? null
                : LOCAL_ERROR_MESSAGE;

        // do not overwrite server side error messages
        if (
            errorMessage !== localErrorMessage &&
            (!errorMessage || errorMessage === LOCAL_ERROR_MESSAGE)
        ) {
            onError(IUserKeys.streetName, localErrorMessage);
        }
    }, [LOCAL_ERROR_MESSAGE, errorMessage, onError, value]);

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
            onBlur={onLocalBlur}
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
