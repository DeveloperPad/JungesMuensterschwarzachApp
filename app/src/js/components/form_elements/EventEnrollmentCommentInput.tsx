import * as React from "react";

import { TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { textFieldInputProps } from "../../constants/theme";
import { IEventEnrollmentKeys } from "../../networking/events/IEventEnrollment";
import { IEventItemKeys } from "../../networking/events/IEventItem";

interface IEventEnrollmentCommentInputProps {
    errorMessage: string | null;
    onBlur: (key: IEventEnrollmentKeys, value: string) => void;
    onError: (key: IEventEnrollmentKeys, value: string) => void;
    onUpdateValue: (key: IEventEnrollmentKeys, value: string) => void;
    style?: React.CSSProperties;
    value: string;
}

const EventEnrollmentCommentInput = (
    props: IEventEnrollmentCommentInputProps
) => {
    const LOCAL_ERROR_MESSAGE = Dict.event_eventEnrollmentComment_invalid;

    const { errorMessage, onBlur, onError, onUpdateValue, style, value } =
        props;

    const onChange = React.useCallback(
        (event: any): void => {
            onUpdateValue(
                IEventEnrollmentKeys.eventEnrollmentComment,
                event.target.value
            );
        },
        [onUpdateValue]
    );
    const onLocalBlur = React.useCallback(
        (event: React.FocusEvent<HTMLTextAreaElement>): void => {
            // event.preventDefault();
            // event.stopPropagation();

            onBlur(IEventEnrollmentKeys.eventEnrollmentComment, value);
        },
        [onBlur, value]
    );

    React.useEffect(() => {
        const localErrorMessage =
            value != null &&
            value.length <= Formats.LENGTH.MAX.EVENT_ENROLLMENT_COMMENT
                ? null
                : LOCAL_ERROR_MESSAGE;

        // do not overwrite server side error messages
        if (
            errorMessage !== localErrorMessage &&
            (!errorMessage || errorMessage === LOCAL_ERROR_MESSAGE)
        ) {
            onError(
                IEventEnrollmentKeys.eventEnrollmentComment,
                localErrorMessage
            );
        }
    }, [LOCAL_ERROR_MESSAGE, errorMessage, onError, value]);

    return (
        <TextField
            error={errorMessage !== null}
            helperText={errorMessage}
            inputProps={{
                ...textFieldInputProps,
                maxLength: Formats.LENGTH.MAX.EVENT_ENROLLMENT_COMMENT,
            }}
            label={Dict.event_eventEnrollmentComment}
            margin="dense"
            multiline={true}
            name={IEventItemKeys.eventEnrollmentComment}
            onBlur={onLocalBlur}
            onChange={onChange}
            rows={Formats.ROWS.STANDARD.EVENT_ENROLLMENT_COMMENT}
            style={style}
            value={value}
            variant="outlined"
        />
    );
};

export default EventEnrollmentCommentInput;
