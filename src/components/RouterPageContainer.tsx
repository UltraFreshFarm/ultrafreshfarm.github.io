import {RouteProps, useRoute} from "./useRoute";
import {createContext, FunctionComponent, useContext, useEffect, useMemo, useRef, useState} from "react";
import {motion} from "framer-motion";
import {usePreviousValue} from "./page-components/usePreviousValue";


/**
 * Router Page Container
 * @constructor
 */
export function RouterPageContainer() {
    const componentsRef = useRef<PathAbleComponent[]>([]);
    const {
        params,
        routeComponent: RouteComponent,
        path,
        animateIn,
        animateOut,
        initial,
        routeFooterComponent: RouteFooterComponent,
        routeHeaderComponent : RouterHeaderComponent
    } = useRoute();
    const currentAnimateOutRef = useRef(animateOut); //
    currentAnimateOutRef.current = animateOut;
    const Component = useMemo(() => function RouteComponentContainer(props: { isFocused: boolean } & RouteProps) {
        const {isFocused} = props;
        const beforeIsFocused = usePreviousValue(isFocused);
        const changeToFocused = (beforeIsFocused !== isFocused) && isFocused;
        const changeToBlurred = (beforeIsFocused !== isFocused) && !isFocused;
        if (changeToBlurred) {
            //console.log('A panel is blurred');
        }
        if (changeToFocused) {
            //console.log('A panel is focused');
        }

        return <motion.div
            initial={initial}
            style={{position: 'absolute', height: '100%', width: '100%', overflow: 'auto'}}
            animate={isFocused ? animateIn : animateOut}

        >
            <RouteComponent params={props.params} path={props.path}/>
        </motion.div>
        // eslint-disable-next-line
    }, [RouteComponent]);

    const componentIndex = componentsRef.current.findIndex(c => c.path === path);
    if (componentIndex < 0) {
        componentsRef.current.push({params, path, component: Component})
    } else {
        componentsRef.current[componentIndex].params = params;
    }
    return <CurrentActivePathContext.Provider value={path}>
        <div style={{
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {componentsRef.current.map((c) => {
                const Component = c.component;
                const isFocused = c.path === path;
                return <Component key={c.path} params={c.params} path={c.path} isFocused={isFocused}/>
            })}
            <div style={{position: 'absolute', bottom: 0, width: '100%'}}>
                <RouteFooterComponent path={path} params={params}/>
            </div>
            <div style={{position: 'absolute', top: 0, width: '100%'}}>
                <RouterHeaderComponent path={path} params={params}/>
            </div>
        </div>
    </CurrentActivePathContext.Provider>
}

interface PathAbleComponent {
    component: FunctionComponent<{ isFocused: boolean } & RouteProps>,
    path: string,
    params: Map<string, string>
}

const CurrentActivePathContext = createContext('');

export function useFocusListener(path: string) {
    const currentActivePath = useContext(CurrentActivePathContext);
    const [isFocused, setIsFocused] = useState<boolean>(currentActivePath === path);
    useEffect(() => setIsFocused(currentActivePath === path), [path, currentActivePath]);
    return isFocused;
}


