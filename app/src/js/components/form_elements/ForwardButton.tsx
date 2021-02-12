import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Button, Icon, withTheme, WithTheme } from '@material-ui/core';

import { AppUrls } from '../../constants/specific-urls';

type IForwardButtonProps = RouteComponentProps<any, StaticContext> & WithTheme & {
    color?: "inherit" | "primary" | "secondary" | "default" | undefined,
    forwardTo: AppUrls,
    icon?: string,
    label: string,
    style?: React.CSSProperties,
    variant?: "text" | "outlined" | "contained" | undefined,
}

class ForwardButton extends React.PureComponent<IForwardButtonProps> {

    private forwardIconStyle: React.CSSProperties = {
        marginLeft: this.props.theme.spacing()
    }

    public render(): React.ReactNode {
        return (
            <Button
                color={this.props.color ? this.props.color : "secondary"}
                onClick={this.forward}
                style={this.props.style}
                variant={this.props.variant ? this.props.variant : "contained"}
            >
                {this.props.label}
                <Icon style={this.forwardIconStyle}>
                    {this.props.icon ? this.props.icon : "forward"}
                </Icon>
            </Button>
        );
    }

    private forward = (): void => {
        this.props.history.push(
            this.props.forwardTo
        );
    }

}

export default withTheme(withRouter(ForwardButton));