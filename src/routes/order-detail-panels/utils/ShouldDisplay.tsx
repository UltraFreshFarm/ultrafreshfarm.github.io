import {PropsWithChildren} from "react";

export function ShouldDisplay(props: PropsWithChildren<{ value?: boolean }>) {
    if (!props.value) {
        return <></>;
    }
    return <>{props.children}</>
}