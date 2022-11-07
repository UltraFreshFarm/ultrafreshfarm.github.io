import {MdOutlinePayments} from "react-icons/md";
import {RouteProps} from "../components/useRoute";
import {useAppContext} from "../components/useAppContext";
import {useStoreValue} from "../components/store/useCreateStore";
import {data} from "../data";
import invariant from "tiny-invariant";
import {ButtonTheme} from "./Theme";
import {useNavigate} from "../components/useNavigate";
import {Button} from "../components/page-components/Button";

import {AddRemoveButton} from "./ProductWithCategory";
import {useMemo} from "react";
import {Product} from "../components/AppState";
import {Image} from "../components/page-components/Image";

export function useSubTotalCart() {
    const cartItems = useItemsInCart();
    const subTotal = useMemo(() => cartItems.reduce((total, ci) => {
        return total + (ci.total * parseFloat(ci.price));
    }, 0).toFixed(2), [cartItems]);
    return subTotal;
}

export function useItemsInCart() {
    const appContext = useAppContext();
    const cartItems = useStoreValue(appContext.store, (state) => {
        return state.shoppingCart.map(sc => {
            const item: Product | undefined = data.find(c => c.barcode === sc.barcode);
            invariant(item);
            return {
                ...sc,
                ...item
            }
        })
    }, []);
    return cartItems;
}

export default function Cart(props: RouteProps) {
    const navigate = useNavigate();
    const cartItems = useItemsInCart();
    const subTotal = useSubTotalCart();
    const isEmpty = cartItems.length === 0;
    return <div style={{
        background: 'rgba(255,255,255,0.2)',
        height: '100%',
        display: 'flex',
        boxSizing:'border-box',
        flexDirection: 'column',
        overflow: 'auto',
        position: 'relative',
        paddingTop: 54,
        paddingBottom:52
    }}>
        {isEmpty &&
            <div style={{margin: 20, marginBottom: 30}}>
                <div style={{fontSize: 36, marginBottom: 10}}>
                    Its Empty
                </div>
                <div>
                    Your shopping cart does not currently contain any items. You are free to begin adding products, and
                    at any time you wish, you can return to this page in order to examine the rundown of the products
                    that you have decided to buy.
                </div>
            </div>
        }
        <div style={{display:'flex',flexDirection:'column',overflow:'auto',paddingBottom:50,height:'100%'}}>
            <div style={{
                fontSize: 16,
                fontWeight: 'bold',
                padding: 10,
                borderBottom: '1px solid rgba(0,0,0,0.1)'
            }}>Your Items ({cartItems.length})
            </div>
            <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'auto'}}>
                {cartItems.map(ci => {
                    return <div key={ci.barcode} style={{
                        display: 'flex',
                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                        padding: 5
                    }}>
                        <div style={{marginRight: 10}}>
                            <Image src={`/images/${ci.barcode}/THUMB/default.png`}
                                   alt={'Barcode ' + ci.barcode} height={50} width={50}/>
                        </div>
                        <div style={{flexGrow: 1}}>
                            <div style={{flexGrow: 1, fontSize: 14}}>{ci.category} {ci.name} </div>
                            <div style={{flexGrow: 1, fontSize: 14, fontWeight: 'bold'}}>AED {ci.price}</div>
                            <div style={{fontSize: 12}}>{ci.unit} {ci.unitType} </div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', marginRight: 10}}>
                            <AddRemoveButton barcode={ci.barcode} size={'small'} key={`button-${ci.barcode}`}/>
                        </div>
                    </div>
                })}
                <div style={{display: 'flex', padding: '10px 20px', borderBottom: '1px solid rgba(0,0,0,0.1)'}}>
                    <div style={{flexGrow: 1}}></div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{fontSize: 12}}>Subtotal</div>
                        <div style={{fontWeight: 'bold', fontSize: 18}}>AED {subTotal}</div>
                    </div>
                </div>
            </div>


        </div>



        <div style={{
            background: 'rgba(255,255,255,0.9)',
            padding: '10px 20px',
            boxSizing:'border-box',
            position:'absolute',
            bottom:50,
            width:'100%',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            display: "flex",
        }}>
            <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                <div style={{fontSize: 12}}>Subtotal</div>
                <div style={{fontWeight: 'bold', fontSize: 18}}>AED {subTotal}</div>
            </div>
            {!isEmpty &&
            <div>
                <Button title={'Check Out'} icon={MdOutlinePayments} theme={ButtonTheme.promoted}
                        onTap={() => navigate('shipping')}/>
            </div>
            }
        </div>
    </div>
}