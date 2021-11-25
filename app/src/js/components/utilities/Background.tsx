import * as React from "react";

import { WithTheme, withTheme } from "@material-ui/core";

import BackgroundImage from "../../../assets/images/blurred_bg.png";
import {
    getContentHeight,
    getContentWidth,
    getScrollBarWidth,
} from "../../constants/global-functions";

type IBackgroundProps = WithTheme & {
    children: React.ReactElement<any>[];
    withBottomNavigation?: boolean;
};

const Background = (props: IBackgroundProps) => {
    const { children, theme, withBottomNavigation } = props;

    return (
        <div
            style={{
                backgroundAttachment: "fixed",
                backgroundImage: `url(${BackgroundImage})`,
                backgroundPosition: "center",
                height: getContentHeight(withBottomNavigation),
                opacity: 0.95,
                overflow: "hidden",
                width: getContentWidth(),
            }}
        >
            <div
                style={{
                    height: getContentHeight(withBottomNavigation),
                    marginRight: -getScrollBarWidth(),
                    overflowY: "scroll",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        minHeight:
                            getContentHeight(withBottomNavigation) -
                            2 * theme.spacing() /* padding */,
                        padding: theme.spacing(),
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default withTheme(Background);
