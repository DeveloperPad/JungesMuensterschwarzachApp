import * as React from 'react';

import { MuiThemeProvider, TextField } from '@material-ui/core';

import Dict from '../../constants/dict';
import Formats from '../../constants/formats';
import { getTextFieldTheme, textFieldInputProps, ThemeTypes } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';

interface IEMailAddressInputProps {
    disabled?: boolean;
    errorMessage: string | null;
    onError: (key: IUserKeys.eMailAddress, value: string) => void;
    onUpdateValue: (key: IUserKeys.eMailAddress, value: string) => void;
    onBlur?: (key: IUserKeys.eMailAddress, value: string) => void;
    showErrorMessageOnLoad?: boolean; // default: true
    style?: React.CSSProperties;
    themeType?: ThemeTypes;
    value: string;
}

interface IEMailAddressInputState {
    showErrorMessage: boolean;
    submit: boolean;
}

export default class EMailAddressInput extends React.Component<IEMailAddressInputProps, IEMailAddressInputState> {

    public static LOCAL_ERROR_MESSAGE = Dict.account_eMailAddress_invalid;

    constructor(props: IEMailAddressInputProps) {
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
                    disabled={this.props.disabled}
                    error={this.state.showErrorMessage && this.props.errorMessage != null}
                    fullWidth={true}
                    helperText={this.state.showErrorMessage ? this.props.errorMessage : null}
                    inputProps={textFieldInputProps}
                    label={Dict.account_eMailAddress}
                    margin="dense"
                    name={IUserKeys.eMailAddress}
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

    public shouldComponentUpdate(nextProps: IEMailAddressInputProps, nextState: IEMailAddressInputState, nextContext: any): boolean {
        return this.props.errorMessage !== nextProps.errorMessage
            || this.props.value !== nextProps.value
            || this.state.submit !== nextState.submit;
    }

    public componentDidUpdate(prevProps: IEMailAddressInputProps, prevState: IEMailAddressInputState): void {
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
                    IUserKeys.eMailAddress,
                    this.props.value
                );
            }
            this.setState({
                ...prevState,
                submit: false
            });
        }
    }

    private onChange = (event: any): void => {
        this.props.onUpdateValue(
            IUserKeys.eMailAddress, 
            event.target.value
        );
    }

    private onBlur = (_: any): void => {
        this.validate();
        
        this.setState(prevState => {
            return {
                ...prevState,
                submit: true
            }
        });
    }

    public validate = (): void => {
        const localErrorMessage = Formats.REGEXPS.E_MAIL_ADDRESS.test(this.props.value) ? 
            null : EMailAddressInput.LOCAL_ERROR_MESSAGE;

        // do not overwrite server side error messages
        if (this.props.errorMessage && !localErrorMessage
            && this.props.errorMessage !== EMailAddressInput.LOCAL_ERROR_MESSAGE) {
            return;
        }
        
        this.props.onError(
            IUserKeys.eMailAddress,
            localErrorMessage
        );
    }

}