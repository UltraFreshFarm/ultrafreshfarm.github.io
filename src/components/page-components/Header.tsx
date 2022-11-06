import {motion} from "framer-motion";
import {IoChevronBackOutline} from "react-icons/io5";
import {PropsWithChildren, ReactFragment} from "react";
import {white} from "../../routes/Theme";


type Element = string | number | boolean | ReactFragment | JSX.Element | null | undefined;

export function Header(props: PropsWithChildren<{ title: Element }>) {
    const {title} = props;
    return <div style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        paddingLeft: 10,
        padding: 5,
        paddingTop: 7,
        paddingRight: 20,
        color:white,
        backgroundImage: 'url("/logo/banner-bg.png")',
    }}>
        <motion.div onTap={() => window.history.back()}
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}>
            <IoChevronBackOutline style={{fontSize: 36}}/>
        </motion.div>
        <div style={{fontSize: 18, fontWeight: 'bold', lineHeight: 1, marginBottom: 2, marginLeft: 10}}>{title}</div>
        {props.children}
    </div>;
}