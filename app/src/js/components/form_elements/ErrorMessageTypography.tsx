import * as React from "react";

import { Typography } from "@material-ui/core";

interface IErrorMessageTypographyProps {
    value: string | null;
}

const ErrorMessageTypography = (props: IErrorMessageTypographyProps) => {
    const { value } = props;

    return value !== null ? (
        <Typography align="center" color="error">
            {value}
        </Typography>
    ) : null;
};

export default ErrorMessageTypography;
