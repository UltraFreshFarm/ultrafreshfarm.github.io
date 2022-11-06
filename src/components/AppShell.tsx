import {CSSProperties, ReactElement, useState} from "react";
import {AppContextProvider} from "./useAppContext";
import {AnimatePresence, motion} from "framer-motion";
import {RouterPageContainer} from "./RouterPageContainer";
import {useCreateStore} from "./store/useCreateStore";
import {storeReducer} from "./AppState";

const shellStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'url("background.jpeg")',
    alignItems: 'center',
    boxSizing: 'border-box',
    overflow: 'auto',

}

const modalStyle: CSSProperties = {

    backdropFilter: 'blur(5px)',
    background: 'rgba(255,255,255,0.8)',
    width: '100%',
    height: '100%',
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
}

const dialogPanelStyle: CSSProperties = {
    minWidth: 100,
    minHeight: 0,
}

export default function AppShell() {
    const [modalPanel, setModalPanel] = useState<ReactElement | false>(false);
    const store = useCreateStore({
        shoppingCart: [],
        cardInfo: {
            cardNumber: '',
            validUntil: '',
            cardHolderName: ''
        },
        shippingAddress: {
            firstName: '',
            lastName: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            email: '',
            phone: '',
            note: '',
        }
    }, storeReducer);

    return <AppContextProvider setModalPanel={setModalPanel} store={store}>
        <div style={shellStyle}>
            <RouterPageContainer/>
            <AnimatePresence>
                {modalPanel && <motion.div style={modalStyle} initial={{opacity: 0}} animate={{opacity: 1}}
                                           exit={{opacity: 0}} transition={{ease: "easeInOut", duration: 0.3}}
                                           key={'modal'}>
                    <motion.div style={dialogPanelStyle} initial={{scale: 0.7, opacity: 0.4}}
                                animate={{scale: 1, opacity: 1}} exit={{scale: 0.7, opacity: 0.4}}>
                        {modalPanel}
                    </motion.div>
                </motion.div>}
            </AnimatePresence>
        </div>
    </AppContextProvider>
}
