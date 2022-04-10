import * as React from "react";

import { Typography } from "@material-ui/core";

interface IErrorMessageTypographyProps {
    value: string | null;
}

const ErrorMessageTypography = (props: IErrorMessageTypographyProps) => {
    const { value } = props;

    if (!value) {
        return null;
    }

    return (
        <Typography align="center" color="error">
            {value}
        </Typography>
    );
};

export default ErrorMessageTypography;
