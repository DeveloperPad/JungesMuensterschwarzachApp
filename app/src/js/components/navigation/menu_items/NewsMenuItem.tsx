import * as React from "react";
import { useNavigate } from "react-router";

import { MenuItem } from "@material-ui/core";

import { Dict } from "../../../constants/dict";
import { AppUrls } from "../../../constants/specific-urls";

type NewsMenuItemProps = {
    divider?: boolean;
};

const NewsMenuItem = (props: NewsMenuItemProps) => {
    const navigate = useNavigate();
    const { divider } = props;

    return (
        <MenuItem
            button={true}
            divider={divider || false}
            onClick={navigate.bind(this, AppUrls.NEWS_LIST)}
        >
            <span>{Dict.navigation_app_news}</span>
        </MenuItem>
    );
};

export default NewsMenuItem;
