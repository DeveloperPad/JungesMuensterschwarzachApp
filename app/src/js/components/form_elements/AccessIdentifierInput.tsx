import * as React from "react";

import { TextField } from "@mui/material";

import { Dict } from "../../constants/dict";
import { textFieldInputProps } from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";

interface IAccessIdentifierInputProps {
    value: string;
}

const AccessIdentifierInput = (props: IAccessIdentifierInputProps) => {
    const { value } = props;
    return (
        <TextField
            disabled={true}
            fullWidth={true}
            inputProps={textFieldInputProps}
            label={Dict.account_accessLevel}
            margin="dense"
            name={IUserKeys.accessIdentifier}
            type="text"
            value={Dict[value] ?? value}
            variant="outlined"
        />
    );
};
export default AccessIdentifierInput;
