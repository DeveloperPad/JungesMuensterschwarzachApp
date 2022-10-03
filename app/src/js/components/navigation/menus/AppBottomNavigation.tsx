import * as React from "react";

import { BottomNavigation, WithTheme, withTheme } from "@mui/material";

type IAppBottomNavigationProps = WithTheme & {
    activeTabId: number;
    changeTab: (event: React.ChangeEvent<{}>, value: any) => void;
    children: React.ReactElement<any>[];
};

const AppBottomNavigation = (props: IAppBottomNavigationProps) => {
    const { activeTabId, changeTab, children, theme } = props;
    const childrenWithProps = React.useMemo(() => React.Children.map(children, (child) =>
        React.cloneElement(child as React.ReactElement<any>, {
            style: {
                color: theme.palette.primary.contrastText,
            },
        })
    ), [children, theme.palette.primary.contrastText]);

    return (
        <BottomNavigation
            id="jma-bottom-nav"
            onChange={changeTab}
            showLabels={false}
            style={{
                backgroundColor: theme.palette.primary.main,
            }}
            value={activeTabId}
        >
            {childrenWithProps}
        </BottomNavigation>
    );
};

export default withTheme(AppBottomNavigation);
