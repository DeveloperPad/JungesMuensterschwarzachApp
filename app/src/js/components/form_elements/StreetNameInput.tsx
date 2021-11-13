import * as React from 'react';

import { TextField } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import Formats from '../../constants/formats';
import {
    grid1Style, textFieldInputProps
} from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';

interface IStreetNameInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.streetName, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.streetName, value: string) => void;
    onBlur: (key: IUserKeys.streetName, value: string | null) => void;
    style?: React.CSSProperties;
    value: string;
}

interface IStreetNameInputState {
    submit: boolean;
}

export default class StreetNameInput extends React.Component<IStreetNameInputProps, IStreetNameInputState> {

    public static LOCAL_ERROR_MESSAGE = Dict.account_streetName_invalid;

    constructor(props: IStreetNameInputProps) {
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
                inputProps={streetNameInputProps}
                label={Dict.account_streetName}
                margin="dense"
                name={IUserKeys.streetName}
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

    public shouldComponentUpdate(nextProps: IStreetNameInputProps, nextState: any, nextContext: any): boolean {
        return this.props.errorMessage !== nextProps.errorMessage
            || this.props.value !== nextProps.value
            || this.state.submit !== nextState.submit;
    }

    public componentDidUpdate(prevProps: IStreetNameInputProps, prevState: IStreetNameInputState): void {
        this.validate();

        if (this.state.submit) {
            if (this.props.onBlur) {
                this.props.onBlur(
                    IUserKeys.streetName,
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
            IUserKeys.streetName,
            null
        );
        this.props.onUpdateValue(
            IUserKeys.streetName,
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
                IUserKeys.streetName,
                this.props.value.trim()
            );
        }
    }

    private validate = (): void => {
        const streetName = this.props.value;
        const localErrorMessage = !streetName 
            || (streetName.length > 0 && streetName.length <= Formats.LENGTH.MAX.STREET_NAME) ?
            null : StreetNameInput.LOCAL_ERROR_MESSAGE;

        // do not overwrite server side error messages
        if (this.props.errorMessage && !localErrorMessage
            && this.props.errorMessage !== StreetNameInput.LOCAL_ERROR_MESSAGE) {
            return;
        }
        
        this.props.onError(
            IUserKeys.streetName,
            localErrorMessage
        );
    }

}

const streetNameInputProps = {
    ...textFieldInputProps,
    maxLength: Formats.LENGTH.MAX.STREET_NAME
}