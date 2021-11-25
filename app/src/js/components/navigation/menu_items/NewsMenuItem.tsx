import * as React from "react";
import { useNavigate } from "react-router";

import { MenuItem } from "@material-ui/core";

import { Dict } from "../../../constants/dict";
import { AppUrls } from "../../../constants/specific-urls";

type NewsMenuItemProps = {
    divider?: boolean;
};

const NewsMenuItem = (props: NewsMenuItemProps) => {
    const { divider } = props;
    const navigate = useNavigate();

    const forward = (): void => {
        navigate(AppUrls.NEWS_LIST);
    };

    return (
        <MenuItem button={true} divider={divider || false} onClick={forward}>
            <span>{Dict.navigation_app_news}</span>
        </MenuItem>
    );
};

export default NewsMenuItem;
