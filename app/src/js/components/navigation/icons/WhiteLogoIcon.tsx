import * as React from "react";

import WhiteLogo from "../../../../assets/images/logo_white.png";
import { AppUrls } from "../../../constants/specific-urls";
import { logoItemStyle } from "../../../constants/theme";
import { useNavigate } from "react-router";

type WhiteLogoIconProps = {
    divider?: boolean;
};

const WhiteLogoIcon = (props: WhiteLogoIconProps) => {
    const navigate = useNavigate();

    return (
        <img alt="" onClick={navigate.bind(this, AppUrls.HOME)} src={WhiteLogo} style={logoItemStyle} />
    );
};

export default WhiteLogoIcon;
