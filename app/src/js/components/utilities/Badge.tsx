import 'react-responsive-carousel/lib/styles/carousel.min.css';

import * as React from 'react';

import { Chip, withTheme, WithTheme } from '@material-ui/core';

import { IUserKeys, IUserValues } from '../../networking/account_data/IUser';
import { getAccessLevelBadgeStyle } from '../../constants/theme';

type IBadgeProps = WithTheme & {
    accessLevel: number;
    small?: boolean;
}

class Badge extends React.Component<IBadgeProps> {

    private style: React.CSSProperties;

    constructor(props: IBadgeProps) {
        super(props);

        this.style = getAccessLevelBadgeStyle(this.props.accessLevel);
        if (this.props.small) {
            this.style = {
                fontSize: "85%",
                display: "inline",
                ...this.style
            };
        }
    }

    public render(): React.ReactNode {
        return (
            <Chip
                label={IUserValues[IUserKeys.accessIdentifier][this.props.accessLevel]}
                size="small"
                style={this.style}
            />
        );
    }

}

export default withTheme(Badge);