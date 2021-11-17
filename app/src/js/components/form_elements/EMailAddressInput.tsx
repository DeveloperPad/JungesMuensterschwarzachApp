import * as React from 'react';

import { MuiThemeProvider, TextField } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import Formats from '../../constants/formats';
import { getTextFieldTheme, textFieldInputProps, ThemeTypes } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';
import { useState } from 'react';
import { useEffect } from 'react';

interface IEMailAddressInputProps {
    disabled?: boolean;
    errorMessage: string | null;
    onBlur?: (key: IUserKeys.eMailAddress, value: string) => void;
    onError: (key: IUserKeys.eMailAddress, value: string) => void;
    onUpdateValue: (key: IUserKeys.eMailAddress, value: string) => void;
    showErrorMessageOnLoad?: boolean; // default: true
    style?: React.CSSProperties;
    themeType?: ThemeTypes;
    value: string;
}

const EMailAddressInput = (props: IEMailAddressInputProps) => {
    const LOCAL_ERROR_MESSAGE = Dict.account_eMailAddress_invalid;

    const {disabled, errorMessage, onBlur, onError, onUpdateValue, showErrorMessageOnLoad, style, themeType, value} = props;
    const [submit, setSubmit] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(showErrorMessageOnLoad === undefined || showErrorMessageOnLoad);

    const onChange = (event: any): void => {
        onUpdateValue(
            IUserKeys.eMailAddress, 
            event.target.value
        );
    };
    const onLocalBlur = (_: any): void => {
        setSubmit(true);
    };

    useEffect(() => {
        const localErrorMessage = Formats.REGEXPS.E_MAIL_ADDRESS.test(value) ? 
            null : LOCAL_ERROR_MESSAGE;

        // do not overwrite server side error messages
        if (errorMessage && !localErrorMessage
            && errorMessage !== LOCAL_ERROR_MESSAGE) {
            return;
        }
        
        onError(
            IUserKeys.eMailAddress,
            localErrorMessage
        );
        
        if (!showErrorMessage) {
            setShowErrorMessage(true);
        }

        if (!submit) {
            return;
        }

        if (onBlur) {
            onBlur(
                IUserKeys.eMailAddress,
                value
            );
        }

        setSubmit(true);
    }, [errorMessage, LOCAL_ERROR_MESSAGE, onBlur, onError, showErrorMessage, submit, value]);

    return <MuiThemeProvider theme={getTextFieldTheme(themeType)}>
        <TextField
            disabled={disabled}
            error={showErrorMessage && errorMessage != null}
            fullWidth={true}
            helperText={showErrorMessage ? errorMessage : null}
            inputProps={textFieldInputProps}
            label={Dict.account_eMailAddress}
            margin="dense"
            name={IUserKeys.eMailAddress}
            onBlur={onLocalBlur}
            onChange={onChange}
            style={style}
            type="text"
            value={value}
            variant="outlined"
        />
    </MuiThemeProvider>;
};

export default EMailAddressInput;
