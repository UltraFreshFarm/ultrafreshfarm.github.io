import {Header} from "../components/page-components/Header";
import {RouteProps} from "../components/useRoute";
import {formatDateTime} from "./order-detail-panels/utils/formatDateTime";
import {useCallback, useEffect, useState} from "react";
import {supabase} from "../components/supabase";
import {DbOrder} from "../components/model/DbOrder";
import {DbOrderLineItems} from "../components/model/DbOrderLineItems";
import {SkeletonBox} from "../components/page-components/SkeletonBox";
import {DbOrderConfirmation} from "../components/model/DbOrderConfirmation";
import {produce} from "immer";
import {TitleValue} from "./order-detail-panels/utils/TitleValue";
import {OrderDetailFooter} from "./order-detail-panels/utils/OrderDetailFooter";
import {ConfirmPanel} from "./order-detail-panels/ConfirmPanel";
import {OrderPanel} from "./order-detail-panels/OrderPanel";
import {DispatchPanel} from "./order-detail-panels/DispatchPanel";
import {ReceivedPanel} from "./order-detail-panels/ReceivedPanel";
import {formatOrderNo} from "./order-detail-panels/utils/formatOrderNo";
import {DbDeliveryNote} from "../components/model/DbDeliveryNote";
import {DbReceivedNote} from "../components/model/DbReceivedNote";

export default function OrderDetail(props: RouteProps) {
    const orderId = props.params.get('id');
    const [order, setOrder] = useState<DbOrder | null>(null);
    const [orderLineItems, setOrderLineItems] = useState<DbOrderLineItems[]>([]);
    const [selectedPage, setSelectedPage] = useState('order');
    const [confirmations, setConfirmations] = useState<DbOrderConfirmation[]>([]);
    const [deliveryNotes,setDeliveryNotes] = useState<DbDeliveryNote[]>([]);
    const [receivedNotes,setReceivedNotes] = useState<DbReceivedNote[]>([]);

    const refresh = useCallback(() => {
        setOrder(null);
        (async () => {
            const {data: order} = await supabase.from('orders').select('*').eq('id', orderId).single();
            const {data: lineItems} = await supabase.from('order_line_items').select('*').eq('order(id)', order.id);
            const {data: orderConfirmations} = await supabase.from('order_confirmations').select('*').eq('order(id)', order?.id);
            const {data: deliveryNotes} = await supabase.from('order_delivery_notes').select('*').filter('order_confirmation','in',`(${orderConfirmations?.map(oc => oc.id).join(',')})`);
            const {data: receivedNotes} = await supabase.from('order_received_notes').select('*').filter('order_delivery_note','in',`(${deliveryNotes?.map(dn => dn.id).join(',')})`);
            setOrderLineItems(lineItems ?? []);
            setConfirmations(orderConfirmations ?? []);
            setDeliveryNotes(deliveryNotes??[]);
            setReceivedNotes(receivedNotes??[]);
            setOrder(order);
        })();
    },[orderId])
    useEffect(() => refresh(), [orderId]);

    return <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Header title={<SkeletonBox skeletonVisible={order === null}
                                    style={{flexGrow: 1}}>{`Order : ${formatOrderNo(order)}`}</SkeletonBox>}/>
        <div style={{padding: '10px 20px', borderBottom: '1px solid rgba(0,0,0,0.1)'}}>
            <div style={{display: 'flex',marginBottom:10}}>
                <TitleValue title={'Order Date'} value={order && formatDateTime(order?.created_at)}  style={{containerStyle:{flexGrow:1}}}/>
                <TitleValue title={'Order Status'} value={order?.order_status} style={{containerStyle:{width:120}}}/>
            </div>
            <TitleValue title={'Sub total'} value={order && `AED ${order?.sub_total}`} style={{containerStyle:{flexGrow:1}}}/>
        </div>
        <div style={{
            height: '100%',
            display: 'flex',
            overflow: 'auto',
            flexDirection: 'column'
        }}>
            {selectedPage === 'order' &&
                <OrderPanel order={order} orderLineItems={orderLineItems} refresh={refresh}/>}
            {selectedPage === 'confirm' &&
                <ConfirmPanel order={order} orderLineItems={orderLineItems} confirmations={confirmations} refresh={refresh}/>}
            {selectedPage === 'dispatch' &&
                <DispatchPanel order={order} orderLineItems={orderLineItems} confirmations={confirmations} deliveryNotes={deliveryNotes} refresh={refresh}/>}
            {selectedPage === 'received' &&
                <ReceivedPanel order={order} orderLineItems={orderLineItems} confirmations={confirmations} deliveryNotes={deliveryNotes}
                                receivedNotes={receivedNotes}
                               refresh={refresh}/>}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', position: 'absolute', bottom: 0, width: '100%'}}>
            <OrderDetailFooter value={selectedPage} onChange={setSelectedPage}/>
        </div>
    </div>
}


