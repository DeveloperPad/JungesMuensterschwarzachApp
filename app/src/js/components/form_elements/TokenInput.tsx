import * as React from "react";

import { MuiThemeProvider, TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import {
    getTextFieldTheme,
    textFieldInputProps,
    ThemeTypes,
} from "../../constants/theme";

export enum ITokenInputKeys {
    tokenCode = "tokenCode",
}

interface ITokenInputProps {
    errorMessage: string | null;
    onUpdateValue: (key: ITokenInputKeys, value: string) => void;
    themeType?: ThemeTypes;
    value: string;
}

const TokenInput = (props: ITokenInputProps) => {
    const { errorMessage, onUpdateValue, themeType, value } = props;

    const onChange = React.useCallback(
        (event: any): void => {
            onUpdateValue(ITokenInputKeys.tokenCode, event.target.value.trim());
        },
        [onUpdateValue]
    );

    return (
        <MuiThemeProvider theme={getTextFieldTheme(themeType)}>
            <TextField
                error={errorMessage != null}
                fullWidth={true}
                helperText={errorMessage}
                inputProps={textFieldInputProps}
                label={Dict.token_code}
                margin="dense"
                name={ITokenInputKeys.tokenCode}
                onChange={onChange}
                type="text"
                value={value}
                variant="outlined"
            />
        </MuiThemeProvider>
    );
};
export default TokenInput;
