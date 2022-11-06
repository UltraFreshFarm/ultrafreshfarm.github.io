import {routes} from "../routes/routes";
import {ComponentType, memo, MemoExoticComponent, useEffect, useRef, useState} from "react";
import {Target, TargetAndTransition} from "framer-motion";

export interface ParamsAndComponent {
    params: Map<string, string>,
    routeComponent: ComponentType<RouteProps>,
    routeFooterComponent: ComponentType<RouteProps>,
    routeHeaderComponent: ComponentType<RouteProps>,
    path: string,
    animateIn: TargetAndTransition,
    animateOut: TargetAndTransition,
    initial: Target
}

export function useRoute(): ParamsAndComponent {
    const route: [string, RouteElement | MotionRouteElement][] = Object.entries(routes);
    const getParamsAndComponent = useParamsAndComponent();
    const [paramsAndComponent, setParamsRouteComponent] = useState<ParamsAndComponent>(() => getParamsAndComponent(route));
    useEffect(() => {
        const hashChangeListener = () => setParamsRouteComponent(getParamsAndComponent(route));
        window.addEventListener('hashchange', hashChangeListener)
        return () => window.removeEventListener('hashchange', hashChangeListener)
    }, [route]);
    return paramsAndComponent;
}

function getHash() {
    let hash = decodeURI(window.location.hash).trim();
    if (hash.startsWith('#')) {
        hash = hash.substring(1, hash.length);
    }
    return hash
}

function EmptyComponent(props: RouteProps) {
    return <></>
}

interface FilteredComponents {
    paths: string[],
    params: Map<string, any>,
    path: string,
    component: RouteElement,
    footerComponent?: RouteElement,
    headerComponent?: RouteElement,
    animateIn: TargetAndTransition,
    animateOut: TargetAndTransition,
    initial: Target
}

let defaultOnVisible: Target = {
    opacity: 1,
    zIndex: 0
};

let defaultOnHidden: Target = {
    opacity: 0,
    zIndex: -1
};

function useParamsAndComponent() {
    const componentCache = useRef<Map<any, MemoExoticComponent<RouteElement>>>(new Map());
    return function getParamsAndComponents(route: [string, RouteElement | MotionRouteElement][]): ParamsAndComponent {
        const hash = getHash();
        const hashArray = hash.split('/');
        let params = new Map<string, string>();
        let routeComponent: MemoExoticComponent<RouteElement> = memo(EmptyComponent);
        let routeFooterComponent: MemoExoticComponent<RouteElement> = memo(EmptyComponent);
        let routeHeaderComponent: MemoExoticComponent<RouteElement> = memo(EmptyComponent);

        let path: string = '';
        let animateIn: TargetAndTransition = defaultOnVisible;
        let animateOut: TargetAndTransition = defaultOnHidden;
        let initial: Target = defaultOnHidden;
        if (hashArray.length > 0) {
            let filteredComponents: FilteredComponents[] = route.map(([path, componentOrMotionComponent]) => {
                const params: Map<string, any> = new Map();
                let component: RouteElement | undefined;
                let footerComponent: RouteElement | undefined;
                let headerComponent: RouteElement | undefined;
                let animateIn: TargetAndTransition = defaultOnVisible;
                let animateOut: TargetAndTransition = defaultOnHidden;
                let initial: Target = defaultOnHidden;
                if ('component' in componentOrMotionComponent) {
                    component = (componentOrMotionComponent as MotionRouteElement).component;
                    footerComponent = (componentOrMotionComponent as MotionRouteElement).footerComponent;
                    headerComponent = (componentOrMotionComponent as MotionRouteElement).headerComponent;
                    animateIn = (componentOrMotionComponent as MotionRouteElement).animateIn;
                    animateOut = (componentOrMotionComponent as MotionRouteElement).animateOut;
                    initial = (componentOrMotionComponent as MotionRouteElement).initial;
                } else {
                    component = componentOrMotionComponent as RouteElement;
                }
                return {
                    paths: path.split('/'),
                    component,
                    params,
                    path,
                    animateIn,
                    initial,
                    animateOut,
                    footerComponent,
                    headerComponent
                }
            });
            for (let i = 0; i < hashArray.length; i++) {
                const value = hashArray[i];
                filteredComponents = filteredComponents.filter(({paths, params}) => {
                    if (paths.length > i) {
                        const key = paths[i];
                        const isVariable = key.indexOf('$') === 0;
                        if (isVariable) {
                            params.set(key.substring(1, key.length), value);
                            return true;
                        }
                        return value === key;
                    }
                    return false;
                })
            }
            if (filteredComponents.length > 0) {
                const fc = filteredComponents[0];
                params = fc.params;
                const FooterComponent = fc.footerComponent ?? EmptyComponent;
                const HeaderComponent = fc.headerComponent ?? EmptyComponent;
                if (!componentCache.current.has(FooterComponent)) {
                    componentCache.current.set(FooterComponent, memo(FooterComponent, (prevProps: any, nextProps: any) => prevProps.path === nextProps.path && mapsAreEqual(prevProps.params, nextProps.params)));
                }
                if (!componentCache.current.has(HeaderComponent)) {
                    componentCache.current.set(HeaderComponent, memo(HeaderComponent, (prevProps: any, nextProps: any) => prevProps.path === nextProps.path && mapsAreEqual(prevProps.params, nextProps.params)));
                }
                if (!componentCache.current.has(fc.component)) {
                    componentCache.current.set(fc.component, memo(fc.component, (prevProps: any, nextProps: any) => prevProps.path === nextProps.path && mapsAreEqual(prevProps.params, nextProps.params)));
                }
                routeFooterComponent = (componentCache.current.get(FooterComponent) as any);
                routeComponent = (componentCache.current.get(fc.component) as any);
                routeHeaderComponent = (componentCache.current.get(HeaderComponent) as any);
                path = fc.path;
                animateIn = fc.animateIn;
                animateOut = fc.animateOut;
                initial = fc.initial;
            }
        }
        return {
            routeComponent,
            params,
            path,
            animateIn,
            animateOut,
            initial,
            routeFooterComponent,
            routeHeaderComponent
        };
    }

}

export interface RouteProps {
    params: Map<string, string>,
    path: string
}

const mapsAreEqual = (m1: Map<string, any>, m2: Map<string, any>) => m1.size === m2.size && Array.from(m1.keys()).every((key) => m1.get(key) === m2.get(key));

export type RouteElement = ComponentType<RouteProps>;

interface MotionRouteElement {
    headerComponent?: RouteElement,
    component: RouteElement,
    footerComponent?: RouteElement,
    animateIn: TargetAndTransition,
    animateOut: TargetAndTransition,
    initial: Target
}

export interface Routes {
    [key: string]: RouteElement | MotionRouteElement
}