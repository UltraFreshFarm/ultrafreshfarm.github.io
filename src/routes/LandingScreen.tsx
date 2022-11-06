import {motion} from "framer-motion";
import {useNavigate} from "../components/useNavigate";
import React from "react";

export function LandingScreen() {
    const navigate = useNavigate();
    return <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <motion.div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
        }} onTap={() => {
            navigate('home');
        }}>
            <img src={'/logo/ultra-fresh.svg'} width={400} height={300} alt={'Ultra fresh logo'} />
            <motion.div style={{color:'#04B250'}} animate={{scale:[1,1.2,1]}} transition={{repeat:Infinity}}>Tap here to continue</motion.div>
        </motion.div>
    </div>

}