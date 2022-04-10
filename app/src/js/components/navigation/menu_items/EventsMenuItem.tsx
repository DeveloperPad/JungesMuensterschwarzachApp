import * as React from "react";
import { useNavigate } from "react-router";

import { MenuItem } from "@material-ui/core";

import { Dict } from "../../../constants/dict";
import { AppUrls } from "../../../constants/specific-urls";

type EventsMenuItemProps = {
    divider?: boolean;
};

const EventsMenuItem = (props: EventsMenuItemProps) => {
    const navigate = useNavigate();
    const { divider } = props;

    return (
        <MenuItem
            button={true}
            divider={divider ?? false}
            onClick={navigate.bind(this, AppUrls.EVENTS_LIST)}
        >
            <span>{Dict.navigation_events}</span>
        </MenuItem>
    );
};

export default EventsMenuItem;
