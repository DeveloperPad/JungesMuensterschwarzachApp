import * as React from "react";

import { MenuItem } from "@material-ui/core";

import { Dict } from "../../../constants/dict";
import { AppUrls } from "../../../constants/specific-urls";
import { useNavigate } from "react-router";

type EventsMenuItemProps = {
    divider?: boolean;
};

const EventsMenuItem = (props: EventsMenuItemProps) => {
    const { divider } = props;
    const navigate = useNavigate();

    const forward = (): void => {
        navigate(AppUrls.EVENTS_LIST);
    };

    return (
        <MenuItem button={true} divider={divider ?? false} onClick={forward}>
            <span>{Dict.navigation_events}</span>
        </MenuItem>
    );
};

export default EventsMenuItem;
