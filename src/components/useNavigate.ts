import {useCallback} from "react";

export function useNavigate() {
    const navigate = useCallback((path: string) => {
        if (path.startsWith('#')) {
            path = path.substring(1, path.length);
        }
        if (path.startsWith('/')) {
            path = path.substring(1, path.length);
        }
        window.location.hash = '#' + path;
    }, [])
    return navigate;
}
