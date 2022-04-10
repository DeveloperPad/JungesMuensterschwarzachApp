import {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
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

export function useStateRequest(
    initialState: Request | (() => Request) = null
): [Request, Dispatch<SetStateAction<Request>>] {
    const [state, setState] = useState(initialState);
    const prevState = usePrevious(state);

    useEffect(() => {
        if (prevState) {
            prevState.cancel();
        }
        if (state) {
            state.execute();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);
    useEffect(() => {
        return () => {
            if (state) {
                state.cancel();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [state, setState];
}
