import {
    createContext,
    Dispatch,
    PropsWithChildren,
    ReactElement,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import {Store} from "./store/useCreateStore";
import {AppState} from "./AppState";
import {WindowSizeContext} from "../App";
import {supabase} from "./supabase";
import {Session} from "@supabase/supabase-js";

export function useAppContext() {
    return useContext(AppContext);
}

interface Dimension {
    width: number,
    height: number
}

interface AppContextType {
    appDimension: Dimension,
    appType: AppType,
    showModal: <T>(factoryFunction: FactoryFunction<T>) => Promise<T>,
    store: Store<AppState>,
    user?: User,
    session?: Session
}


enum AppType {
    Mobile,
    Tablet,
    Laptop,
    Desktop
}


const Nothing: any = () => {
}
const AppContext = createContext<AppContextType>({
        appDimension: {width: 0, height: 0},
        appType: AppType.Mobile,
        showModal: Nothing,
        store: {
            dispatch: Nothing,
            stateRef: {
                current: {
                    shoppingCart: [],
                    shippingAddress: {
                        addressLine2: '',
                        state: '',
                        addressLine1: '',
                        city: '',
                        firstName: '',
                        country: '',
                        email: '',
                        lastName: '',
                        note: '',
                        phone: '',
                        zipCode: ''
                    },
                    cardInfo: {
                        cardNumber: '',
                        cardHolderName: '',
                        validUntil: ''
                    }
                }
            }, addListener: (state: any) => Nothing,
            setState: Nothing,
        }
    }
);

type FactoryFunction<T> = (closePanel: (val: T) => void) => ReactElement;

let userSession: any = null;
(async () => {
    let {data} = await supabase.auth.getSession();
    userSession = data?.session;
})();

export interface User {
    firstName: string,
    lastName: string,
    nationality: string,
    phone: string,
    email: string
}

export function AppContextProvider<State extends AppState>(props: PropsWithChildren<{
    setModalPanel: Dispatch<ReactElement | false>, store: Store<State>
}>) {

    const window = useContext(WindowSizeContext);
    const {setModalPanel, store} = props;
    const [session, setSession] = useState<Session | null>(userSession);

    const user: User | null = useMemo(() => {
        if (session) {
            return {
                firstName: session.user.user_metadata.firstName ?? '',
                lastName: session.user.user_metadata.lastName ?? '',
                nationality: session.user.user_metadata.nationality ?? '',
                phone: session.user.phone ?? '',
                email: session.user.user_metadata.email ?? ''
            }
        }
        return null;
    }, [session]);
    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
        });
    }, []);
    const showModal = useCallback((factory: FactoryFunction<any>) => {
        return new Promise<any>(resolve => {
            const closePanel = (value: any) => {
                setModalPanel(false);
                resolve(value);
            }
            const element = factory(closePanel);
            setModalPanel(element)
        })
    }, [setModalPanel]);

    const contextValue = useMemo(() => {
        const appDimension: Dimension = window;

        let appType = AppType.Desktop;
        if (appDimension.width <= 480) {
            appType = AppType.Mobile
        }

        if (appDimension.width < 768) {
            appType = AppType.Tablet
        }

        if (appDimension.width < 1024) {
            appType = AppType.Laptop
        }

        return {appDimension, appType, showModal, store, user, session}
    }, [showModal, store, window, user, session]);

    return <AppContext.Provider value={(contextValue as any)}>
        {props.children}
    </AppContext.Provider>
}
