import * as React from "react";

import { Typography } from "@mui/material";

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
