import {useAppContext} from "../components/useAppContext";
import {RouteProps} from "../components/useRoute";
import {MdAddShoppingCart, MdOutlineRemoveShoppingCart} from "react-icons/md";
import {data} from "../data";
import {AnimatePresence, motion} from "framer-motion";
import {ButtonTheme, white} from "./Theme";
import {useStoreValue} from "../components/store/useCreateStore";
import {useEffect, useState} from "react";
import {Header} from "../components/page-components/Header";

import {Button} from "../components/page-components/Button";
import {Image} from "../components/page-components/Image";


function TotalItemsInCartLogo(props: { totalInCart?: number }) {
    const {totalInCart} = props;
    const [scaleUp, setScaleUp] = useState(false);
    useEffect(() => {
        setScaleUp(true);
        setTimeout(() => {
            setScaleUp(false);
        }, 100);
    }, [totalInCart])
    return <motion.div layoutId={'totalItemCartLogo'} animate={{scale: scaleUp ? 1.05 : 1}} style={{
        fontSize: 50,
        background: 'radial-gradient(rgba(255,255,255,0.1),rgba(0,0,0,0.2))',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        marginRight: 20,
        minWidth: 80,
        paddingBottom: 5,
        paddingRight: 2
    }}>
        {props.totalInCart}
    </motion.div>;
}


export function ProductDetail(props: RouteProps) {
    const {appDimension, store} = useAppContext();
    const {params} = props;

    const productId = params.get('productId');
    const product = data.find(p => p.barcode === productId);

    const totalInCart = useStoreValue(store, (value) => {
        return value.shoppingCart.find(s => s.barcode === productId)?.total
    }, [productId]);

    if (!product) {
        return <div>No Product PRODUCT ID {productId}</div>;
    }

    return <div style={{
        backgroundColor: white,
        height: '100%',
        width: appDimension.width,
        display: 'flex',
        flexDirection: 'column'
    }}>
        <Header title={product.name}/>
        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'auto'}}>
            <div style={{
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'radial-gradient(rgba(255,255,255,1) 70%,rgba(0,0,0,0.1))',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
                <Image src={`/images/${productId}/400/1.png`} alt={`Barcode ${productId}`} width={appDimension.width}
                       height={appDimension.width}/>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', padding: '0px 20px'}}>
                <div style={{fontSize: 36}}>
                    {product.category} {product.name}
                </div>
                <div style={{display: 'flex'}}>
                    <div style={{fontSize: 26}}>
                        {product.unit} {product.unitType}
                    </div>
                    <div style={{flexGrow: 1}}/>
                    <div style={{fontSize: 26}}>
                        {product.price} AED
                    </div>
                </div>
                <div style={{fontSize: 20}}>
                    Shelf life : {product.shelfLife} {product.shelfLifeType}
                </div>
            </div>
            <AnimatePresence>
                <div style={{display: 'flex', padding: 20}}>
                    {totalInCart &&
                        <TotalItemsInCartLogo totalInCart={totalInCart}/>
                    }
                    <motion.div layoutId={'addButton'} style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                        <Button title={'Add'} icon={MdAddShoppingCart} theme={ButtonTheme.promoted} onTap={() => {
                            store.dispatch({payload: {barcode: product.barcode}, type: 'add_to_cart'})
                        }}/>
                        {totalInCart &&
                            <Button title={'Remove'} icon={MdOutlineRemoveShoppingCart} theme={ButtonTheme.danger}
                                    onTap={() => {
                                        store.dispatch({
                                            payload: {barcode: product.barcode},
                                            type: 'remove_from_cart'
                                        })
                                    }} style={{marginTop: 10}}/>
                        }
                    </motion.div>
                </div>
            </AnimatePresence>
        </div>
    </div>
}
