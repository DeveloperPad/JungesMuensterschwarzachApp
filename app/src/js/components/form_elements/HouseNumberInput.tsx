import * as React from "react";

import { TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";

interface IHouseNumberInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.houseNumber, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.houseNumber, value: string) => void;
    onBlur: (key: IUserKeys.houseNumber, value: string | null) => void;
    required?: boolean;
    value: string;
}

const HouseNumberInput = (props: IHouseNumberInputProps) => {
    const LOCAL_ERROR_MESSAGES = React.useMemo(
        () => [
            Dict.account_houseNumber_required,
            Dict.account_houseNumber_invalid,
        ],
        []
    );
    const { errorMessage, onBlur, onError, onUpdateValue, required, value } =
        props;

    const onChange = React.useCallback(
        (event: any): void => {
            if (errorMessage) {
                onError(IUserKeys.houseNumber, null);
            }
            onUpdateValue(IUserKeys.houseNumber, event.target.value);
        },
        [errorMessage, onError, onUpdateValue]
    );
    const onLocalBlur = React.useCallback(
        (_: any): void => {
            if (value) {
                onUpdateValue(IUserKeys.houseNumber, value.trim());
            }

            onBlur(IUserKeys.houseNumber, value);
        },
        [onBlur, onUpdateValue, value]
    );

    React.useEffect(() => {
        const valueLength = value.trim().length;

        let localErrorMessage = null;
        if (required && (!value || valueLength === 0)) {
            localErrorMessage = Dict.account_houseNumber_required;
        } else if (value && Formats.LENGTH.MAX.HOUSE_NUMBER < valueLength) {
            localErrorMessage = Dict.account_houseNumber_invalid;
        }

        // do not overwrite server side error messages
        if (
            errorMessage !== localErrorMessage &&
            (!errorMessage || LOCAL_ERROR_MESSAGES.includes(errorMessage))
        ) {
            onError(IUserKeys.houseNumber, localErrorMessage);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

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
