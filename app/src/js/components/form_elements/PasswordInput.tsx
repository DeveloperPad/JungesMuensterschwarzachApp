import * as React from 'react';

import { MuiThemeProvider, TextField } from '@material-ui/core';

import Dict from '../../constants/dict';
import { getTextFieldTheme, textFieldInputProps, ThemeTypes } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';

interface IPasswordInputProps {
    errorMessage: string | null;
    name?: IUserKeys.password | IUserKeys.passwordRepetition | null;
    onError: (key: IUserKeys.password | IUserKeys.passwordRepetition, value: string) => void;
    onKeyPressEnter?: () => void;
    onUpdateValue: (key: IUserKeys.password | IUserKeys.passwordRepetition, value: string) => void;
    showErrorMessageOnLoad?: boolean; // default: true
    style?: React.CSSProperties;
    themeType?: ThemeTypes;
    value: string;
}

interface IPasswordInputState {
    showErrorMessage: boolean;
}

export default class PasswordInput extends React.Component<IPasswordInputProps, IPasswordInputState> {

    public static LOCAL_ERROR_MESSAGE = Dict.account_password_invalid;

    constructor(props: IPasswordInputProps) {
        super(props);

        this.state = {
            showErrorMessage: props.showErrorMessageOnLoad === undefined || props.showErrorMessageOnLoad
        }
    }

    public render(): React.ReactNode {
        return (
            <MuiThemeProvider theme={getTextFieldTheme(this.props.themeType)}>
                <TextField
                    error={this.state.showErrorMessage && this.props.errorMessage != null}
                    fullWidth={true}
                    helperText={this.state.showErrorMessage ? this.props.errorMessage : null}
                    inputProps={textFieldInputProps}
                    label={this.props.name && this.props.name === IUserKeys.passwordRepetition ? Dict.account_passwordRepetition : Dict.account_password}
                    margin="dense"
                    name={this.props.name ? this.props.name : IUserKeys.password}
                    onChange={this.onChange}
                    onKeyPress={this.onKeyPress}
                    style={this.props.style}
                    type="password"
                    value={this.props.value}
                    variant="outlined"
                />
            </MuiThemeProvider>
        );
    }

    public componentDidMount(): void {
        this.validate();
    }

    public shouldComponentUpdate(nextProps: IPasswordInputProps, nextState: IPasswordInputState, nextContext: any): boolean {
        return this.props.errorMessage !== nextProps.errorMessage
            || this.props.value !== nextProps.value;
    }

    public componentDidUpdate(prevProps: IPasswordInputProps, prevState: IPasswordInputState): void {
        this.validate();

        if (!this.state.showErrorMessage) {
            this.setState({
                ...prevState,
                showErrorMessage: true
            });
        }
    }

    private onChange = (event: any): void => {
        this.props.onUpdateValue(
            this.props.name ? this.props.name : IUserKeys.password, 
            event.target.value
        );
    }

    private onKeyPress = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (this.props.onKeyPressEnter && event.key === "Enter") {
            this.props.onKeyPressEnter();
        }
    }

    public validate = (): void => {
        const localErrorMessage = this.props.value && this.props.value.length >= 4 ?
            null : PasswordInput.LOCAL_ERROR_MESSAGE;
        
        // do not overwrite combined and server side error messages
        if (this.props.errorMessage && !localErrorMessage
            && this.props.errorMessage !== PasswordInput.LOCAL_ERROR_MESSAGE) {
            return;
        }

        this.props.onError(
            this.props.name ? this.props.name : IUserKeys.password,
            localErrorMessage
        );
    }

}