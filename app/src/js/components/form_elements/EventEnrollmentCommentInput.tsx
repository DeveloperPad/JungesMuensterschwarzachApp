import * as React from "react";

import { TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { textFieldInputProps } from "../../constants/theme";
import { IEventEnrollmentKeys } from "../../networking/events/IEventEnrollment";
import { IEventItemKeys } from "../../networking/events/IEventItem";
import { useState } from "react";
import { useEffect } from "react";

interface IEventEnrollmentCommentInputProps {
    errorMessage: string | null;
    onBlur?: (key: IEventEnrollmentKeys, value: string) => void;
    onError: (key: IEventEnrollmentKeys, value: string) => void;
    onUpdateValue: (key: IEventEnrollmentKeys, value: string) => void;
    style?: React.CSSProperties;
    value: string;
}

const EventEnrollmentCommentInput = (
    props: IEventEnrollmentCommentInputProps
) => {
    const { errorMessage, onBlur, onError, onUpdateValue, style, value } =
        props;
    const [submit, setSubmit] = useState(false);

    const onChange = (event: any): void => {
        onUpdateValue(
            IEventEnrollmentKeys.eventEnrollmentComment,
            event.target.value
        );
    };
    const onLocalBlur = (
        event: React.FocusEvent<HTMLTextAreaElement>
    ): void => {
        event.preventDefault();
        event.stopPropagation();

        if (onBlur) {
            setSubmit(true);
        }
    };

    useEffect(() => {
        onError(
            IEventEnrollmentKeys.eventEnrollmentComment,
            value != null &&
                value.length <= Formats.LENGTH.MAX.EVENT_ENROLLMENT_COMMENT
                ? null
                : Dict.event_eventEnrollmentComment_invalid
        );

        if (!submit) {
            return;
        }

        if (onBlur) {
            onBlur(IEventEnrollmentKeys.eventEnrollmentComment, value);
        }

        setSubmit(false);
    }, [onBlur, onError, submit, value]);

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
