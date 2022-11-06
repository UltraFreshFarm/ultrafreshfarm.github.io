import {IconType} from "react-icons";
import {CSSProperties} from "react";
import {motion} from "framer-motion";


export function TitleIcon(props: { title: string, icon: IconType, iconSize: number, style?: CSSProperties, onTap?: () => void, titlePosition?: 'top' | 'bottom' }) {
    let {icon, title, style, iconSize, onTap, titlePosition} = props;
    iconSize = iconSize ?? 27;
    titlePosition = titlePosition ?? 'bottom';
    const Icon = icon;
    return <motion.div whileTap={{scale: 0.95}} style={{
        display: 'flex',
        flexDirection: titlePosition === 'bottom' ? 'column' : 'column-reverse',
        alignItems: 'center',
        fontSize: 12,
        margin: 5,
        ...style
    }} onTap={onTap}>
        <motion.div style={{fontSize: iconSize, marginBottom: -5}}>
            <Icon/>
        </motion.div>
        <div>
            {title}
        </div>
    </motion.div>
}