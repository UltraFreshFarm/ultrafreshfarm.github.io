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
            <img src={'/logo/ultra-fresh.svg'} width={400} height={300} />
        </motion.div>
    </div>

}