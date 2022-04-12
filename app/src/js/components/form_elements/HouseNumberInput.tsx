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
    value: string;
}

const HouseNumberInput = (props: IHouseNumberInputProps) => {
    const LOCAL_ERROR_MESSAGE = Dict.account_houseNumber_invalid;

    const { errorMessage, onBlur, onError, onUpdateValue, value } = props;

    const onChange = React.useCallback(
        (event: any): void => {
            onUpdateValue(IUserKeys.houseNumber, event.target.value);
        },
        [onUpdateValue]
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
        const localErrorMessage =
            !value ||
            (value.length > 0 &&
                value.length <= Formats.LENGTH.MAX.HOUSE_NUMBER)
                ? null
                : LOCAL_ERROR_MESSAGE;

        // do not overwrite server side error messages
        if (
            errorMessage !== localErrorMessage &&
            (!errorMessage || errorMessage === LOCAL_ERROR_MESSAGE)
        ) {
            onError(IUserKeys.houseNumber, localErrorMessage);
        }
    }, [LOCAL_ERROR_MESSAGE, errorMessage, onError, value]);

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
