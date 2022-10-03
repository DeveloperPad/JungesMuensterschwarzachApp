import * as React from 'react';

import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

import { Dict } from '../../constants/dict';

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

const Notifier = (props: any) => {
    const [message, setMessage] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const messageQueue = React.useRef<string[]>([]);

    const queueMessage = React.useCallback((message: string): void => {
        messageQueue.current.push(Dict[message] ?? message);

        if (open === false) {
            onOpenSnackbar();
        }
    }, [open]);
    const onOpenSnackbar = (): void => {
        setMessage(messageQueue.current[0]);
        setOpen(true);
        messageQueue.current.shift();
    };
    const closeSnackbar = (): void => {
        setMessage("");
        setOpen(false);

        if (messageQueue.current.length > 0) {
            setTimeout(
                onOpenSnackbar,
                1000
            );
        }
    };

    React.useEffect(() => {
        showNotificationFn = queueMessage;
    }, [queueMessage]);

    return (
        <Snackbar
            anchorOrigin={{
                horizontal: "center",
                vertical: "bottom"
            }}
            autoHideDuration={4000}
            onClick={closeSnackbar}
            onClose={closeSnackbar}
            open={open}
            style={{
                marginBottom: "5em"
            }}>

            <SnackbarContent
                message={
                    <span
                        style={{
                            float: "left"
                        }}>
                        {message}
                    </span>
                } />

        </Snackbar>
    );
};

export default Notifier;
