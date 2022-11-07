import {RouteProps} from "../components/useRoute";
import {Header} from "../components/page-components/Header";

import {RiAppleLine, RiGoogleLine, RiMastercardLine, RiVisaLine} from "react-icons/ri";
import {blue, ButtonTheme, white} from "./Theme";
import {Input} from "../components/page-components/Input";
import {Button} from "../components/page-components/Button";
import {IoCardOutline, IoClose} from "react-icons/io5";
import {useSubTotalCart} from "./Cart";
import {useCallback, useEffect} from "react";
import {useAppContext} from "../components/useAppContext";
import {produce} from "immer";
import {useNavigate} from "../components/useNavigate";
import {StoreValue, useCreateStore, useStoreValue} from "../components/store/useCreateStore";
import {isNotEmptyText} from "./Shipping";
import {useFocusListener} from "../components/RouterPageContainer";
import {nanoid} from "nanoid";
import {supabase} from "../components/supabase";
import {DbOrder, statusDescription} from "../components/model/DbOrder";
import {DbOrderLineItems} from "../components/model/DbOrderLineItems";


export default function Payment(props: RouteProps) {
    const subTotal = useSubTotalCart();
    const {store, user,showModal} = useAppContext();
    const cardInfo = useStoreValue(store, s => s.cardInfo);
    const localStore = useCreateStore({
        ...cardInfo,
        cvv: '',
        errors: {
            cardNumber: '',
            validUntil: '',
            cvv: '',
            cardHolderName: '',
        },
        isFetchingRequest: false
    });
    const isFocused = useFocusListener(props.path);
    useEffect(() => {
        if (!isFocused) {
            localStore.setState(produce(s => {
                s.cardHolderName = '';
                s.validUntil = '';
                s.cvv = '';
                s.cardNumber = '';
            }))
        }
    }, [isFocused, localStore]);

    const navigate = useNavigate();

    const validate = useCallback(() => {
        localStore.setState(produce(state => {
            state.errors.cardNumber = isNotEmptyText(state.cardNumber) ? '' : 'Card Number is required';
            state.errors.cardHolderName = isNotEmptyText(state.cardHolderName) ? '' : 'Name is required';
            state.errors.cvv = isNotEmptyText(state.cvv) ? '' : 'CVV is required';
            state.errors.validUntil = isNotEmptyText(state.validUntil) ? '' : 'Valid until is required';
        }));
        const state = localStore.stateRef.current;
        const hasError = Object.keys(state.errors).reduce((hasError, key) => {
            return hasError || ((state.errors as any)[key]).toString().length > 0
        }, false);
        return !hasError;
    }, [localStore]);

    const performPayment = useCallback(async () => {
        if (!validate()) {
            return;
        }
        if (user === null) {
            navigate('sign-in');
            return;
        }
        localStore.setState(produce(s => {s.isFetchingRequest = true}));

        store.setState(produce(state => {
            state.cardInfo.cardHolderName = localStore.stateRef.current.cardHolderName;
            state.cardInfo.cardNumber = localStore.stateRef.current.cardNumber;
            state.cardInfo.validUntil = localStore.stateRef.current.validUntil;
        }));

        const shippingAddress = store.stateRef.current.shippingAddress;
        const subTotalAmount = parseFloat(subTotal);
        const dbOrder: DbOrder = {
            payment_date: new Date().toISOString(),
            order_status: 'Placed',
            payment_amount: subTotalAmount,
            payment_method: 'card',
            payment_status: 'Received',
            payment_reference_code: nanoid(),
            created_by: user?.phone ?? '',
            shipping_address_line_one: shippingAddress.addressLine1,
            shipping_address_line_two: shippingAddress.addressLine2,
            shipping_city: shippingAddress.city,
            shipping_country: shippingAddress.country,
            shipping_note: shippingAddress.note,
            shipping_receiver_first_name: shippingAddress.firstName,
            shipping_receiver_last_name: shippingAddress.lastName,
            shipping_receiver_phone: shippingAddress.phone,
            shipping_state: shippingAddress.state,
            shipping_zipcode: shippingAddress.zipCode,
            sub_total: subTotalAmount
        };
        let {data: persistedData} = await supabase.from('orders').insert(dbOrder).select().single() as {data:DbOrder};
        const shoppingCart = store.stateRef.current.shoppingCart;
        let dbOrderLineItems = shoppingCart.map(sc => {
            const item: DbOrderLineItems = {
                barcode: sc.barcode,
                category: sc.category,
                name: sc.name,
                price: parseFloat(sc.price),
                unit: sc.unit,
                unit_type: sc.unitType,
                requested_amount: sc.total,
                shelf_life: sc.shelfLife,
                shelf_life_type: sc.shelfLifeType,
                order: persistedData.id ?? -1,
                fulfilled_amount: 0
            };
            return item;
        });
        await supabase.from("order_line_items").insert(dbOrderLineItems).select();
        store.setState(produce(state => {
            state.shoppingCart = [];
            state.shippingAddress = {
                addressLine2: '',
                lastName: '',
                firstName: '',
                city: '',
                country: '',
                addressLine1: '',
                email: '',
                note: '',
                zipCode: '',
                phone: '',
                state: ''
            }
        }));
        await showModal(closePanel => {
            return <div style={{background:'white',padding:20,margin:20,borderRadius:20,border:'1px solid rgba(0,0,0,0.1)',display:'flex',flexDirection:'column'}}>
                <div style={{marginBottom:10,fontSize:26}}>Hi {user?.firstName} {user?.lastName}, The system has successfully registered your order.</div>
                <div style={{fontSize:14}}>
                    {statusDescription[persistedData.order_status](persistedData)}
                </div>
                <div style={{marginTop:10,display:'flex',flexDirection:'column'}}>
                    <Button onTap={() => closePanel(true)} title={'OK'} icon={IoClose} theme={ButtonTheme.promoted} />
                </div>
            </div>
        })
        localStore.setState(produce(s => {s.isFetchingRequest = false}));
        // we need to close busy icon here
        navigate('history');


    }, [store, navigate, validate, subTotal, localStore.stateRef, user?.phone]);


    return <div
        style={{
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            background: 'radial-gradient(rgba(255,255,255,1),rgba(0,0,0,0.03))',
        }}>
        <Header title={'Payment'}/>
        <div style={{height: '100%'}}>
            <div style={{
                display: 'flex',
                fontSize: 26,
                justifyContent: 'space-between',
                padding: '10px 20px',
                color: white,
            }}>
                <div style={{
                    margin: 5,
                    backgroundColor: blue,
                    height: 40,
                    width: '25%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3
                }}>
                    <RiGoogleLine/>
                </div>
                <div style={{
                    margin: 5,
                    backgroundColor: blue,
                    height: 40,
                    width: '25%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3
                }}>
                    <RiAppleLine/>
                </div>
                <div style={{
                    margin: 5,
                    fontSize: 50,
                    backgroundColor: blue,
                    height: 40,
                    width: '25%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3
                }}>
                    <RiVisaLine/>
                </div>
                <div style={{
                    margin: 5,
                    fontSize: 40,
                    backgroundColor: blue,
                    height: 40,
                    width: '25%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3
                }}>
                    <RiMastercardLine/>
                </div>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                margin: '0px 25px 0 25px',
                background: 'white',
                borderRadius: 5,
                boxShadow: '0 3px 5px -3px rgba(0,0,0,0.2)'
            }}>
                <StoreValue store={localStore} selector={[(s) => s.cardNumber, (s) => s.errors.cardNumber]}
                            property={['value', 'error']}>
                    <Input title={'Card Number'} placeholder={'Enter your card Number here'} onChange={(e) => {
                        localStore.setState(produce(old => {
                            old.cardNumber = e.target.value;
                            old.errors.cardNumber = e.target.value === '' ? 'Card Number is required' : '';
                        }));
                    }}/>
                </StoreValue>
                <div style={{display: 'flex'}}>
                    <div style={{width: '70%'}}>
                        <StoreValue store={localStore} selector={[s => s.validUntil, s => s.errors.validUntil]}
                                    property={['value', 'error']}>
                            <Input title={'Valid Until'} placeholder={'Valid Until'} onChange={(e) => {
                                localStore.setState(produce(s => {
                                    s.validUntil = e.target.value;
                                    s.errors.validUntil = e.target.value === '' ? 'Valid Until is required' : ''
                                }))
                            }}/>
                        </StoreValue>
                    </div>
                    <div style={{width: '30%'}}>
                        <StoreValue store={localStore} selector={[s => s.cvv, s => s.errors.cvv]}
                                    property={['value', 'error']}>
                            <Input title={'CVV'} placeholder={'xxx'} onChange={(e) => {
                                localStore.setState(produce(s => {
                                    s.cvv = e.target.value;
                                    s.errors.cvv = e.target.value === '' ? 'CVV is required' : ''
                                }))
                            }}/>
                        </StoreValue>
                    </div>
                </div>
                <StoreValue store={localStore} selector={[s => s.cardHolderName, s => s.errors.cardHolderName]}
                            property={['value', 'error']}>
                    <Input title={'Card Holder Name'} placeholder={'Enter your card Number here'} onChange={(e) => {
                        localStore.setState(produce(s => {
                            s.cardHolderName = e.target.value;
                            s.errors.cardHolderName = e.target.value === '' ? 'Card Name is required' : '';
                        }))
                    }}/>
                </StoreValue>
            </div>
            <div style={{margin: '20px 20px', alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                <StoreValue store={localStore} selector={s => s.isFetchingRequest} property={'isBusy'}>
                    <Button title={`Pay AED ${subTotal}`} onTap={async () => {
                        await performPayment();
                    }} icon={IoCardOutline} isBusy={true} style={{fontSize: 20, padding: '15px 50px'}}
                            theme={ButtonTheme.promoted}/>
                </StoreValue>
            </div>
        </div>
    </div>
}