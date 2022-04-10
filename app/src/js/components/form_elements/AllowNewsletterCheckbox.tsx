import * as React from "react";

import { Checkbox, Switch, Typography } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import { CustomTheme, grid1Style, ThemeTypes } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import ErrorMessageTypography from "./ErrorMessageTypography";

interface IAllowNewsletterCheckboxProps {
    checked: boolean;
    errorMessage: string | null;
    onBlur?: (key: IUserKeys.allowNewsletter, value: number) => void;
    onUpdateValue: (key: IUserKeys.allowNewsletter, value: number) => void;
    suppressErrorMsg?: boolean;
    style?: React.CSSProperties;
    themeType?: ThemeTypes;
}

const AllowNewsLetterCheckbox = (props: IAllowNewsletterCheckboxProps) => {
    const {
        checked,
        errorMessage,
        onBlur,
        onUpdateValue,
        suppressErrorMsg,
        style,
        themeType,
    } = props;

    const contentDivStyle: React.CSSProperties = React.useMemo(
        () => ({
            ...style,
            alignItems: "center",
            display: "flex",
        }),
        [style]
    );
    const lightTypographyStyle: React.CSSProperties = React.useMemo(
        () => ({
            color: CustomTheme.COLOR_WHITE,
        }),
        []
    );
    const switchFlexStyle: React.CSSProperties = React.useMemo(
        () => ({
            flex: 1,
        }),
        []
    );

    const onChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>): void => {
            const newChecked = (event.currentTarget as HTMLInputElement).checked;
            console.log("newchecked: " + newChecked);
            onUpdateValue(
                IUserKeys.allowNewsletter,
                newChecked ? 1 : 0
            );
            if (onBlur) {
                onBlur(
                    IUserKeys.allowNewsletter,
                    newChecked ? 1 : 0
                );            
            }
        },
        [onBlur, onUpdateValue]
    );

    return themeType && themeType === ThemeTypes.LIGHT ? (
        <>
            <div style={contentDivStyle}>
                <Checkbox
                    checked={checked}
                    color="primary"
                    name={IUserKeys.allowNewsletter}
                    onChange={onChange}
                    style={lightTypographyStyle}
                />
                <div style={grid1Style} />
                <Typography style={lightTypographyStyle}>
                    {Dict.account_allowNewsletter_registration}
                </Typography>
            </div>
            <ErrorMessageTypography
                value={suppressErrorMsg ? null : errorMessage}
            />
        </>
    ) : (
        <>
            <div style={contentDivStyle}>
                <Typography variant="caption">
                    {Dict.account_allowNewsletter}
                </Typography>
                <div style={switchFlexStyle} />
                <Switch
                    checked={checked}
                    color="primary"
                    name={IUserKeys.allowNewsletter}
                    onChange={onChange}
                />
            </div>
            <ErrorMessageTypography
                value={suppressErrorMsg ? null : errorMessage}
            />
        </>
    );
};

export default AllowNewsLetterCheckbox;
