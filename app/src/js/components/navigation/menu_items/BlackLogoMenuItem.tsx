import * as React from "react";

import { MenuItem, Tooltip } from "@material-ui/core";

import BlackLogo from "../../../../assets/images/logo_black.png";
import { Dict } from "../../../constants/dict";
import { AppUrls } from "../../../constants/specific-urls";
import { useNavigate } from "react-router";

type BlackLogoMenuItemProps = {
    divider?: boolean;
};

const BlackLogoMenuItem = (props: BlackLogoMenuItemProps) => {
    const { divider } = props;
    const navigate = useNavigate();

    const forward = (): void => {
        navigate(AppUrls.HOME);
    };

    return (
        <Tooltip title={Dict.navigation_home} placement="right">
            <MenuItem
                button={true}
                className="jma-no-background-color"
                divider={divider ?? false}
                onClick={forward}
                style={{
                    backgroundImage: `url(${BlackLogo})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    height: "0",
                    marginBottom: "2em",
                    paddingTop: "55%" /* trial&error */,
                    width: "100%",
                }}
            />
        </Tooltip>
    );
};

export default BlackLogoMenuItem;
