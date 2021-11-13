import * as React from 'react';

import { TextField } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import Formats from '../../constants/formats';
import { grid1Style, textFieldInputProps } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';

interface ICountryInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.country, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.country, value: string) => void;
    onBlur: (key: IUserKeys.country, value: string | null) => void;
    value: string;
}

interface ICountryInputState {
    submit: boolean;
}

export default class CountryInput extends React.Component<ICountryInputProps, ICountryInputState> {

    public static LOCAL_ERROR_MESSAGE = Dict.account_country_invalid;

    constructor(props: ICountryInputProps) {
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
                inputProps={countryInputProps}
                label={Dict.account_country}
                margin="dense"
                name={IUserKeys.country}
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

    public shouldComponentUpdate(nextProps: ICountryInputProps, nextState: any, nextContext: any): boolean {
        return this.props.errorMessage !== nextProps.errorMessage
            || this.props.value !== nextProps.value
            || this.state.submit !== nextState.submit;
    }

    public componentDidUpdate(prevProps: ICountryInputProps, prevState: ICountryInputState): void {
        this.validate();

        if (this.state.submit) {
            if (this.props.onBlur) {
                this.props.onBlur(
                    IUserKeys.country,
                    this.props.value.trim()
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
            IUserKeys.country,
            null
        );
        this.props.onUpdateValue(
            IUserKeys.country,
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
                IUserKeys.country,
                this.props.value.trim()
            );
        }
    }

    private validate = (): void => {
        const country = this.props.value;
        const localErrorMessage = !country 
            || (country.length > 0 && country.length <= Formats.LENGTH.MAX.COUNTRY) ?
            null : CountryInput.LOCAL_ERROR_MESSAGE;
        
        // do not overwrite server side error messages
        if (this.props.errorMessage && !localErrorMessage
            && this.props.errorMessage !== CountryInput.LOCAL_ERROR_MESSAGE) {
            return;
        }

        this.props.onError(
            IUserKeys.country,
            localErrorMessage
        );
    }

}

const countryInputProps = {
    ...textFieldInputProps,
    maxLength: Formats.LENGTH.MAX.COUNTRY
}