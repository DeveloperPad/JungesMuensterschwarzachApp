import * as React from "react";
import { useNavigate } from "react-router";

import { MenuItem, Tooltip } from "@material-ui/core";

import BlackLogo from "../../../../assets/images/logo_black.png";
import { Dict } from "../../../constants/dict";
import { AppUrls } from "../../../constants/specific-urls";

type BlackLogoMenuItemProps = {
    divider?: boolean;
};

const BlackLogoMenuItem = (props: BlackLogoMenuItemProps) => {
    const navigate = useNavigate();
    const { divider } = props;

    return (
        <Tooltip title={Dict.navigation_home} placement="right">
            <MenuItem
                button={true}
                className="jma-no-background-color"
                divider={divider ?? false}
                onClick={navigate.bind(this, AppUrls.HOME)}
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
