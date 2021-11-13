import * as React from 'react';

import { TextField } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import Formats from '../../constants/formats';
import { grid1Style, textFieldInputProps } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';

interface ICityInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.city, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.city, value: string) => void;
    onBlur: (key: IUserKeys.city, value: string | null) => void;
    value: string;
}

interface ICityInputState {
    submit: boolean;
}

export default class CityInput extends React.Component<ICityInputProps, ICityInputState> {

    public static LOCAL_ERROR_MESSAGE = Dict.account_city_invalid;

    constructor(props: ICityInputProps) {
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
                inputProps={cityInputProps}
                label={Dict.account_city}
                margin="dense"
                name={IUserKeys.city}
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

    public shouldComponentUpdate(nextProps: ICityInputProps, nextState: any, nextContext: any): boolean {
        return this.props.errorMessage !== nextProps.errorMessage
            || this.props.value !== nextProps.value
            || this.state.submit !== nextState.submit;
    }

    public componentDidUpdate(prevProps: ICityInputProps, prevState: ICityInputState): void {
        this.validate();

        if (this.state.submit) {
            if (this.props.onBlur) {
                this.props.onBlur(
                    IUserKeys.city,
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
            IUserKeys.city,
            null
        );
        this.props.onUpdateValue(
            IUserKeys.city,
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
                IUserKeys.city,
                this.props.value.trim()
            );
        }
    }

    public validate = (): void => {
        const city = this.props.value;
        const localErrorMessage = !city
            || (city.length > 0 && city.length <= Formats.LENGTH.MAX.CITY) ?
            null : CityInput.LOCAL_ERROR_MESSAGE;
        
        // do not overwrite server side error messages
        if (this.props.errorMessage && !localErrorMessage
            && this.props.errorMessage !== CityInput.LOCAL_ERROR_MESSAGE) {
            return;
        }

        this.props.onError(
            IUserKeys.city,
            localErrorMessage
        );
    }

}

const cityInputProps = {
    ...textFieldInputProps,
    maxLength: Formats.LENGTH.MAX.CITY
}