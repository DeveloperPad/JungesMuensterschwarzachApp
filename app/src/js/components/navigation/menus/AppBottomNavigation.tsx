import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { BottomNavigation, WithTheme, withTheme } from '@material-ui/core';

type IAppBottomNavigationProps = RouteComponentProps<any, StaticContext> & WithTheme & {
    activeTab: number;
    changeTab: (event: React.ChangeEvent, value: any) => void;
}

class AppBottomNavigation extends React.PureComponent<IAppBottomNavigationProps> {

    private bottomNavigationActionStyles: React.CSSProperties = {
        color: this.props.theme.palette.primary.contrastText
    };
    private bottomNavigationStyle: React.CSSProperties = {
        backgroundColor: this.props.theme.palette.primary.main
    };

    public render(): React.ReactNode {
        const childrenWithProps = React.Children.map(this.props.children, child =>
            React.cloneElement(child as React.ReactElement<any>, { style: this.bottomNavigationActionStyles }));

        return (
            <BottomNavigation
                id="jma-bottom-nav"
                onChange={this.props.changeTab}
                style={this.bottomNavigationStyle}
                value={this.props.activeTab}>
                {childrenWithProps}
            </BottomNavigation>
        );
    }

}

export default withTheme(withRouter(AppBottomNavigation));