import * as React from 'react';

import { TextField } from '@material-ui/core';

import Dict from '../../constants/dict';
import Formats from '../../constants/formats';
import { grid1Style, textFieldInputProps } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';

interface ISupplementaryAddressInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.supplementaryAddress, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.supplementaryAddress, value: string) => void;
    onBlur: (key: IUserKeys.supplementaryAddress, value: string | null) => void;
    value: string;
}

interface ISupplementaryAddressInputState {
    submit: boolean;
}

export default class SupplementaryAddressInput
    extends React.Component<ISupplementaryAddressInputProps, ISupplementaryAddressInputState> {

    public static LOCAL_ERROR_MESSAGE = Dict.account_supplementaryAddress_invalid;

    constructor(props: ISupplementaryAddressInputProps) {
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
                inputProps={supplementaryAddressInputProps}
                label={Dict.account_supplementaryAddress}
                margin="dense"
                name={IUserKeys.supplementaryAddress}
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

    public shouldComponentUpdate(nextProps: ISupplementaryAddressInputProps, 
            nextState: any, nextContext: any): boolean {
        return this.props.errorMessage !== nextProps.errorMessage
            || this.props.value !== nextProps.value
            || this.state.submit !== nextState.submit;
    }

    public componentDidUpdate(prevProps: ISupplementaryAddressInputProps, 
            prevState: ISupplementaryAddressInputState): void {
        this.validate();

        if (this.state.submit) {
            if (this.props.onBlur) {
                this.props.onBlur(
                    IUserKeys.supplementaryAddress,
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
            IUserKeys.supplementaryAddress,
            null
        );
        this.props.onUpdateValue(
            IUserKeys.supplementaryAddress,
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
                IUserKeys.supplementaryAddress,
                this.props.value.trim()
            );
        }
    }

    public validate = (): void => {
        const supplementaryAddress = this.props.value;
        const localErrorMessage = !supplementaryAddress 
            || (supplementaryAddress.length > 0 && 
                supplementaryAddress.length <= Formats.LENGTH.MAX.SUPPLEMENTARY_ADDRESS) ?
            null : SupplementaryAddressInput.LOCAL_ERROR_MESSAGE;
        
        // do not overwrite server side error messages
        if (this.props.errorMessage && !localErrorMessage
            && this.props.errorMessage !== SupplementaryAddressInput.LOCAL_ERROR_MESSAGE) {
            return;
        }
        
        this.props.onError(
            IUserKeys.supplementaryAddress,
            localErrorMessage
        );
    }

}

const supplementaryAddressInputProps = {
    ...textFieldInputProps,
    maxLength: Formats.LENGTH.MAX.SUPPLEMENTARY_ADDRESS
}