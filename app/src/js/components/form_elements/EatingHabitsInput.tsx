import * as React from 'react';

import { TextField } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import Formats from '../../constants/formats';
import { grid1Style, textFieldInputProps } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';

interface IEatingHabitsInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.eatingHabits, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.eatingHabits, value: string) => void;
    onBlur: (key: IUserKeys.eatingHabits, value: string | null) => void;
    value: string;
}

interface IEatingHabitsInputState {
    submit: boolean;
}

export default class EatingHabitsInput extends React.Component<IEatingHabitsInputProps, IEatingHabitsInputState> {

    public static LOCAL_ERROR_MESSAGE = Dict.account_eatingHabits_invalid;

    constructor(props: IEatingHabitsInputProps) {
        super(props);

        this.state = {
            submit: false
        };
    }

    public render(): React.ReactNode {
        return (
            <TextField
                error={this.props.errorMessage !== null}
                helperText={this.props.errorMessage}
                inputProps={eatingHabitsInputProps}
                label={Dict.account_eatingHabits}
                margin="dense"
                multiline={true}
                name={IUserKeys.eatingHabits}
                onBlur={this.onBlur}
                onChange={this.onChange}
                rows={Formats.ROWS.STANDARD.EATING_HABITS}
                style={grid1Style}
                value={this.props.value}
                variant="outlined"
            />
        );
    }

    public componentDidMount() {
        this.validate();
    }

    public shouldComponentUpdate(nextProps: IEatingHabitsInputProps, nextState: IEatingHabitsInputState, nextContext: any): boolean {
        return this.props.errorMessage !== nextProps.errorMessage
            || this.props.value !== nextProps.value
            || this.state.submit !== nextState.submit;
    }

    public componentDidUpdate(prevProps: IEatingHabitsInputProps, prevState: IEatingHabitsInputState): void {
        this.validate();

        if (this.state.submit) {
            if (this.props.onBlur) {
                this.props.onBlur(
                    IUserKeys.eatingHabits,
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
            IUserKeys.eatingHabits,
            null
        );
        this.props.onUpdateValue(
            IUserKeys.eatingHabits,
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
                IUserKeys.eatingHabits,
                this.props.value.trim()
            );
        }
    }

    private validate = (): void => {
        const eatingHabits = this.props.value;
        const localErrorMessage = !eatingHabits 
            || eatingHabits.length <= Formats.LENGTH.MAX.EATING_HABITS ?
            null : EatingHabitsInput.LOCAL_ERROR_MESSAGE;
        
        // do not overwrite server side error messages
        if (this.props.errorMessage && !localErrorMessage
            && this.props.errorMessage !== EatingHabitsInput.LOCAL_ERROR_MESSAGE) {
            return;
        }

        this.props.onError(
            IUserKeys.eatingHabits,
            localErrorMessage
        );
    }

}

const eatingHabitsInputProps = {
    ...textFieldInputProps,
    maxLength: Formats.LENGTH.MAX.EATING_HABITS
}