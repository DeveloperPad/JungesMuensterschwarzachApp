import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { Button, Icon, withTheme, WithTheme } from '@material-ui/core';

type IDeleteButtonProps = RouteComponentProps<any, StaticContext> & WithTheme & {
    color?: "inherit" | "primary" | "secondary" | "default" | undefined,
    icon?: string,
    label: string,
    onClick: () => void,
    style?: React.CSSProperties,
    variant?: "text" | "outlined" | "contained" | undefined,
}

class DeleteButton extends React.PureComponent<IDeleteButtonProps> {

    private deleteIconStyle: React.CSSProperties = {
        marginLeft: this.props.theme.spacing()
    }

    public render(): React.ReactNode {
        return (
            <Button
                color={this.props.color ? this.props.color : "primary"}
                onClick={this.props.onClick}
                style={this.props.style}
                variant={this.props.variant ? this.props.variant : "contained"}
            >
                {this.props.label}
                <Icon style={this.deleteIconStyle}>
                    {this.props.icon ? this.props.icon : "delete_forever"}
                </Icon>
            </Button>
        );
    }

}

export default withTheme(withRouter(DeleteButton));