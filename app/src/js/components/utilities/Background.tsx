import * as React from 'react';

import { WithTheme, withTheme } from '@material-ui/core';

import BackgroundImage from '../../../assets/images/blurred_bg.png';
import {
    getContentHeight, getContentWidth, getScrollBarWidth
} from '../../constants/global-functions';

type IBackgroundProps = WithTheme & {
    withBottomNavigation?: boolean
}

class Background extends React.PureComponent<IBackgroundProps> {

    public render(): React.ReactNode {
        return (
            <div
                style={this.getBackgroundDivStyle()}>
                <div style={this.getScrollCorrectionDivStyle()}>
                    <div style={this.getPaddingDivStyle()}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

    private getBackgroundDivStyle = (): React.CSSProperties => {
        const contentWidth = getContentWidth();
        const contentHeight = getContentHeight(this.props.withBottomNavigation);

        return {
            backgroundAttachment: "fixed",
            backgroundImage: `url(${BackgroundImage})`,
            backgroundPosition: "center",
            height: contentHeight,
            opacity: 0.95,
            overflow: "hidden",
            width: contentWidth
        };
    }

    private getScrollCorrectionDivStyle = (): React.CSSProperties => {
        const contentHeight = getContentHeight(this.props.withBottomNavigation);
        const scrollBarWidth = getScrollBarWidth();

        return {
            height: contentHeight,
            marginRight: -scrollBarWidth,
            overflowY: "scroll"
        }
    }

    private getPaddingDivStyle = (): React.CSSProperties => {
        const contentHeight = getContentHeight(this.props.withBottomNavigation);

        return {
            display: "flex",
            flexDirection: "column",
            minHeight: contentHeight - 2 * this.props.theme.spacing() /* padding */,
            padding: this.props.theme.spacing()
        }
    }

}

export default withTheme(Background);