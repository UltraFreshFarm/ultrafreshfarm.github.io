import {useEffect, useRef} from "react";

export function usePreviousValue<T>(value: T) {
    const valueRef = useRef<T>();
    useEffect(() => {
        valueRef.current = value
    }, [value])
    return valueRef.current;
}