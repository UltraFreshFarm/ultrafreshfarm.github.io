import {CSSProperties} from "react";
import {blue, white} from "../../routes/Theme";
import {motion} from "framer-motion";
import {Image} from "./Image";

const itemStyleSheet: CSSProperties = {
    margin: 5,
    marginTop: 0,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
}

export function ItemIcon<T extends { barcode: string, name: string }>(props: { imageDimension: number, item: T, onTap: (item: T) => void, selected?: boolean }) {
    const {imageDimension, item, selected} = props;
    return <motion.div style={{...itemStyleSheet, width: imageDimension, height: imageDimension + 30}}
                       key={item.barcode} whileTap={{scale: 0.95}} whileHover={{scale: 1.05}}
                       onTap={() => props.onTap(item)}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{
                padding: 0,
            }}>
                <Image src={`/images/${item.barcode}/THUMB/default.png`}
                       width={imageDimension - 10} height={imageDimension-10} alt={'Barcode ' + item.barcode}/>
            </div>
            <div style={{fontSize: 14, textAlign: 'center', marginTop: 5}}>
                {item.name}
            </div>
        </div>
    </motion.div>;
}