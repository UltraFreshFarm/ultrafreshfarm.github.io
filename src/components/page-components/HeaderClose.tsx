import {motion} from "framer-motion";
import {IoClose} from "react-icons/io5";
import {PropsWithChildren} from "react";

export function HeaderClose(props:PropsWithChildren<{onClose?:() => void}>){
    return <div style={{display: 'flex', flexDirection: 'row-reverse', margin: 10}}>
        <motion.div style={{fontSize: 36}} whileTap={{scale: 0.95}}
                    onTap={() => {
                        if(props.onClose){
                            props.onClose();
                        }else{
                            window.history.back()
                        }
                    }}>
            <IoClose/>
        </motion.div>
        {props.children}
    </div>
}