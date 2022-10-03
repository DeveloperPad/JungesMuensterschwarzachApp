import * as React from "react";

import { Button, Icon, withTheme, WithTheme } from "@mui/material";

type IDeleteButtonProps = WithTheme & {
    color?: "inherit" | "primary" | "secondary" | "default" | undefined;
    icon?: string;
    label: string;
    onClick: () => void;
    style?: React.CSSProperties;
    variant?: "text" | "outlined" | "contained" | undefined;
};

const DeleteButton = (props: IDeleteButtonProps) => {
    const { color, icon, label, onClick, style, theme, variant } = props;
    return (
        <Button
            color={color ?? "primary"}
            onClick={onClick}
            style={style}
            variant={variant ?? "contained"}
        >
            {label}
            <Icon
                style={{
                    marginLeft: theme.spacing(),
                }}
            >
                {icon ?? "delete_forever"}
            </Icon>
        </Button>
    );
};

export default withTheme(DeleteButton);
