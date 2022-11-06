import {useAppContext} from "../useAppContext";
import React from "react";

export function HeaderNavigation() {
    const {appDimension} = useAppContext();
    return <div style={{
        boxSizing: 'border-box',
        boxShadow: '0px -5px 20px -5px rgba(0,0,0,0.2) inset',
        backgroundImage: 'url("/logo/banner-bg.png")',
        width: appDimension.width,
        display: 'flex',
        alignItems:'center'
    }}>
        <div style={{display:'flex',flexDirection:'column',marginTop:5,marginBottom:5}}>
            <div style={{position:'relative',marginLeft:10}}>
                <img src={'/logo/ultra-fresh-2.svg'} width={200}/>
                <img src={'/logo/marmum-logo.png'} height={23} style={{position:'absolute',right:10}}/>
            </div>
        </div>
    </div>
}