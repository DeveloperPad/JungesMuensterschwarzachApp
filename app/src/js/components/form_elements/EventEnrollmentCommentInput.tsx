import * as React from 'react';

import { TextField } from '@material-ui/core';

import Dict from '../../constants/dict';
import Formats from '../../constants/formats';
import { textFieldInputProps } from '../../constants/theme';
import { IEventEnrollmentKeys } from '../../networking/events/IEventEnrollment';
import { IEventItemKeys } from '../../networking/events/IEventItem';

interface IEventEnrollmentCommentInputProps {
    errorMessage: string | null;
    onBlur?: (key: IEventEnrollmentKeys, value: string) => void;
    onError: (key: IEventEnrollmentKeys, value: string) => void;
    onUpdateValue: (key: IEventEnrollmentKeys, value: string) => void;
    style?: React.CSSProperties;
    value: string;
}

interface IEventEnrollmentCommentInputState {
    submit: boolean;
}

export default class EventEnrollmentCommentInput 
    extends React.Component<IEventEnrollmentCommentInputProps, IEventEnrollmentCommentInputState> {

    constructor(props: IEventEnrollmentCommentInputProps) {
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
                inputProps={eventEnrollmentCommentInputProps}
                label={Dict.event_eventEnrollmentComment}
                margin="dense"
                multiline={true}
                name={IEventItemKeys.eventEnrollmentComment}
                onBlur={this.onBlur}
                onChange={this.onChange}
                rows={Formats.ROWS.STANDARD.EVENT_ENROLLMENT_COMMENT}
                style={this.props.style}
                value={this.props.value}
                variant="outlined"
            />
        );
    }

    public componentDidMount() {
        this.validate();
    }

    public shouldComponentUpdate(nextProps: IEventEnrollmentCommentInputProps, 
            nextState: IEventEnrollmentCommentInputState, nextContext: any): boolean {
        return this.props.errorMessage !== nextProps.errorMessage
            || this.props.value !== nextProps.value
            || this.state.submit !== nextState.submit;
    }

    public componentDidUpdate(prevProps: IEventEnrollmentCommentInputProps, prevState: IEventEnrollmentCommentInputState): void {
        this.validate();

        if (this.state.submit) {
            if (this.props.onBlur) {
                this.props.onBlur(
                    IEventEnrollmentKeys.eventEnrollmentComment,
                    this.props.value
                );
            }
            this.setState({
                ...prevState,
                submit: false
            });
        }
    }

    private onChange = (event: any): void => {
        this.props.onUpdateValue(
            IEventEnrollmentKeys.eventEnrollmentComment, 
            event.target.value
        );
    }

    private onBlur = (event: React.FocusEvent<HTMLTextAreaElement>): void => {
        event.preventDefault();
        event.stopPropagation();

        this.validate();
        
        if (this.props.onBlur) {
            this.setState(prevState => {
                return {
                    ...prevState,
                    submit: true
                }
            });
        }
    }

    public validate = (): void => {
        this.props.onError(
            IEventEnrollmentKeys.eventEnrollmentComment,
            this.props.value != null && this.props.value.length <= Formats.LENGTH.MAX.EVENT_ENROLLMENT_COMMENT ?
                null : Dict.event_eventEnrollmentComment_invalid
        );
    }

}

const eventEnrollmentCommentInputProps = {
    ...textFieldInputProps,
    maxLength: Formats.LENGTH.MAX.EVENT_ENROLLMENT_COMMENT
}