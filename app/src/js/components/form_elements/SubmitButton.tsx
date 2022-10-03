import * as React from "react";

import { Button, Icon, withTheme, WithTheme } from "@mui/material";

import { Dict } from "../../constants/dict";

type ISubmitButtonProps = WithTheme & {
    color?: "inherit" | "primary" | "secondary" | "default" | undefined;
    disabled?: boolean;
    icon?: string;
    label?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
    variant?: "text" | "outlined" | "contained" | undefined;
};

const SubmitButton = (props: ISubmitButtonProps) => {
    const { color, disabled, icon, label, onClick, style, theme, variant } =
        props;
    return (
        <Button
            color={color ?? "primary"}
            disabled={disabled}
            onClick={onClick}
            style={style}
            variant={variant ?? "contained"}
        >
            {label ?? Dict.label_submit}
            <Icon
                style={{
                    marginLeft: theme.spacing(),
                }}
            >
                {icon ?? "send"}
            </Icon>
        </Button>
    );
};

export default withTheme(SubmitButton);
