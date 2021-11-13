import * as React from 'react';

import { Button, Icon, withTheme, WithTheme } from '@material-ui/core';

import { Dict } from '../../constants/dict';

type ISubmitButtonProps = WithTheme & {
    color?: "inherit" | "primary" | "secondary" | "default" | undefined,
    disabled?: boolean,
    icon?: string,
    label?: string,
    onClick?: () => void,
    style?: React.CSSProperties,
    variant?: "text" | "outlined" | "contained" | undefined
}

class SubmitButton extends React.PureComponent<ISubmitButtonProps> {

    private submitIconStyle: React.CSSProperties = {
        marginLeft: this.props.theme.spacing()
    }

    public render(): React.ReactNode {
        return (
            <Button
                color={this.props.color ? this.props.color : "primary"}
                disabled={this.props.disabled}
                onClick={this.props.onClick}
                style={this.props.style}
                variant={this.props.variant ? this.props.variant : "contained"}
            >
                {this.props.label ? this.props.label : Dict.label_submit}
                <Icon style={this.submitIconStyle}>
                    {this.props.icon ? this.props.icon : "send"}
                </Icon>
            </Button>
        );
    }

}

export default withTheme(SubmitButton);