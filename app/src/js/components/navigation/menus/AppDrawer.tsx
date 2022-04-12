import * as React from "react";

import { SwipeableDrawer } from "@material-ui/core";

import BackgroundImage from "../../../../assets/images/blurred_bg.png";
import BlackLogoMenuItem from "../../navigation/menu_items/BlackLogoMenuItem";
import EventsMenuItem from "../../navigation/menu_items/EventsMenuItem";
import NewsMenuItem from "../../navigation/menu_items/NewsMenuItem";

type AppDrawerProps = {
    open: boolean;
    toggleAppDrawerVisibility: () => void;
};

const AppDrawer = (props: AppDrawerProps) => {
    const { open, toggleAppDrawerVisibility } = props;
    return (
        <SwipeableDrawer
            onClick={toggleAppDrawerVisibility}
            onClose={toggleAppDrawerVisibility}
            onOpen={() => {}}
            open={open}
            PaperProps={{
                style: {
                    backgroundImage: `url(${BackgroundImage})`,
                    backgroundPosition: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    overflow: "hidden",
                },
            }}
            variant="temporary"
        >
            <BlackLogoMenuItem />
            <NewsMenuItem divider={true} />
            <EventsMenuItem />
        </SwipeableDrawer>
    );
};

export default AppDrawer;
