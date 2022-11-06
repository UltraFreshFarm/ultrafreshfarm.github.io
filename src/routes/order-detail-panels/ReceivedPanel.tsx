import {DbOrder} from "../../components/model/DbOrder";
import {DbOrderLineItems} from "../../components/model/DbOrderLineItems";
import {DbOrderConfirmation} from "../../components/model/DbOrderConfirmation";
import {DbDeliveryNote} from "../../components/model/DbDeliveryNote";
import {useCallback, useMemo} from "react";
import {useAppContext} from "../../components/useAppContext";
import {TitleValue} from "./utils/TitleValue";
import {formatDateTime} from "./utils/formatDateTime";
import {formatDeliveryNoteNo} from "./utils/formatDeliveryNoteNo";
import {Button} from "../../components/page-components/Button";
import {IoClose, IoOpenOutline, IoSave} from "react-icons/io5";
import {supabase} from "../../components/supabase";
import invariant from "tiny-invariant";
import {ButtonTheme} from "../Theme";
import {FaTruck} from "react-icons/fa";
import {OrderDispatchDetail} from "./DispatchPanel";
import {Input} from "../../components/page-components/Input";
import {StoreValue, useCreateStore} from "../../components/store/useCreateStore";
import {produce} from "immer";
import {isNotEmptyText} from "../Shipping";
import {DbReceivedNote} from "../../components/model/DbReceivedNote";

