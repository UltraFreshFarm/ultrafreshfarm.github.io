import {SkeletonBox} from "../../../components/page-components/SkeletonBox";
import {motion} from "framer-motion"
import {CSSProperties} from "react";
export function TitleValue(props: { value: string | undefined | null, title: string, style?:{containerStyle?:CSSProperties} }) {
    const containerStyle = props?.style?.containerStyle ?? {};
    return <motion.div layout style={{display: 'flex', flexDirection: 'column',  ...containerStyle }}>
        <motion.div layout style={{fontSize: 13, marginRight: 10}}>{props.title} :</motion.div>
        <SkeletonBox skeletonVisible={props.value === null || props.value === undefined}
                     style={{flexGrow: 1, height: 16, marginRight: 10}}>
            <motion.div style={{fontSize: 16,height:19}} layout>
                {props.value}
            </motion.div>
        </SkeletonBox>
    </motion.div>
}
