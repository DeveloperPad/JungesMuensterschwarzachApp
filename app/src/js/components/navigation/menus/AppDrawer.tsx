import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { PaperProps, SwipeableDrawer } from '@material-ui/core';

import BackgroundImage from '../../../../assets/images/blurred_bg.png';
import BlackLogoMenuItem from '../../navigation/menu_items/BlackLogoMenuItem';
import EventsMenuItem from '../../navigation/menu_items/EventsMenuItem';
import NewsMenuItem from '../../navigation/menu_items/NewsMenuItem';

type AppDrawerProps = RouteComponentProps<any, StaticContext> & {
    open: boolean,
    toggleAppDrawerVisibility: () => void
}

class AppDrawer extends React.Component<AppDrawerProps> {

    public render(): React.ReactNode {
        return (
            <SwipeableDrawer
                onBackdropClick={this.props.toggleAppDrawerVisibility}
                onClick={this.props.toggleAppDrawerVisibility}
                onClose={this.props.toggleAppDrawerVisibility}
                onOpen={this.onOpen}
                open={this.props.open}
                PaperProps={paperProps}
                variant="temporary">
                <BlackLogoMenuItem />
                <NewsMenuItem divider={true} />
                <EventsMenuItem />
            </SwipeableDrawer>
        )
    }

    private onOpen = (): void => { ; }

}

export default withRouter(AppDrawer);

const paperProps: Partial<PaperProps> = {
    style: {
        backgroundImage: `url(${BackgroundImage})`,
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden"
    }
};