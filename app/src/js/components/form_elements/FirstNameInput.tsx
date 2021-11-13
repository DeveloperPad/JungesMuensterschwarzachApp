import * as React from 'react';

import { TextField } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import Formats from '../../constants/formats';
import { grid1Style, textFieldInputProps } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';

interface IFirstNameInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.firstName, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.firstName, value: string) => void;
    onBlur: (key: IUserKeys.firstName, value: string | null) => void;
    value: string;
}

interface IFirstNameInputState {
    submit: boolean;
}

export default class FirstNameInput extends React.Component<IFirstNameInputProps, IFirstNameInputState> {

    public static LOCAL_ERROR_MESSAGE = Dict.account_firstName_invalid;

    constructor(props: IFirstNameInputProps) {
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
                inputProps={firstNameInputProps}
                label={Dict.account_firstName}
                margin="dense"
                name={IUserKeys.firstName}
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

    public shouldComponentUpdate(nextProps: IFirstNameInputProps, nextState: any, nextContext: any): boolean {
        return this.props.errorMessage !== nextProps.errorMessage
            || this.props.value !== nextProps.value
            || this.state.submit !== nextState.submit;
    }

    public componentDidUpdate(prevProps: IFirstNameInputProps, prevState: IFirstNameInputState): void {
        this.validate();

        if (this.state.submit) {
            if (this.props.onBlur) {
                this.props.onBlur(
                    IUserKeys.firstName,
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
            IUserKeys.firstName,
            null
        );
        this.props.onUpdateValue(
            IUserKeys.firstName, 
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
                IUserKeys.firstName,
                this.props.value.trim()
            );
        }
    }

    private validate = (): void => {
        const firstName = this.props.value;
        const localErrorMessage = !firstName 
            || (firstName.length > 0 && firstName.length <= Formats.LENGTH.MAX.FIRST_NAME) ?
            null : FirstNameInput.LOCAL_ERROR_MESSAGE;
        
        // do not overwrite server side error messages
        if (this.props.errorMessage && !localErrorMessage
            && this.props.errorMessage !== FirstNameInput.LOCAL_ERROR_MESSAGE) {
            return;
        }

        this.props.onError(
            IUserKeys.firstName,
            localErrorMessage
        );
    }

}

const firstNameInputProps = {
    ...textFieldInputProps,
    maxLength: Formats.LENGTH.MAX.FIRST_NAME
}