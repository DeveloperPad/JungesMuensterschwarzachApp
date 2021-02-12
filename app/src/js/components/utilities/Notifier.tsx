import * as React from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import Dict from '../../constants/dict';

let showNotificationFn: (message: string) => void;

export function showNotification(message: string) {
    if (showNotificationFn) {
        showNotificationFn(message);
    } else {
        setTimeout(
            () => {
                showNotification(message);
            },
            5000
        );
    }
}

interface INotifierState {
    message: string;
    open: boolean;
}

export default class Notifier extends React.Component<any, INotifierState> {

    private messageQueue: string[] = [];

    constructor(props: any) {
        super(props);

        this.state = {
            message: "",
            open: false
        }
    }

    public componentDidMount(): void {
        showNotificationFn = this.queueMessage;
    }

    public render(): React.ReactNode {
        const message = (
            <span
                style={messageStyle}>
                {this.state.message}
            </span>
        );

        return (
            <Snackbar
                anchorOrigin={snackBarAnchorOrigin}
                autoHideDuration={4000}
                onClick={this.closeSnackbar}
                onClose={this.closeSnackbar}
                open={this.state.open}
                style={snackBarStyle}>

                <SnackbarContent
                    message={message} />

            </Snackbar>
        );
    }

    private onOpenSnackbar = (): void => {
        this.setState({
            message: this.messageQueue[0],
            open: true
        });
        this.messageQueue.shift();
    }

    private closeSnackbar = (): void => {
        this.setState({
            message: "",
            open: false
        });

        if (this.messageQueue.length > 0) {
            setTimeout(
                this.onOpenSnackbar,
                1000
            );
        }
    }

    private queueMessage = (message: string): void => {
        this.messageQueue.push(Dict.hasOwnProperty(message) ? Dict[message] : message);

        if (this.state.open === false) {
            this.onOpenSnackbar();
        }
    }

}

const messageStyle: React.CSSProperties = {
    float: "left"
};

const snackBarAnchorOrigin: any = {
    horizontal: "center",
    vertical: "bottom"
};

const snackBarStyle: React.CSSProperties = {
    marginBottom: "5em"
};