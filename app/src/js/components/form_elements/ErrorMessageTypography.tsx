import * as React from 'react';

import { Typography } from '@material-ui/core';

interface IErrorMessageTypographyProps {
    value: string | null;
}

export default class ErrorMessageTypography extends React.PureComponent<IErrorMessageTypographyProps> {

    public render(): React.ReactNode {
        if (this.props.value !== null) {
            return (
                <Typography
                    align="center"
                    color="error"
                >
                    {this.props.value}
                </Typography>
            );
        } else {
            return null;
        }
    }

}