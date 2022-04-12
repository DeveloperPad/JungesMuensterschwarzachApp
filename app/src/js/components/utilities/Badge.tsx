import "react-responsive-carousel/lib/styles/carousel.min.css";

import * as React from "react";

import { Chip } from "@material-ui/core";

import { IUserKeys, IUserValues } from "../../networking/account_data/IUser";
import { getAccessLevelBadgeStyle } from "../../constants/theme";

type IBadgeProps = {
    accessLevel: number;
    small?: boolean;
};

const Badge = (props: IBadgeProps) => {
    const { accessLevel, small } = props;

    let style = getAccessLevelBadgeStyle(accessLevel);
    if (small) {
        style = {
            fontSize: "85%",
            display: "inline",
            ...style,
        };
    }

    return (
        <Chip
            label={IUserValues[IUserKeys.accessIdentifier][accessLevel]}
            size="small"
            style={style}
        />
    );
};

export default Badge;
