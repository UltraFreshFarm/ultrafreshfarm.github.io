import {IconType} from "react-icons";
import {ButtonTheme, theme, white} from "../../routes/Theme";
import {motion, MotionStyle} from "framer-motion";

export function Button(props: { onTap: () => void, title: string, icon: IconType, theme: ButtonTheme, style?: MotionStyle }) {
    const Icon: IconType = props.icon;
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
    }}
                          whileTap={{scale: 0.98}}
                          onTap={props.onTap}>
        <div>{props.title}</div>
        {Icon &&
            <div style={{marginBottom: -3, marginLeft: 10}}>
                <Icon/>
            </div>
        }
    </motion.button>;
}