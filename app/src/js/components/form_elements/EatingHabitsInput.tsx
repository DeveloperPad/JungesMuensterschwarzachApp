import * as React from "react";

import { TextField } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { grid1Style, textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";

interface IEatingHabitsInputProps {
    errorMessage: string | null;
    onBlur: (key: IUserKeys.eatingHabits, value: string | null) => void;
    onError: (key: IUserKeys.eatingHabits, value: string | null) => void;
    onUpdateValue: (key: IUserKeys.eatingHabits, value: string) => void;
    value: string;
}

const EatingHabitsInput = (props: IEatingHabitsInputProps) => {
    const LOCAL_ERROR_MESSAGE = Dict.account_eatingHabits_invalid;

    const { errorMessage, onBlur, onError, onUpdateValue, value } = props;

    const onChange = React.useCallback(
        (event: any): void => {
            onUpdateValue(IUserKeys.eatingHabits, event.target.value);
        },
        [onUpdateValue]
    );
    const onLocalBlur = React.useCallback(
        (_: any): void => {
            if (value) {
                onUpdateValue(IUserKeys.eatingHabits, value.trim());
            }

            onBlur(IUserKeys.eatingHabits, value);
        },
        [onBlur, onUpdateValue, value]
    );

    React.useEffect(() => {
        const localErrorMessage =
            !value || value.length <= Formats.LENGTH.MAX.EATING_HABITS
                ? null
                : LOCAL_ERROR_MESSAGE;

        // do not overwrite server side error messages
        if (
            errorMessage !== localErrorMessage &&
            (!errorMessage || errorMessage === LOCAL_ERROR_MESSAGE)
        ) {
            onError(IUserKeys.eatingHabits, localErrorMessage);
        }
    }, [LOCAL_ERROR_MESSAGE, errorMessage, onError, value]);

    return (
        <TextField
            error={errorMessage !== null}
            helperText={errorMessage}
            inputProps={{
                ...textFieldInputProps,
                maxLength: Formats.LENGTH.MAX.EATING_HABITS,
            }}
            label={Dict.account_eatingHabits}
            margin="dense"
            minRows={Formats.ROWS.STANDARD.EATING_HABITS}
            multiline={true}
            name={IUserKeys.eatingHabits}
            onBlur={onLocalBlur}
            onChange={onChange}
            style={grid1Style}
            value={value}
            variant="outlined"
        />
    );
};

export default EatingHabitsInput;
