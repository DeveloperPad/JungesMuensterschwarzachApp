import * as React from 'react';

import { TextField } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import { textFieldInputProps } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';

interface IAccessIdentifierInputProps {
    value: string;
}

export default class AccessIdentifierInput extends React.Component<IAccessIdentifierInputProps> {

    public render(): React.ReactNode {
        return (
            <TextField
                disabled={true}
                fullWidth={true}
                inputProps={textFieldInputProps}
                label={Dict.account_accessLevel}
                margin="dense"
                name={IUserKeys.accessIdentifier}
                type="text"
                value={Dict.hasOwnProperty(this.props.value) ? Dict[this.props.value] : this.props.value}
                variant="outlined"
            />
        );
    }

    public shouldComponentUpdate(nextProps: IAccessIdentifierInputProps, nextState: any, nextContext: any): boolean {
        return this.props.value !== nextProps.value;
    }

}