import * as React from 'react';

import { Button, Icon, withTheme, WithTheme } from '@material-ui/core';

type IDeleteButtonProps = WithTheme & {
    color?: "inherit" | "primary" | "secondary" | "default" | undefined,
    icon?: string,
    label: string,
    onClick: () => void,
    style?: React.CSSProperties,
    variant?: "text" | "outlined" | "contained" | undefined,
}

const DeleteButton = (props: IDeleteButtonProps) => {
    return (
        <Button
            color={props.color ?? "primary"}
            onClick={props.onClick}
            style={props.style}
            variant={props.variant ?? "contained"}
        >
            {props.label}
            <Icon style={{
                marginLeft: props.theme.spacing()
            }}>
                {props.icon ?? "delete_forever"}
            </Icon>
        </Button>
    );
}

export default withTheme(DeleteButton);