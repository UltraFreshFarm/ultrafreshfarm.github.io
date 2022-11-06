import {DbOrder} from "../../components/model/DbOrder";
import {DbOrderLineItems} from "../../components/model/DbOrderLineItems";
import {DbOrderConfirmation} from "../../components/model/DbOrderConfirmation";
import {useMemo} from "react";
import {TitleValue} from "./utils/TitleValue";
import {formatDateTime} from "./utils/formatDateTime";
import {Button} from "../../components/page-components/Button";
import {FaTruck} from "react-icons/fa";
import {ButtonTheme} from "../Theme";
import {useAppContext} from "../../components/useAppContext";
import {IoClose, IoOpenOutline} from "react-icons/io5";
import {formatConfirmationNo} from "./utils/formatConfirmationNo";
import invariant from "tiny-invariant";
import {DbOrderConfirmationLineItems} from "../../components/model/DbOrderConfirmationLineItems";
import {supabase} from "../../components/supabase";
import {DbDeliveryNote} from "../../components/model/DbDeliveryNote";
import {formatDeliveryNoteNo} from "./utils/formatDeliveryNoteNo";
import {HeaderClose} from "../../components/page-components/HeaderClose";

export function DispatchPanel(props: { order: DbOrder | null, orderLineItems: DbOrderLineItems[], confirmations: DbOrderConfirmation[], deliveryNotes: DbDeliveryNote[],refresh:() => void }) {
    let {orderLineItems, order, confirmations, deliveryNotes,refresh} = props;
    confirmations = useMemo(() => confirmations.filter(cf => cf.status === 'Complete'), [confirmations]);
    const {showModal, user} = useAppContext();
    return <div style={{display: 'flex', flexDirection: 'column',paddingBottom:50}}>
        <div style={{display: 'flex', flexDirection: 'column', padding: '10px 20px 0px 20px'}}>
            <div style={{display: 'flex',marginBottom:10}}>
                <TitleValue title={'City'} value={order === null ? undefined :order?.shipping_city} style={{containerStyle:{width:'50%'}}}/>
                <TitleValue title={'State'} value={order === null ? undefined :order?.shipping_state} style={{containerStyle:{width:'50%'}}}/>
            </div>

            <TitleValue title={'Address'}
                        value={order === null ? undefined :order?.shipping_address_line_one + '' + order?.shipping_address_line_two}
                        style={{containerStyle:{marginBottom:10}}}
            />


            <TitleValue title={'Receiver'}
                        value={order === null ? undefined :order?.shipping_receiver_first_name + ' ' + order?.shipping_receiver_last_name}
                        style={{containerStyle:{marginBottom:10}}}
            />


            <TitleValue title={'Phone'} value={order?.shipping_receiver_phone} style={{containerStyle:{marginBottom:10}}}/>

        </div>
        {confirmations.map(confirmation => {
            const deliveryNote = deliveryNotes.find(dn => dn.order_confirmation === confirmation.id);
            const hasDeliveryNote = deliveryNote !== null && deliveryNote !== undefined;
            return <div key={confirmation.id} style={{display: 'flex', flexDirection: 'column', padding: '0px 20px 30px 20px'}}>
                <div style={{display: 'flex',marginBottom:10}}>
                    <div style={{display: 'flex', flexDirection: 'column',flexGrow:1}}>
                        <TitleValue title={'Confirmation No'} value={order === null ? undefined :formatConfirmationNo(confirmation)} style={{containerStyle:{marginBottom:10}}}/>
                        <TitleValue title={'Confirmation Time'} value={order === null ? undefined :formatDateTime(confirmation.created_at)}/>
                    </div>
                    {hasDeliveryNote &&
                        <div style={{display: 'flex', flexDirection: 'column',flexGrow:1}}>
                            <TitleValue title={'Delivery No'} value={order === null ? undefined :formatDeliveryNoteNo(deliveryNote)} style={{containerStyle:{marginBottom:10}}}/>
                            <TitleValue title={'Delivery Time'} value={order === null ? undefined :formatDateTime(deliveryNote.created_at)}/>
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
                    {!hasDeliveryNote &&
                        <Button title={'Deliver Items'} icon={FaTruck}
                                style={{marginLeft: 10, fontSize: 14, flexGrow: 1}}
                                onTap={async () => {
                                    await supabase.from('order_delivery_notes').insert({
                                        captain: user?.phone,
                                        order_confirmation: confirmation.id,
                                        note: ''
                                    }).select();
                                    const orderStatus = order?.order_status ?? '';
                                    const nextOrderStatus = orderStatus === 'Confirmed' ? 'Dispatched' : orderStatus === 'Acknowledge' ? 'Send' : orderStatus;
                                    await supabase.from('orders').update({order_status: nextOrderStatus}).eq('id', order?.id);
                                    refresh();
                                }} theme={ButtonTheme.promoted}/>
                    }
                </div>
            </div>
        })}
    </div>
}

export function OrderDispatchDetail(props: { confirmation: DbOrderConfirmation, confirmationLineItems: DbOrderConfirmationLineItems[], order: DbOrder, orderLineItems: DbOrderLineItems[], closePanel: (param: any) => void }) {
    const {order, orderLineItems, confirmation, closePanel, confirmationLineItems} = props;

    const {appDimension} = useAppContext();


    return <div style={{
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: '10px 0px 10px 0px',
        boxSizing: 'border-box',
        height: '100%',
        width: appDimension.width,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
    }}>

        <HeaderClose onClose={() =>{closePanel(false)}}>
            <div style={{
                display: 'flex',
                flexGrow:1,
                marginTop:30,
                padding:10,
                flexDirection: 'column',
            }}>
                <div style={{fontSize: 22}}>Items to be dispatched</div>
                <div>Reference No : {formatConfirmationNo(confirmation)}</div>
            </div>
        </HeaderClose>

        <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'auto'}}>
        {confirmationLineItems.filter(cli => cli.amount_fulfilled > 0).map((cli, index) => {
            const item = orderLineItems.find(oli => oli.id === cli.order_line_item);
            invariant(item);
            return <div key={cli.id}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '10px 20px 10px 20px',
                            borderBottom: '1px solid rgba(0,0,0,0.1)'
                        }}>
                <div style={{display: 'flex'}}>

                    <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                        <div style={{
                            fontSize: 18,
                            marginBottom: 5
                        }}>{item.category} {item.name} {item.unit} {item.unit_type}</div>
                        <div style={{display: "flex"}}>
                            <div style={{flexGrow: 1}}>{cli.amount_fulfilled} x AED {item.price}</div>
                            <div
                                style={{fontWeight: 'bold'}}>AED {(cli.amount_fulfilled * item.price).toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </div>
        })}
        </div>

    </div>
}