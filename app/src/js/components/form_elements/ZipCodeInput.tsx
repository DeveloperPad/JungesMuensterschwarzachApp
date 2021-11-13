import * as React from 'react';

import { TextField } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import Formats from '../../constants/formats';
import { grid1Style, textFieldInputProps } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';

interface IZipCodeInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.zipCode, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.zipCode, value: string) => void;
    onBlur: (key: IUserKeys.zipCode, value: string | null) => void;
    style?: React.CSSProperties;
    value: string;
}

interface IZipCodeInputState {
    submit: boolean;
}

export default class ZipCodeInput extends React.Component<IZipCodeInputProps, IZipCodeInputState> {

    public static LOCAL_ERROR_MESSAGE = Dict.account_zipCode_invalid;

    constructor(props: IZipCodeInputProps) {
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
                inputProps={zipCodeInputProps}
                label={Dict.account_zipCode}
                margin="dense"
                name={IUserKeys.zipCode}
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

    public shouldComponentUpdate(nextProps: IZipCodeInputProps, nextState: any, nextContext: any): boolean {
        return this.props.errorMessage !== nextProps.errorMessage
            || this.props.value !== nextProps.value
            || this.state.submit !== nextState.submit;
    }

    public componentDidUpdate(prevProps: IZipCodeInputProps, prevState: IZipCodeInputState): void {
        this.validate();

        if (this.state.submit) {
            if (this.props.onBlur) {
                this.props.onBlur(
                    IUserKeys.zipCode,
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
            IUserKeys.zipCode,
            null
        );
        this.props.onUpdateValue(
            IUserKeys.zipCode, 
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
                IUserKeys.zipCode,
                this.props.value.trim()
            );
        }
    }

    public validate = (): void => {
        const zipCode = this.props.value;
        const localErrorMessage = !zipCode 
            || (zipCode.length > 0 && zipCode.length <= Formats.LENGTH.MAX.ZIP_CODE) ?
            null : ZipCodeInput.LOCAL_ERROR_MESSAGE;
        
        // do not overwrite server side error messages
        if (this.props.errorMessage && !localErrorMessage
            && this.props.errorMessage !== ZipCodeInput.LOCAL_ERROR_MESSAGE) {
            return;
        }

        this.props.onError(
            IUserKeys.zipCode,
            localErrorMessage
        );
    }

}

const zipCodeInputProps = {
    ...textFieldInputProps,
    maxLength: Formats.LENGTH.MAX.ZIP_CODE
}