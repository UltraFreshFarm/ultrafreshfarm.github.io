import {CSSProperties, PropsWithChildren} from "react";
import './SkeletonBox.css';
import {motion} from "framer-motion";

export function SkeletonBox(props: PropsWithChildren<{ skeletonVisible: boolean, style: CSSProperties }>) {
    const {children, skeletonVisible, style} = props;

    if (skeletonVisible) {
        return <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className={'skeleton-box'}
                           style={{minWidth: 20, minHeight: 19, ...style}}/>
    }
    return <>{children}</>;
}