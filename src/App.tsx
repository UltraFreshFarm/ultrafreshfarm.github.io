import React, {createContext, useMemo} from 'react';
import './App.css';


import AppShell from "./components/AppShell";

export const WindowSizeContext = createContext<{ width: number, height: number }>({width: 0, height: 0})

function App() {

    let {width, height} = useMemo(() => ({width: window.innerWidth, height: window.innerHeight}), []);

    const isSimulator = width > 490;
    let scale = 1;
    if (width > 490) {
        width = 390;
        height = 844;
        scale = (window.innerHeight - 20) / height;
    }
    const windowsSizeContextProviderValue = useMemo(() => ({width, height}), [height, width]);
    if (isSimulator) {

        return <div style={{display: 'flex', height: '100%', overflow: 'hidden',alignItems:'center',boxSizing:'border-box'}}
                    className={'background-css'}>
            <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center'}}>
                <div style={{margin: 60, marginTop: 0, display: 'flex', flexDirection: 'column', color: 'white'}}>
                    <div style={{fontSize: 55}}>
                        ULTRA FRESH
                    </div>
                    <div>
                        Designed and build by Windy Des Nadian 2022
                    </div>
                </div>
            </div>

            <WindowSizeContext.Provider value={windowsSizeContextProviderValue}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height,
                    width,
                    flexShrink: 0,
                    borderRadius: 30,
                    marginRight: '5%',
                    overflow: 'auto',
                    boxShadow: '0 5px 5px 0 rgba(0,0,0,0.5)',
                    border: '10px solid rgba(0,0,0,1)',
                    transform:`scale(${scale})`
                }}>
                    <AppShell/>
                </div>
            </WindowSizeContext.Provider>

        </div>
    }

    return <div style={{display: 'flex', height: '100%', overflow: 'auto'}}>
        <WindowSizeContext.Provider value={windowsSizeContextProviderValue}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height,
                width,
                flexShrink: 0,
                overflow: 'auto',
                margin: 0,
                borderRadius: 0
            }}>
                <AppShell/>
            </div>
        </WindowSizeContext.Provider>
    </div>
}

export default App;
