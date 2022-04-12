import * as React from "react";

import { Button, Icon, withTheme, WithTheme } from "@material-ui/core";

import { AppUrls } from "../../constants/specific-urls";
import { useNavigate } from "react-router";

type IForwardButtonProps = WithTheme & {
    color?: "inherit" | "primary" | "secondary" | "default" | undefined;
    forwardTo: AppUrls;
    icon?: string;
    label: string;
    style?: React.CSSProperties;
    variant?: "text" | "outlined" | "contained" | undefined;
};

const ForwardButton = (props: IForwardButtonProps) => {
    let navigate = useNavigate();

    return (
        <Button
            color={props.color ?? "secondary"}
            onClick={navigate.bind(this, props.forwardTo)}
            style={props.style}
            variant={props.variant ?? "contained"}
        >
            {props.label}
            <Icon
                style={{
                    marginLeft: props.theme.spacing(),
                }}
            >
                {props.icon ?? "forward"}
            </Icon>
        </Button>
    );
};

export default withTheme(ForwardButton);
