import * as React from 'react';

import { MuiThemeProvider, TextField } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import { getTextFieldTheme, textFieldInputProps, ThemeTypes } from '../../constants/theme';

export enum ITokenInputKeys {
    tokenCode = "tokenCode"
}

interface ITokenInputProps {
    errorMessage: string | null;
    onUpdateValue: (key: ITokenInputKeys, value: string) => void;
    themeType?: ThemeTypes
    value: string;
}

export default class TokenInput extends React.Component<ITokenInputProps> {

    public render(): React.ReactNode {
        return (
            <MuiThemeProvider theme={getTextFieldTheme(this.props.themeType)}>
                <TextField
                    error={this.props.errorMessage != null}
                    fullWidth={true}
                    helperText={this.props.errorMessage}
                    inputProps={textFieldInputProps}
                    label={Dict.token_code}
                    margin="dense"
                    name={ITokenInputKeys.tokenCode}
                    onChange={this.onChange}
                    type="text"
                    value={this.props.value}
                    variant="outlined"
                />
            </MuiThemeProvider>
        );
    }

    public shouldComponentUpdate(nextProps: ITokenInputProps, nextState: any, nextContext: any): boolean {
        return this.props.errorMessage !== nextProps.errorMessage
            || this.props.value !== nextProps.value;
    }

    private onChange = (event: any): void => {
        this.props.onUpdateValue(
            ITokenInputKeys.tokenCode,
            event.target.value.trim()
        );
    }

}