import * as React from 'react';

import { MuiThemeProvider, TextField } from '@material-ui/core';

import Dict from '../../constants/dict';
import Formats from '../../constants/formats';
import { getTextFieldTheme, textFieldInputProps, ThemeTypes } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';

interface IDisplayNameInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.displayName, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.displayName, value: string) => void;
    onBlur?: (key: IUserKeys.displayName, value: string) => void;
    showErrorMessageOnLoad?: boolean; // default: true
    style?: React.CSSProperties;
    themeType?: ThemeTypes;
    value: string;
}

interface IDisplayNameInputState {
    showErrorMessage: boolean;
    submit: boolean;
}

export default class DisplayNameInput extends React.Component<IDisplayNameInputProps, IDisplayNameInputState> {

    public static LOCAL_ERROR_MESSAGE: string = Dict.account_displayName_invalid;

    constructor(props: IDisplayNameInputProps) {
        super(props);

        this.state = {
            showErrorMessage: props.showErrorMessageOnLoad === undefined || props.showErrorMessageOnLoad,
            submit: false
        };
    }

    public render(): React.ReactNode {
        return (
            <MuiThemeProvider theme={getTextFieldTheme(this.props.themeType)}>
                <TextField
                    error={this.state.showErrorMessage && this.props.errorMessage != null}
                    fullWidth={true}
                    helperText={this.state.showErrorMessage ? this.props.errorMessage : null}
                    inputProps={displayNameInputProps}
                    label={Dict.account_displayName}
                    margin="dense"
                    name={IUserKeys.displayName}
                    onBlur={this.onBlur}
                    onChange={this.onChange}
                    style={this.props.style}
                    type="text"
                    value={this.props.value}
                    variant="outlined"
                />
            </MuiThemeProvider>
        );
    }

    public componentDidMount() {
        this.validate();
    }

    public shouldComponentUpdate(nextProps: IDisplayNameInputProps, nextState: IDisplayNameInputState, nextContext: any): boolean {
        return this.props.errorMessage !== nextProps.errorMessage
            || this.props.value !== nextProps.value
            || this.state.submit !== nextState.submit;
    }

    public componentDidUpdate(prevProps: IDisplayNameInputProps, prevState: IDisplayNameInputState): void {
        this.validate();

        if (!this.state.showErrorMessage) {
            this.setState({
                ...prevState,
                showErrorMessage: true
            });
        }

        if (this.state.submit) {
            if (this.props.onBlur) {
                this.props.onBlur(
                    IUserKeys.displayName,
                    this.props.value
                );
            }
            
            this.setState({
                    ...prevState,
                    submit: false
                }
            );
        }
    }

    private onChange = (event: any): void => {
        this.props.onError(
            IUserKeys.displayName,
            null
        );
        this.props.onUpdateValue(
            IUserKeys.displayName, 
            event.target.value
        );
    }

    private onBlur = (_: any): void => {
        this.trimValue();
        this.validate();
        this.setState(prevState => {
            return {
                ...prevState,
                submit: true
            }
        });
    }

    private trimValue = ():void => {
        if (this.props.value) {
            this.props.onUpdateValue(
                IUserKeys.displayName,
                this.props.value.trim()
            );
        }
    }

    public validate = (): void => {
        const displayName = this.props.value;
        const localErrorMessage = displayName != null && displayName.length > 0 
            && displayName.length <= Formats.LENGTH.MAX.DISPLAY_NAME ?
            null : DisplayNameInput.LOCAL_ERROR_MESSAGE;

        // do not overwrite server side error messages
        if (this.props.errorMessage && !localErrorMessage
            && this.props.errorMessage !== DisplayNameInput.LOCAL_ERROR_MESSAGE) {
            return;
        }

        this.props.onError(
            IUserKeys.displayName,
            localErrorMessage
        );
    }

}

const displayNameInputProps = {
    ...textFieldInputProps,
    maxLength: Formats.LENGTH.MAX.DISPLAY_NAME
}