import * as React from 'react';

import { TextField } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import Formats from '../../constants/formats';
import { grid1Style, textFieldInputProps } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';

interface ILastNameInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys, value: string | null) => void;
    onUpdateValue: (key: IUserKeys, value: string) => void;
    onBlur: (key: IUserKeys, value: string | null) => void;
    value: string;
}

interface ILastNameInputState {
    submit: boolean;
}

export default class LastNameInput extends React.Component<ILastNameInputProps, ILastNameInputState> {

    public static LOCAL_ERROR_MESSAGE = Dict.account_lastName_invalid;

    constructor(props: ILastNameInputProps) {
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
                inputProps={lastNameInputProps}
                label={Dict.account_lastName}
                margin="dense"
                name={IUserKeys.lastName}
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

    public shouldComponentUpdate(nextProps: ILastNameInputProps, nextState: any, nextContext: any): boolean {
        return this.props.errorMessage !== nextProps.errorMessage
            || this.props.value !== nextProps.value
            || this.state.submit !== nextState.submit;
    }

    public componentDidUpdate(prevProps: ILastNameInputProps, prevState: ILastNameInputState): void {
        this.validate();

        if (this.state.submit) {
            if (this.props.onBlur) {
                this.props.onBlur(
                    IUserKeys.lastName,
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
            IUserKeys.lastName,
            null
        );
        this.props.onUpdateValue(
            IUserKeys.lastName,
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
                IUserKeys.lastName,
                this.props.value.trim()
            );
        }
    }

    public validate = (): void => {
        const lastName = this.props.value;
        const localErrorMessage = !lastName 
            || (lastName.length > 0 && lastName.length <= Formats.LENGTH.MAX.LAST_NAME) ?
            null : LastNameInput.LOCAL_ERROR_MESSAGE;
        
        // do not overwrite server side error messages
        if (this.props.errorMessage && !localErrorMessage
            && this.props.errorMessage !== LastNameInput.LOCAL_ERROR_MESSAGE) {
            return;
        }

        this.props.onError(
            IUserKeys.lastName,
            localErrorMessage
        );
    }

}

const lastNameInputProps = {
    ...textFieldInputProps,
    maxLength: Formats.LENGTH.MAX.LAST_NAME
}