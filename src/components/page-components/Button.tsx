import {IconType} from "react-icons";
import {ButtonTheme, theme, white} from "../../routes/Theme";
import {motion, MotionStyle} from "framer-motion";
import {AiOutlineLoading3Quarters} from "react-icons/ai";

export function Button(props: { onTap: () => void, title: string, icon: IconType, theme: ButtonTheme, style?: MotionStyle, isBusy?: boolean }) {
    const isBusy = props.isBusy;
    const Icon: IconType = isBusy ? AiOutlineLoading3Quarters : props.icon;
    const buttonTheme = props.theme ?? ButtonTheme.danger;
    return <motion.button layout style={{
        minWidth: 0,
        fontSize: 18,
        border: '1px solid rgba(0,0,0,0.03)',
        borderRadius: 30,
        padding: '5px 20px',
        background: theme[buttonTheme],
        color: white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 5px 20px -3px rgba(255,255,255,0.1) inset',
        ...props.style
    }} disabled={isBusy}
                          whileTap={{scale: 0.98}}
                          onTap={isBusy ? nothing : props.onTap}>
        <div>{props.title}</div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: isBusy ? 20 : 10}}>
            {Icon &&
                <motion.div style={{width: 20, height: 20}}
                            animate={isBusy ? {rotate: [360, 0], position: 'fixed'} : undefined}
                            transition={isBusy ? {repeat: Infinity} : undefined}>
                    <Icon/>
                </motion.div>
            }
        </div>
    </motion.button>;
}

const nothing = () => {
};