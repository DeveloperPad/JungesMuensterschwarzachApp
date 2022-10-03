import * as React from "react";

import { Switch, Typography } from "@mui/material";

import { Dict } from "../../constants/dict";
import { IUserKeys } from "../../networking/account_data/IUser";
import ErrorMessageTypography from "./ErrorMessageTypography";

interface IAllowPostCheckboxProps {
    checked: boolean;
    errorMessage: string | null;
    onBlur: (key: IUserKeys.allowPost, value: number) => void;
    onUpdateValue: (key: IUserKeys.allowPost, value: number) => void;
}

const AllowPostCheckbox = (props: IAllowPostCheckboxProps) => {
    const { checked, errorMessage, onBlur, onUpdateValue } = props;
    const [isBlurScheduled, setIsBlurScheduled] = React.useState<boolean>(false);

    const onChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>): void => {
            onUpdateValue(
                IUserKeys.allowPost,
                (event.currentTarget as HTMLInputElement).checked ? 1 : 0
            );
            setIsBlurScheduled(true);
        },
        [onUpdateValue]
    );

    React.useEffect(() => {
        if (isBlurScheduled) {
            onBlur(IUserKeys.allowPost, checked ? 1 : 0);
            setIsBlurScheduled(false);
        }
    }, [checked, isBlurScheduled, onBlur]);

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
