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
    required?: boolean;
    value: string;
}

const CountryInput = (props: ICountryInputProps) => {
    const LOCAL_ERROR_MESSAGES = React.useMemo(
        () => [Dict.account_country_required, Dict.account_country_invalid],
        []
    );

    const { errorMessage, onBlur, onError, onUpdateValue, required, value } =
        props;

    const onChange = React.useCallback(
        (event: any): void => {
            if (errorMessage) {
                onError(IUserKeys.country, null);
            }
            onUpdateValue(IUserKeys.country, event.target.value);
        },
        [errorMessage, onError, onUpdateValue]
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
        const valueLength = value.trim().length;

        let localErrorMessage = null;
        if (required && (!value || valueLength === 0)) {
            localErrorMessage = Dict.account_country_required;
        } else if (value && Formats.LENGTH.MAX.COUNTRY < valueLength) {
            localErrorMessage = Dict.account_country_invalid;
        }

        // do not overwrite server side error messages
        if (
            errorMessage !== localErrorMessage &&
            (!errorMessage || LOCAL_ERROR_MESSAGES.includes(errorMessage))
        ) {
            onError(IUserKeys.country, localErrorMessage);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

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
