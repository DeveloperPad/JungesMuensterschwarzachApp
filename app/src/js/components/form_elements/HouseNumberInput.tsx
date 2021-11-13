import * as React from 'react';

import { TextField } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import Formats from '../../constants/formats';
import { grid1Style, textFieldInputProps } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';

interface IHouseNumberInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.houseNumber, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.houseNumber, value: string) => void;
    onBlur: (key: IUserKeys.houseNumber, value: string | null) => void;
    value: string;
}

interface IHouseNumberInputState {
    submit: boolean;
}

export default class HouseNumberInput extends React.Component<IHouseNumberInputProps, IHouseNumberInputState> {

    public static LOCAL_ERROR_MESSAGE = Dict.account_houseNumber_invalid;

    constructor(props: IHouseNumberInputProps) {
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
                inputProps={houseNumberInputProps}
                label={Dict.account_houseNumber}
                margin="dense"
                name={IUserKeys.houseNumber}
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

    public shouldComponentUpdate(nextProps: IHouseNumberInputProps, nextState: any, nextContext: any): boolean {
        return this.props.errorMessage !== nextProps.errorMessage
            || this.props.value !== nextProps.value
            || this.state.submit !== nextState.submit;
    }

    public componentDidUpdate(prevProps: IHouseNumberInputProps, prevState: IHouseNumberInputState): void {
        this.validate();

        if (this.state.submit) {
            if (this.props.onBlur) {
                this.props.onBlur(
                    IUserKeys.houseNumber,
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
            IUserKeys.houseNumber,
            null
        );
        this.props.onUpdateValue(
            IUserKeys.houseNumber,
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
                IUserKeys.houseNumber,
                this.props.value.trim()
            );
        }
    }

    public validate = (): void => {
        const houseNumber = this.props.value;
        const localErrorMessage = !houseNumber 
            || (houseNumber.length > 0 && houseNumber.length <= Formats.LENGTH.MAX.HOUSE_NUMBER) ?
            null : HouseNumberInput.LOCAL_ERROR_MESSAGE;
        
        // do not overwrite server side error messages
        if (this.props.errorMessage && !localErrorMessage
            && this.props.errorMessage !== HouseNumberInput.LOCAL_ERROR_MESSAGE) {
            return;
        }

        this.props.onError(
            IUserKeys.houseNumber,
            localErrorMessage
        );
    }

}

const houseNumberInputProps = {
    ...textFieldInputProps,
    maxLength: Formats.LENGTH.MAX.HOUSE_NUMBER
}