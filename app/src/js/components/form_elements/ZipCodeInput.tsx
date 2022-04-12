import * as React from "react";

import { TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";

interface IZipCodeInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.zipCode, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.zipCode, value: string) => void;
    onBlur: (key: IUserKeys.zipCode, value: string | null) => void;
    style?: React.CSSProperties;
    value: string;
}

const ZipCodeInput = (props: IZipCodeInputProps) => {
    const LOCAL_ERROR_MESSAGE = Dict.account_zipCode_invalid;

    const { errorMessage, onBlur, onError, onUpdateValue, style, value } =
        props;

    const onChange = React.useCallback(
        (event: any): void => {
            onUpdateValue(IUserKeys.zipCode, event.target.value);
        },
        [onUpdateValue]
    );
    const onLocalBlur = React.useCallback(
        (_: any): void => {
            if (value) {
                onUpdateValue(IUserKeys.zipCode, value.trim());
            }

            onBlur(IUserKeys.zipCode, value);
        },
        [onBlur, onUpdateValue, value]
    );

    React.useEffect(() => {
        const localErrorMessage =
            !value ||
            (value.length > 0 && value.length <= Formats.LENGTH.MAX.ZIP_CODE)
                ? null
                : LOCAL_ERROR_MESSAGE;

        // do not overwrite server side error messages
        if (
            errorMessage !== localErrorMessage &&
            (!errorMessage || errorMessage === LOCAL_ERROR_MESSAGE)
        ) {
            onError(IUserKeys.zipCode, localErrorMessage);
        }
    }, [LOCAL_ERROR_MESSAGE, errorMessage, onError, value]);

    return (
        <TextField
            error={errorMessage != null}
            helperText={errorMessage}
            inputProps={{
                ...textFieldInputProps,
                maxLength: Formats.LENGTH.MAX.ZIP_CODE,
            }}
            label={Dict.account_zipCode}
            margin="dense"
            name={IUserKeys.zipCode}
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

export default ZipCodeInput;
