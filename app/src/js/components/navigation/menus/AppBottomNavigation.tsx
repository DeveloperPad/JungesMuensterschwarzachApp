import * as React from "react";

import { BottomNavigation, WithTheme, withTheme } from "@material-ui/core";

type IAppBottomNavigationProps = WithTheme & {
    activeTab: number;
    changeTab: (event: React.ChangeEvent<{}>, value: any) => void;
    children: React.ReactElement<any>[];
};

const AppBottomNavigation = (props: IAppBottomNavigationProps) => {
    const { activeTab, changeTab, children, theme } = props;
    const childrenWithProps = React.Children.map(children, (child) =>
        React.cloneElement(child as React.ReactElement<any>, {
            style: {
                color: theme.palette.primary.contrastText,
            },
        })
    );

    return (
        <BottomNavigation
            id="jma-bottom-nav"
            onChange={changeTab}
            style={{
                backgroundColor: theme.palette.primary.main,
            }}
            value={activeTab}
        >
            {childrenWithProps}
        </BottomNavigation>
    );
};

export default withTheme(AppBottomNavigation);
