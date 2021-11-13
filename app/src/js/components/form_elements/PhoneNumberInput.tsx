import * as React from 'react';

import { TextField } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import Formats from '../../constants/formats';
import { grid1Style, textFieldInputProps } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';

interface IPhoneNumberInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.phoneNumber, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.phoneNumber, value: string) => void;
    onBlur: (key: IUserKeys.phoneNumber, value: string | null) => void;
    value: string;
}

interface IPhoneNumberInputState {
    submit: boolean;
}

export default class PhoneNumberInput extends React.Component<IPhoneNumberInputProps, IPhoneNumberInputState> {

    public static LOCAL_ERROR_MESSAGE = Dict.account_phoneNumber_invalid;

    constructor(props: IPhoneNumberInputProps) {
        super(props);

        this.state = {
            submit: false
        };
    }

    public render(): React.ReactNode {
        return (
            <TextField
                error={this.props.errorMessage != null}
                helperText={this.props.errorMessage}
                inputProps={phoneNumberInputProps}
                label={Dict.account_phoneNumber}
                margin="dense"
                name={IUserKeys.phoneNumber}
                onBlur={this.onBlur}
                onChange={this.onChange}
                style={grid1Style}
                type="text"
                value={this.props.value}
                variant="outlined"
            />
        );
    }

    public componentDidMount() {
        this.validate();
    }

    public shouldComponentUpdate(nextProps: IPhoneNumberInputProps, nextState: any, nextContext: any): boolean {
        return this.props.errorMessage !== nextProps.errorMessage
            || this.props.value !== nextProps.value
            || this.state.submit !== nextState.submit;
    }

    public componentDidUpdate(prevProps: IPhoneNumberInputProps, prevState: IPhoneNumberInputState): void {
        this.validate();

        if (this.state.submit) {
            if (this.props.onBlur) {
                this.props.onBlur(
                    IUserKeys.phoneNumber,
                    this.props.value || null
                );
            }
            this.setState({
                ...prevState,
                submit: false
            });
        }
    }

    private onChange = (event: any): void => {
        this.props.onError(
            IUserKeys.phoneNumber,
            null
        );
        this.props.onUpdateValue(
            IUserKeys.phoneNumber,
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

    private trimValue = (): void => {
        if (this.props.value) {
            this.props.onUpdateValue(
                IUserKeys.phoneNumber,
                this.props.value.trim()
            );
        }
    }

    public validate = (): void => {
        const phoneNumber = this.props.value;
        const localErrorMessage = !phoneNumber 
            || (phoneNumber.length > 0 && phoneNumber.length <= Formats.LENGTH.MAX.PHONE_NUMBER) ?
            null : PhoneNumberInput.LOCAL_ERROR_MESSAGE;
        
        // do not overwrite server side error messages
        if (this.props.errorMessage && !localErrorMessage
            && this.props.errorMessage !== PhoneNumberInput.LOCAL_ERROR_MESSAGE) {
            return;
        }
        
        this.props.onError(
            IUserKeys.phoneNumber,
            localErrorMessage
        );
    }

}

const phoneNumberInputProps = {
    ...textFieldInputProps,
    maxLength: Formats.LENGTH.MAX.PHONE_NUMBER
}