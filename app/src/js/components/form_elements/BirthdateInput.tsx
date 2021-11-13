import moment from 'moment';
import * as React from 'react';

import { DatePicker } from '@material-ui/pickers';

import { Dict } from '../../constants/dict';
import Formats from '../../constants/formats';
import { formatDate } from '../../constants/global-functions';
import { grid1Style, textFieldInputProps } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';

interface IBirthdateInputProps {
    errorMessage: string | null;
    onError: (key: IUserKeys.birthdate, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.birthdate, value: Date | null) => void;
    onBlur: (key: IUserKeys.birthdate, value: string | null) => void;
    value: Date | null;
}

interface IBirthdateInputState {
    submit: boolean;
}

export default class BirthdateInput extends React.Component<IBirthdateInputProps, IBirthdateInputState> {

    public static LOCAL_ERROR_MESSAGE = Dict.account_birthdate_invalid;

    constructor(props: IBirthdateInputProps) {
        super(props);

        this.state = {
            submit: false
        };
    }

    public render(): React.ReactNode {
        return (
            <DatePicker
                cancelLabel={Dict.label_cancel}
                clearable={true}
                clearLabel={Dict.label_delete}
                disableFuture={true}
                error={this.props.errorMessage != null}
                format={Formats.DATE.DATE_PICKER}
                helperText={this.props.errorMessage}
                inputProps={textFieldInputProps}
                inputVariant="outlined"
                label={Dict.account_birthdate}
                margin="dense"
                name={IUserKeys.birthdate}
                okLabel={Dict.label_confirm}
                onChange={this.onChange}
                onBlur={this.onBlur}
                placeholder={Dict.account_birthdate_placeholder}
                style={grid1Style}
                value={this.props.value}
            />
        );
    }

    public componentDidMount() {
        this.validate();
    }

    public shouldComponentUpdate(nextProps: IBirthdateInputProps, nextState: IBirthdateInputState, nextContext: any): boolean {
        return this.props.errorMessage !== nextProps.errorMessage
            || this.props.value !== nextProps.value
            || this.state.submit !== nextState.submit;
    }

    public componentDidUpdate(prevProps: IBirthdateInputProps, prevState: IBirthdateInputState): void {
        this.validate();

        if (this.state.submit) {
            if (this.props.onBlur) {
                this.props.onBlur(
                    IUserKeys.birthdate,
                    this.props.value ? formatDate(this.props.value, Formats.DATE.DATE_DATABASE) : null
                );
            }
            this.setState({
                ...prevState,
                submit: false
            });
        }
    }

    private onChange = (date: any): void => {
        this.props.onError(
            IUserKeys.birthdate,
            null
        );
        this.props.onUpdateValue(
            IUserKeys.birthdate,
            date
        );
    }

    private onBlur = (_: any): void => {
        this.validate();
        this.setState(prevState => {
            return {
                ...prevState,
                submit: true
            }
        });
    }

    private validate = (): void => {
        const birthdate = this.props.value;
        const localErrorMessage = birthdate === null 
            || moment().isAfter(moment(birthdate)) ?
            null : BirthdateInput.LOCAL_ERROR_MESSAGE;

        // do not overwrite server side error messages
        if (this.props.errorMessage && !localErrorMessage
            && this.props.errorMessage !== BirthdateInput.LOCAL_ERROR_MESSAGE) {
            return;
        }
        
        this.props.onError(
            IUserKeys.birthdate,
            localErrorMessage
        );
    }

}