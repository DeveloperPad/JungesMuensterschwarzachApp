import * as React from "react";

import { TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";

interface ICountryInputProps {
    errorMessage: string | null;
    onBlur: (key: IUserKeys.country, value: string | null) => void;
    onError: (key: IUserKeys.country, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.country, value: string) => void;
    value: string;
}

const CountryInput = (props: ICountryInputProps) => {
    const LOCAL_ERROR_MESSAGE = Dict.account_country_invalid;

    const { errorMessage, onBlur, onError, onUpdateValue, value } = props;

    const onChange = React.useCallback(
        (event: any): void => {
            onUpdateValue(IUserKeys.country, event.target.value);
        },
        [onUpdateValue]
    );
    const onLocalBlur = React.useCallback(
        (_: any): void => {
            if (value) {
                onUpdateValue(IUserKeys.country, value.trim());
            }

            onBlur(IUserKeys.country, value);
        },
        [onBlur, onUpdateValue, value]
    );

    React.useEffect(() => {
        const localErrorMessage =
            !value ||
            (value.length > 0 && value.length <= Formats.LENGTH.MAX.COUNTRY)
                ? null
                : LOCAL_ERROR_MESSAGE;

        // do not overwrite server side error messages
        if (
            errorMessage !== localErrorMessage &&
            (!errorMessage || errorMessage === LOCAL_ERROR_MESSAGE)
        ) {
            onError(IUserKeys.country, localErrorMessage);
        }
    }, [LOCAL_ERROR_MESSAGE, errorMessage, onError, value]);

    return (
        <TextField
            error={errorMessage != null}
            helperText={errorMessage}
            inputProps={{
                ...textFieldInputProps,
                maxLength: Formats.LENGTH.MAX.COUNTRY,
            }}
            label={Dict.account_country}
            margin="dense"
            name={IUserKeys.country}
            onBlur={onLocalBlur}
            onChange={onChange}
            style={grid1Style}
            type="text"
            value={value}
            variant="outlined"
        />
    );
};

export default CountryInput;
