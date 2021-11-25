import * as React from "react";

import { TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { useState } from "react";
import { useEffect } from "react";

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
    const [submit, setSubmit] = useState(false);

    const onChange = (event: any): void => {
        onError(IUserKeys.supplementaryAddress, null);
        onUpdateValue(IUserKeys.supplementaryAddress, event.target.value);
    };
    const onLocalBlur = (_: any): void => {
        if (value) {
            onUpdateValue(IUserKeys.supplementaryAddress, value.trim());
        }

        setSubmit(true);
    };

    useEffect(() => {
        const localErrorMessage =
            !value ||
            (value.length > 0 &&
                value.length <= Formats.LENGTH.MAX.SUPPLEMENTARY_ADDRESS)
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

        onError(IUserKeys.supplementaryAddress, localErrorMessage);

        if (!submit) {
            return;
        }

        if (onBlur) {
            onBlur(IUserKeys.supplementaryAddress, value || null);
        }

        setSubmit(false);
    }, [errorMessage, LOCAL_ERROR_MESSAGE, onBlur, onError, submit, value]);

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
