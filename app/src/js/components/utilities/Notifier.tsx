import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import { Dict } from '../../constants/dict';
import { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';

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
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);
    const messageQueue = useRef<string[]>([]);

    const queueMessage = useCallback((message: string): void => {
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

    useEffect(() => {
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
