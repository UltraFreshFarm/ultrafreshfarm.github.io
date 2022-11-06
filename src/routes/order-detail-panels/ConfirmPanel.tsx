import {DbOrder} from "../../components/model/DbOrder";
import {DbOrderLineItems} from "../../components/model/DbOrderLineItems";
import {DbOrderConfirmation} from "../../components/model/DbOrderConfirmation";
import {useAppContext} from "../../components/useAppContext";
import {motion} from "framer-motion";
import {TitleValue} from "./utils/TitleValue";
import {formatDateTime} from "./utils/formatDateTime";
import {Button} from "../../components/page-components/Button";
import {IoCheckmarkCircleOutline, IoClose, IoOpenOutline, IoRemoveCircleOutline} from "react-icons/io5";
import {ButtonTheme} from "../Theme";
import {supabase} from "../../components/supabase";
import invariant from "tiny-invariant";
import {AcknowledgementNotePanel} from "./modal/AcknowledgementNotePanel";
import {BsPatchCheckFill} from "react-icons/bs";
import {formatConfirmationNo} from "./utils/formatConfirmationNo";
import {DbOrderConfirmationLineItems} from "../../components/model/DbOrderConfirmationLineItems";

export function ConfirmPanel(props: { order: DbOrder | null, orderLineItems: DbOrderLineItems[], confirmations: DbOrderConfirmation[],refresh:() => void }) {
    const appContext = useAppContext();
    const {order, orderLineItems, confirmations,refresh} = props;
    return <div style={{display: 'flex', flexDirection: 'column', paddingBottom: 50}}>
        {confirmations.map(c => {
            return <motion.div key={c.id} style={{
                padding: '5px 20px',
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{display: 'flex'}}>
                    <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                        <div style={{display: 'flex',paddingTop:5}}>
                            <div style={{display: 'flex', flexDirection: 'column',flexGrow:1}}>
                                <TitleValue title={'Confirmation No'} value={order === null ? undefined : formatConfirmationNo(c)} style={{containerStyle:{marginBottom:10}}}/>
                                <TitleValue title={'Recorded at'} value={order === null ? undefined :formatDateTime(c.created_at)} style={{containerStyle:{marginBottom:10}}}/>
                            </div>
                            <div style={{width:120,display:'flex',flexDirection:'column',paddingTop:10}}>
                                <Button title={'Detail'} style={{fontSize:14}} theme={ButtonTheme.promoted} icon={IoOpenOutline} onTap={async () => {
                                    invariant(order);
                                    let {data} = await supabase.from('order_confirmation_line_items').select('*').eq('order_confirmation(id)', c.id);
                                    let confirmedLineItems:DbOrderConfirmationLineItems[] = data ?? [];
                                    let itemsToDisplay = orderLineItems;
                                    if(c.status !== 'Complete'){
                                        itemsToDisplay = itemsToDisplay.filter(oli => oli.requested_amount !== oli.fulfilled_amount)
                                    }else{
                                        confirmedLineItems = confirmedLineItems.filter(cli => cli.amount_fulfilled > 0 || cli.unable_to_fulfill);
                                        const oliIds = confirmedLineItems.map(cli => cli.order_line_item);
                                        itemsToDisplay = itemsToDisplay.filter(i => oliIds.includes(i.id ?? -1));
                                    }
                                    const shouldRefresh = await appContext.showModal(closePanel => {
                                        return <AcknowledgementNotePanel closePanel={closePanel} order={order}
                                                                         orderLineItems={itemsToDisplay}
                                                                         confirmation={c}
                                                                         confirmationLineItems={confirmedLineItems ?? []}
                                        />
                                    });
                                    if(shouldRefresh){
                                        refresh();
                                    }

                                }}/>
                                {c.status !== 'Complete' &&
                                <Button title={'Delete'} style={{fontSize:14,marginTop:7}} icon={IoRemoveCircleOutline} onTap={async () => {
                                    const deleteItem = await appContext.showModal(closePanel => {
                                        return <div style={{
                                            background: 'rgba(255,255,255,0.9)',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            borderRadius: 10,
                                            padding: 10,
                                            margin: 10,
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            <div style={{marginBottom: 10}}>Are you sure you want to delete this order
                                                confirmation draft ?
                                            </div>
                                            <div style={{display: 'flex'}}>
                                                <div style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
                                                    <Button onTap={() => closePanel(false)} title={'Cancel'}
                                                            icon={IoClose} theme={ButtonTheme.danger}/>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    width: '50%',
                                                    marginLeft: 10
                                                }}>
                                                    <Button onTap={() => closePanel(true)} title={'Yes '}
                                                            icon={IoCheckmarkCircleOutline} theme={ButtonTheme.promoted}/>
                                                </div>
                                            </div>
                                        </div>
                                    });
                                    if (deleteItem) {
                                        await supabase.from('order_confirmation_line_items').delete().eq('order_confirmation', c.id);
                                        await supabase.from('order_confirmations').delete().eq('id', c.id);
                                        refresh();
                                    }
                                }} theme={ButtonTheme.danger}/>}
                            </div>
                        </div>
                        <div style={{display: 'flex'}}>
                            <TitleValue title={'Confirmed by'} value={order === null ? undefined :c.confirmed_by} style={{containerStyle:{flexGrow:1,marginBottom:10}}} />
                            <TitleValue title={'Status'} value={order === null ? undefined :c.status ?? 'N/A'} style={{containerStyle:{width:120}}}/>
                        </div>
                    </div>


                </div>

            </motion.div>
        })}
        {['Placed', 'Acknowledge'].indexOf(order?.order_status ?? '') >= 0 &&
            <Button title={'Create Acknowledgement Note'} icon={BsPatchCheckFill} onTap={async () => {
                invariant(order);
                const {data: confirmation} = await supabase.from('order_confirmations').insert({
                    order: order.id,
                    confirmed_by: appContext.user?.phone,
                    status: 'Draft'
                }).select().single();
                const {data: confirmedLineItems} = await supabase.from('order_confirmation_line_items').insert(orderLineItems.map(oli => {
                    return {
                        order_confirmation: confirmation.id,
                        order_line_item: oli.id,
                        amount_fulfilled: 0
                    };
                })).select();

                let itemsToDisplay = orderLineItems;
                itemsToDisplay = itemsToDisplay.filter(oli => oli.requested_amount !== oli.fulfilled_amount)

                await appContext.showModal(closePanel => {
                    return <AcknowledgementNotePanel closePanel={closePanel} order={order}
                                                     orderLineItems={itemsToDisplay}
                                                     confirmation={confirmation}
                                                     confirmationLineItems={confirmedLineItems ?? []}
                    />
                });
                refresh();
            }} style={{margin: 10}} theme={ButtonTheme.promoted}/>}
    </div>
}