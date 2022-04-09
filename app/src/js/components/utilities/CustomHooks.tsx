import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export function useForceUpdate() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [value, setValue] = useState(0); // integer state
    return () => setValue((value) => value + 1); // update the state to force render
}

export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export function useStateWithCallback<S>(initialState: S | (() => S), callback: (newState: S) => void): [S, Dispatch<SetStateAction<S>>] {
    const [state, setState] = useState(initialState);

    useEffect(() => callback(state), [state, callback]);

    return [state, setState];
}
