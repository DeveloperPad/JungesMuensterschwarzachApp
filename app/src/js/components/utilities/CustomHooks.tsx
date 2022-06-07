import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Request from "../../networking/Request";

export function useForceUpdate() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setValue] = useState(0);
    return () => setValue((value) => value + 1);
}

export function usePrevious<T>(value: T) {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export function useRequestQueue(): [
    (request: Request, onFinish?: () => void) => void,
    boolean
] {
    // array containing scheduled requests with their onFinish callbacks
    const [queue, setQueue] = useState<[Request, () => void][]>([]);
    // reference to currently running request
    const [currentRequest, setCurrentRequest] = useState<Request | null>(null);

    // method to schedule new requests with their onFinish callbacks
    const enqueue = useCallback((request: Request, onFinish: () => void) => {
        setQueue((queue) => {
            return queue.concat([
                [
                    request,
                    () => {
                        setCurrentRequest(null);
                        setQueue((queue) => {
                            return queue.slice(1);
                        });
                        if (onFinish) {
                            onFinish();
                        }
                    },
                ],
            ]);
        });
    }, []);
    // method to check whether a request is currently running
    const isRunning = useMemo((): boolean => {
        return currentRequest !== null;
    }, [currentRequest]);

    // automatic queue dispatch mechanism
    useEffect(() => {
        if (currentRequest === null && queue.length > 0) {
            const [scheduledRequest, scheduledOnFinish] = queue[0];
            setCurrentRequest(scheduledRequest);
            scheduledRequest.execute().finally(scheduledOnFinish);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queue]);

    // automatic queue clean up mechanism
    useEffect(() => {
        return () => {
            queue.forEach((req) => req[0].cancel());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [enqueue, isRunning];
}
