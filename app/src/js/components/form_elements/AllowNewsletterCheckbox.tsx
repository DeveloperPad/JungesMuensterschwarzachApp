import * as React from "react";

import { Checkbox, Switch, Typography } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import { CustomTheme, grid1Style, ThemeTypes } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import ErrorMessageTypography from "./ErrorMessageTypography";
import { useState } from "react";
import { useEffect } from "react";

interface IAllowNewsletterCheckboxProps {
    checked: boolean;
    errorMessage: string | null;
    onBlur?: (key: IUserKeys.allowNewsletter, value: number) => void;
    onUpdateValue: (key: IUserKeys.allowNewsletter, value: number) => void;
    showErrorMessageOnLoad?: boolean; // default: true
    style?: React.CSSProperties;
    themeType?: ThemeTypes;
}

const AllowNewsLetterCheckbox = (props: IAllowNewsletterCheckboxProps) => {
    const {
        checked,
        errorMessage,
        onBlur,
        onUpdateValue,
        showErrorMessageOnLoad,
        style,
        themeType,
    } = props;
    const [submit, setSubmit] = useState(false);

    const contentDivStyle: React.CSSProperties = {
        ...style,
        alignItems: "center",
        display: "flex",
    };
    const lightTypographyStyle: React.CSSProperties = {
        color: CustomTheme.COLOR_WHITE,
    };

    const showErrorMessage = (): boolean => {
        return showErrorMessageOnLoad === undefined || showErrorMessageOnLoad;
    };
    const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        onUpdateValue(
            IUserKeys.allowNewsletter,
            (event.currentTarget as HTMLInputElement).checked ? 1 : 0
        );
        setSubmit(true);
    };

    useEffect(() => {
        if (!submit) {
            return;
        }

        if (onBlur) {
            onBlur(IUserKeys.allowNewsletter, checked ? 1 : 0);
        }

        setSubmit(false);
    }, [checked, onBlur, submit]);

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
                value={showErrorMessage() ? errorMessage : null}
            />
        </>
    ) : (
        <>
            <div style={contentDivStyle}>
                <Typography variant="caption">
                    {Dict.account_allowNewsletter}
                </Typography>
                <div
                    style={{
                        flex: 1,
                    }}
                />
                <Switch
                    checked={checked}
                    color="primary"
                    name={IUserKeys.allowNewsletter}
                    onChange={onChange}
                />
            </div>
            <ErrorMessageTypography
                value={showErrorMessage() ? errorMessage : null}
            />
        </>
    );
};

export default AllowNewsLetterCheckbox;
