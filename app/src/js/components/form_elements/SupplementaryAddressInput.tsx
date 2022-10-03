import * as React from "react";

import { TextField } from "@mui/material";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";

interface ISupplementaryAddressInputProps {
    errorMessage: string | null;
    onBlur: (key: IUserKeys.supplementaryAddress, value: string | null) => void;
    onError: (
        key: IUserKeys.supplementaryAddress,
        value: string | null
    ) => void;
    onUpdateValue: (key: IUserKeys.supplementaryAddress, value: string) => void;
    value: string;
}

const SupplementaryAddressInput = (props: ISupplementaryAddressInputProps) => {
    const LOCAL_ERROR_MESSAGE = Dict.account_supplementaryAddress_invalid;

    const { errorMessage, onBlur, onError, onUpdateValue, value } = props;

    const onChange = React.useCallback(
        (event: any): void => {
            onUpdateValue(IUserKeys.supplementaryAddress, event.target.value);
        },
        [onUpdateValue]
    );
    const onLocalBlur = React.useCallback(
        (_: any): void => {
            if (value) {
                onUpdateValue(IUserKeys.supplementaryAddress, value.trim());
            }

            onBlur(IUserKeys.supplementaryAddress, value);
        },
        [onBlur, onUpdateValue, value]
    );

    React.useEffect(() => {
        const localErrorMessage =
            !value ||
            (value.length > 0 &&
                value.length <= Formats.LENGTH.MAX.SUPPLEMENTARY_ADDRESS)
                ? null
                : LOCAL_ERROR_MESSAGE;

        // do not overwrite server side error messages
        if (
            errorMessage !== localErrorMessage &&
            (!errorMessage || errorMessage === LOCAL_ERROR_MESSAGE)
        ) {
            onError(IUserKeys.supplementaryAddress, localErrorMessage);
        }
    }, [LOCAL_ERROR_MESSAGE, errorMessage, onError, value]);

    return (
        <TextField
            error={errorMessage != null}
            helperText={errorMessage}
            inputProps={{
                ...textFieldInputProps,
                maxLength: Formats.LENGTH.MAX.SUPPLEMENTARY_ADDRESS,
            }}
            label={Dict.account_supplementaryAddress}
            margin="dense"
            name={IUserKeys.supplementaryAddress}
            onBlur={onLocalBlur}
            onChange={onChange}
            style={grid1Style}
            type="text"
            value={value}
            variant="outlined"
        />
    );
};

export default SupplementaryAddressInput;
