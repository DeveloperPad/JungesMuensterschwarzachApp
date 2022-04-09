import * as React from 'react';

import { Switch, Typography } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import { IUserKeys } from '../../networking/account_data/IUser';
import ErrorMessageTypography from './ErrorMessageTypography';

interface IAllowPostCheckboxProps {
    checked: boolean;
    errorMessage: string | null;
    onBlur: (key: IUserKeys.allowPost, value: number) => void;
    onUpdateValue: (key: IUserKeys.allowPost, value: number) => void;
}

const AllowPostCheckbox = (props: IAllowPostCheckboxProps) => {
    const { checked, errorMessage, onBlur, onUpdateValue } = props;

    const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        onUpdateValue(
            IUserKeys.allowPost,
            (event.currentTarget as HTMLInputElement).checked ? 1 : 0
        );
        if (onBlur) {
            onBlur(IUserKeys.allowPost, checked ? 1 : 0);
        }
    };

    return (
        <>
            <div
                style={{
                    alignItems: "center",
                    display: "flex",
                }}
            >
                <Typography variant="caption">
                    {Dict.account_allowPost}
                </Typography>
                <div
                    style={{
                        flex: 1,
                    }}
                />
                <Switch
                    checked={checked}
                    color="primary"
                    name={IUserKeys.allowPost}
                    onChange={onChange}
                />
            </div>
            <ErrorMessageTypography value={errorMessage} />
        </>
    );
};

export default AllowPostCheckbox;