export function ReceivedPanel(props: { order: DbOrder | null, orderLineItems: DbOrderLineItems[], confirmations: DbOrderConfirmation[], deliveryNotes: DbDeliveryNote[],receivedNotes:DbReceivedNote[], refresh: () => void }) {
    let {orderLineItems, order, confirmations, deliveryNotes,receivedNotes, refresh} = props;
    confirmations = useMemo(() => confirmations.filter(cf => deliveryNotes.map(di => di.order_confirmation).includes(cf.id)), [confirmations, deliveryNotes]);
    const {showModal} = useAppContext();
    return <div style={{display: 'flex', flexDirection: 'column', paddingBottom: 50}}>
        <div style={{display: 'flex', flexDirection: 'column', padding: '10px 20px 0px 20px'}}>
            <div style={{display: 'flex', marginBottom: 10}}>
                <TitleValue title={'City'} value={order === null ? undefined : order?.shipping_city}
                            style={{containerStyle: {width: '50%'}}}/>
                <TitleValue title={'State'} value={order === null ? undefined : order?.shipping_state}
                            style={{containerStyle: {width: '50%'}}}/>
            </div>

            <TitleValue title={'Address'}
                        value={order === null ? undefined : order?.shipping_address_line_one + '' + order?.shipping_address_line_two}
                        style={{containerStyle: {marginBottom: 10}}}
            />


            <TitleValue title={'Receiver'}
                        value={order === null ? undefined : order?.shipping_receiver_first_name + ' ' + order?.shipping_receiver_last_name}
                        style={{containerStyle: {marginBottom: 10}}}
            />


            <TitleValue title={'Phone'} value={order?.shipping_receiver_phone}
                        style={{containerStyle: {marginBottom: 10}}}/>

        </div>
        {confirmations.map(confirmation => {
            const deliveryNote = deliveryNotes.find(dn => dn.order_confirmation === confirmation.id);
            invariant(deliveryNote);
            const receivedNote = receivedNotes.find(rn => rn.order_delivery_note === deliveryNote.id);
            const hasReceivedNote = receivedNote !== null && receivedNote !== undefined;

            return <div key={confirmation.id}
                        style={{display: 'flex', flexDirection: 'column', padding: '0px 20px 30px 20px'}}>
                <div style={{display: 'flex', marginBottom: 10}}>
                    <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                        <TitleValue title={'Delivery No'}
                                    value={order === null ? undefined : formatDeliveryNoteNo(deliveryNote)}
                                    style={{containerStyle: {marginBottom: 10}}}/>
                        <TitleValue title={'Delivery Time'}
                                    value={order === null ? undefined : formatDateTime(deliveryNote.created_at)}/>
                    </div>
                    {hasReceivedNote &&
                        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                            <TitleValue title={'Received No'}
                                        value={order === null ? undefined : formatDeliveryNoteNo(deliveryNote)}
                                        style={{containerStyle: {marginBottom: 10}}}/>
                            <TitleValue title={'Received Time'}
                                        value={order === null ? undefined : formatDateTime(receivedNote.created_at)}/>
                        </div>
                    }
                </div>
                <div style={{display: 'flex'}}>
                    <Button title={'View Detail'} icon={IoOpenOutline} style={{fontSize: 14, flexGrow: 1}}
                            onTap={async () => {
                                let {data: confirmationLineItems} = await supabase.from('order_confirmation_line_items').select('*').eq('order_confirmation', confirmation.id);
                                const result = await showModal(closePanel => {
                                    invariant(order);
                                    return <OrderDispatchDetail closePanel={closePanel} order={order}
                                                                orderLineItems={orderLineItems}
                                                                confirmation={confirmation}
                                                                confirmationLineItems={confirmationLineItems ?? []}/>
                                })
                            }} theme={ButtonTheme.danger}/>
                    {!hasReceivedNote &&
                        <Button title={'Receive Items'} icon={FaTruck}
                                style={{marginLeft: 10, fontSize: 14, flexGrow: 1}}
                                onTap={async () => {
                                    const result = await showModal(closePanel => {
                                        return <ReceiverInformation closePanel={closePanel}/>
                                    });
                                    if(result === false){
                                        return;
                                    }
                                    const {receiverName,emiratesId} = (result as {receiverName:string,emiratesId:string});
                                    await supabase.from('order_received_notes').insert({
                                        order_delivery_note: deliveryNote.id,
                                        receiver_name: receiverName,
                                        receiver_note:'Receiver Emirates ID : '+emiratesId
                                    }).select();
                                    const orderStatus = order?.order_status ?? '';

                                    const nextOrderStatus = orderStatus === 'Dispatched' ? 'Delivered' : orderStatus === 'Send' ? 'Received' : orderStatus;
                                    await supabase.from('orders').update({order_status: nextOrderStatus}).eq('id', order?.id);
                                    refresh();
                                }} theme={ButtonTheme.promoted}/>
                    }
                </div>
            </div>
        })}
    </div>
}
const errors:any = {};
function ReceiverInformation(props: { closePanel: (param: any) => void }) {
    const {closePanel} = props;
    const localStore = useCreateStore({receiverName: '', emiratesId: '',errors});
    const validate = useCallback(() => {
        localStore.setState(produce(draft => {
            draft.errors.emiratesId = draft.emiratesId === '' ? 'Emirates id is required' : '';
            draft.errors.receiverName = draft.receiverName === '' ? 'Receiver name is required' : '';
        }));
        const hasError = Object.keys(localStore.stateRef.current.errors).reduce((hasError,key) => {
            return hasError || isNotEmptyText(localStore.stateRef.current.errors[key])
        },false);
        return !hasError;
    },[localStore])
    return <div style={{
        width: 300,
        background: 'rgba(255,255,255,0.9)',
        borderRadius: 10,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(0,0,0,0.1)'
    }}>
        <div style={{padding: 10}}>Please enter the recipient's name and emirates identification number.</div>
        <StoreValue store={localStore} selector={[s => s.receiverName,s => s.errors.receiverName]} property={['value','error']}>
            <Input title={'Receiver Name'} inputMode={'text'} placeholder={'Please enter receiver name'} onChange={(e) => {
                localStore.setState(produce(draft => {
                    draft.receiverName = e.target.value;
                    draft.errors.receiverName = e.target.value === '' ? 'Receiver name is required' : '';
                }))
            }}/>
        </StoreValue>
        <StoreValue store={localStore} selector={[s => s.emiratesId,s => s.errors.emiratesId]} property={['value','error']}>
            <Input title={'Receiver Emirates ID'} inputMode={'text'} placeholder={'Please enter emirates id'}
                   style={{containerStyle: {marginBottom: 10}}} onChange={(e) => {
                localStore.setState(produce(draft => {
                    draft.emiratesId = e.target.value;
                    draft.errors.emiratesId = e.target.value === '' ? 'Emirates ID is required' : '';
                }))
            }}/>
        </StoreValue>
        <div style={{display: 'flex'}}>
            <Button title={'Close'} icon={IoClose} onTap={() => closePanel(false)} style={{flexGrow: 1}} theme={ButtonTheme.danger}/>
            <Button title={'Save'} icon={IoSave} onTap={() => {
                if(validate()){
                    closePanel(localStore.stateRef.current)
                }
            }} style={{flexGrow: 1, marginLeft: 10}}
                    theme={ButtonTheme.promoted}/>
        </div>
    </div>
}