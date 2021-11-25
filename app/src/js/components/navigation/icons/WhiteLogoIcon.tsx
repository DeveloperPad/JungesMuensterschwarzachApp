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

    const forward = (): void => {
        navigate(AppUrls.HOME);
    };

    return (
        <img alt="" onClick={forward} src={WhiteLogo} style={logoItemStyle} />
    );
};

export default WhiteLogoIcon;
