import {DbOrder} from "../../../components/model/DbOrder";
import {DbOrderLineItems} from "../../../components/model/DbOrderLineItems";
import {DbOrderConfirmation} from "../../../components/model/DbOrderConfirmation";
import {DbOrderConfirmationLineItems} from "../../../components/model/DbOrderConfirmationLineItems";
import {useAppContext} from "../../../components/useAppContext";
import {StoreValue, useCreateStore} from "../../../components/store/useCreateStore";
import {useCallback} from "react";
import {produce} from "immer";
import {isNotEmptyText} from "../../Shipping";
import invariant from "tiny-invariant";
import {motion} from "framer-motion";
import {ShouldDisplay} from "../utils/ShouldDisplay";
import {HiOutlineEmojiHappy, HiOutlineEmojiSad} from "react-icons/hi";
import {Input} from "../../../components/page-components/Input";
import {Button} from "../../../components/page-components/Button";
import {IoClose} from "react-icons/io5";
import {supabase} from "../../../components/supabase";
import {BsPatchCheckFill} from "react-icons/bs";
import {ButtonTheme, green, red} from "../../Theme";

const errors: any = {};

export function AcknowledgementNotePanel(props: {
    order: DbOrder,
    orderLineItems: DbOrderLineItems[],
    closePanel: (result: any) => void,
    confirmation: DbOrderConfirmation,
    confirmationLineItems: DbOrderConfirmationLineItems[]
}) {
    const {orderLineItems, order, confirmation, confirmationLineItems, closePanel} = props;
    const {user, appDimension} = useAppContext();
    const isComplete = confirmation.status === 'Complete';
    const localStore = useCreateStore({
        order,
        orderLineItems,
        confirmation,
        confirmationLineItems,
        errors
    });
    const validate = useCallback(() => {
        localStore.setState(produce(state => {
            for (const confirmationLineItem of state.confirmationLineItems) {
                if (confirmationLineItem.unable_to_fulfill) {
                    if (!isNotEmptyText(confirmationLineItem.reason_unable_to_fulfill)) {
                        state.errors[confirmationLineItem.id.toString()] = 'Item must have reason why it cannot be fulfilled';
                    } else {
                        state.errors[confirmationLineItem.id.toString()] = '';
                    }
                } else {
                    const amountToBeFulfilled = confirmationLineItem.amount_fulfilled;
                    const orderLineItem = state.orderLineItems.find(oli => oli.id === confirmationLineItem.order_line_item);
                    if(orderLineItem === undefined){
                        state.errors[confirmationLineItem.id.toString()] = ''
                    }else if (amountToBeFulfilled <= 0 && (orderLineItem.requested_amount - orderLineItem.fulfilled_amount) > 0) {
                        state.errors[confirmationLineItem.id.toString()] = 'Item must have value';
                    } else if (amountToBeFulfilled > ((orderLineItem?.requested_amount ?? 0) - (orderLineItem?.fulfilled_amount ?? 0))) {
                        state.errors[confirmationLineItem.id.toString()] = 'Quantity exceed requested quantity'
                    } else {
                        state.errors[confirmationLineItem.id.toString()] = ''
                    }
                }
            }
        }));
        const errors = localStore.stateRef.current.errors;
        const hasErrors = Object.keys(errors).reduce((hasError, key) => {
            return hasError || errors[key].length > 0
        }, false);
        return !hasErrors;

    }, [localStore]);
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
        <div style={{display: 'flex', flexDirection: 'row-reverse', margin: 10}}>
            <motion.div style={{fontSize: 36}} whileTap={{scale: 0.95}}
                        onTap={() => closePanel(false)}>
                <IoClose/>
            </motion.div>
            <div style={{fontSize: 22,flexGrow:1,padding:10,marginTop:30}}>Requested
                Items
            </div>
        </div>


        <div style={{display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto'}}>
            {orderLineItems.map(oli => {

                return <div key={oli.id}
                            style={{
                                padding: '5px 0px 5px 0px',
                                borderBottom: '1px solid rgba(0,0,0,0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                    <div style={{display: 'flex', flexDirection: 'row', padding: '5px 20px'}}>
                        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, fontSize: 14}}>
                            <div style={{marginBottom:5}}>{oli.barcode}</div>
                            <div style={{marginBottom:5}}>{oli.category} {oli.name}</div>
                            <div>{oli.unit} {oli.unit_type}</div>
                        </div>

                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{fontSize: 12}}>Requested</div>
                            <div style={{fontSize: 30, fontWeight: 'bold', textAlign: 'right'}}>
                                {oli.requested_amount}
                            </div>
                        </div>

                    </div>
                    <div style={{display: 'flex',margin:'0px 10px'}}>
                        <motion.div style={{display: 'flex', flexDirection: 'column', marginRight: 0}}
                                    whileTap={{scale: 0.9}} onTap={() => {
                            localStore.setState(produce(draft => {
                                const confirmationLineItem = draft.confirmationLineItems.find(cli => cli.order_line_item === oli.id);
                                invariant(confirmationLineItem);
                                confirmationLineItem.unable_to_fulfill = !confirmationLineItem.unable_to_fulfill;
                            }))
                        }}>
                            <div style={{
                                fontSize: 36,
                                marginLeft: 10,
                                marginTop: 15,
                                fontWeight: 'bold',
                                textAlign: 'right'
                            }}>
                                <StoreValue store={localStore} selector={s => {
                                    return s.confirmationLineItems.find(cli => cli.order_line_item === oli.id)?.unable_to_fulfill !== true
                                }} property={'value'}>
                                    <ShouldDisplay>
                                        <HiOutlineEmojiHappy style={{color:green}}/>
                                    </ShouldDisplay>
                                </StoreValue>
                                <StoreValue store={localStore} selector={s => {
                                    return s.confirmationLineItems.find(cli => cli.order_line_item === oli.id)?.unable_to_fulfill === true
                                }} property={'value'}>
                                    <ShouldDisplay>
                                        <HiOutlineEmojiSad style={{color:red}}/>
                                    </ShouldDisplay>
                                </StoreValue>
                            </div>
                        </motion.div>
                        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                            <StoreValue store={localStore} selector={s => {
                                const confirmationLineItem = s.confirmationLineItems.find(cli => cli.order_line_item === oli.id);
                                invariant(confirmationLineItem);
                                return confirmationLineItem.unable_to_fulfill !== true;
                            }} property={'value'}>
                                <ShouldDisplay>
                                    <StoreValue store={localStore}
                                                selector={[
                                                    s => s.confirmationLineItems.find(cli => cli.order_line_item === oli.id)?.amount_fulfilled.toString(),
                                                    s => {
                                                        const confirmationLineItem = s.confirmationLineItems.find(cli => cli.order_line_item === oli.id);
                                                        return s.errors[confirmationLineItem?.id.toString() ?? '']
                                                    }
                                                ]}
                                                property={['value', 'error']}>
                                        <Input title={'Quantity fulfilled'} type={'number'}
                                               inputMode={'numeric'}
                                               disabled={isComplete}
                                               placeholder={'Enter total items can be fulfilled'}
                                               style={{containerStyle: {borderBottom: 'none'}}}
                                               onChange={(e) => {
                                                   localStore.setState(produce(draft => {
                                                       const index = draft.confirmationLineItems.findIndex(cli => cli.order_line_item === oli.id);
                                                       const amountToBeFulfilled = parseInt(e.target.value || '0');
                                                       draft.confirmationLineItems[index].amount_fulfilled = amountToBeFulfilled;

                                                       if (amountToBeFulfilled <= 0 && (oli.requested_amount - oli.fulfilled_amount) > 0) {
                                                           draft.errors[draft.confirmationLineItems[index].id.toString()] = 'Item must have value or mark as unable to fulfill';
                                                       } else if (amountToBeFulfilled > (oli.requested_amount - oli.fulfilled_amount)) {
                                                           draft.errors[draft.confirmationLineItems[index].id.toString()] = 'Quantity exceed requested quantity'
                                                       } else {
                                                           draft.errors[draft.confirmationLineItems[index].id.toString()] = ''
                                                       }

                                                   }))
                                               }}
                                        />
                                    </StoreValue>
                                </ShouldDisplay>
                            </StoreValue>

                            <StoreValue store={localStore} selector={s => {
                                const confirmationLineItem = s.confirmationLineItems.find(cli => cli.order_line_item === oli.id);
                                invariant(confirmationLineItem);
                                return confirmationLineItem.unable_to_fulfill === true;
                            }} property={'value'}>
                                <ShouldDisplay>
                                    <StoreValue store={localStore}
                                                selector={[
                                                    s => s.confirmationLineItems.find(cli => cli.order_line_item === oli.id)?.reason_unable_to_fulfill,
                                                    s => {
                                                        const confirmationLineItem = s.confirmationLineItems.find(cli => cli.order_line_item === oli.id);
                                                        return s.errors[confirmationLineItem?.id.toString() ?? '']
                                                    }
                                                ]}
                                                property={['value', 'error']}>
                                        <Input title={'Reason why it cannot be fulfilled'} type={'text'}
                                               inputMode={'text'}
                                               placeholder={'Enter reason why it cannot be fulfilled'}
                                               style={{containerStyle: {borderBottom: 'none'}}}
                                               disabled={isComplete}
                                               onChange={(e) => {
                                                   localStore.setState(produce(draft => {
                                                       const index = draft.confirmationLineItems.findIndex(cli => cli.order_line_item === oli.id);
                                                       draft.confirmationLineItems[index].reason_unable_to_fulfill = e.target.value;
                                                       if (!isNotEmptyText(e.target.value)) {
                                                           draft.errors[draft.confirmationLineItems[index].id.toString()] = 'Reason for not being able to be fulfilled must have value';
                                                       } else {
                                                           draft.errors[draft.confirmationLineItems[index].id.toString()] = ''
                                                       }
                                                   }))
                                               }}
                                        />
                                    </StoreValue>
                                </ShouldDisplay>
                            </StoreValue>
                        </div>
                        {!isComplete &&
                            <motion.div
                                style={{display: 'flex', flexDirection: 'column', marginRight: 15, marginTop: 5}}
                                whileTap={{scale: 0.98}}
                                onTap={() => {
                                    localStore.setState(produce(draft => {
                                        const index = draft.confirmationLineItems.findIndex(cli => cli.order_line_item === oli.id);
                                        draft.confirmationLineItems[index].amount_fulfilled = oli.requested_amount - oli.fulfilled_amount;
                                        draft.errors[draft.confirmationLineItems[index].id.toString()] = '';
                                    }));
                                }}>
                                <div style={{fontSize: 12}}>Remaining</div>
                                <div style={{fontSize: 30, fontWeight: 'bold', textAlign: 'right'}}>
                                    {oli.requested_amount - oli.fulfilled_amount}
                                </div>
                            </motion.div>
                        }
                    </div>
                </div>
            })}
        </div>
        <div style={{display: 'flex', padding: '5px 10px 0px 10px'}}>

            {!isComplete &&
                <div style={{display: 'flex', flexDirection: 'column', marginTop: 5, marginLeft: 10, flexGrow: 1}}>
                    <Button title={'Confirm'} onTap={async () => {
                        if (validate()) {
                            const confirmationLineItems = localStore.stateRef.current.confirmationLineItems;
                            await supabase.from('order_confirmation_line_items').upsert(confirmationLineItems).select();
                            await supabase.from('order_confirmations').update({status: 'Complete'}).eq('id', confirmation.id);
                            let orderLineItems = localStore.stateRef.current.orderLineItems;
                            let allComplete = true;
                            orderLineItems = orderLineItems.map(oli => ({...oli}));
                            orderLineItems.forEach(oli => {
                                const confirmedLineItem = confirmationLineItems.find(cli => cli.order_line_item === oli.id);
                                oli.fulfilled_amount = (oli.fulfilled_amount ?? 0) + (confirmedLineItem?.amount_fulfilled ?? 0);
                                allComplete = allComplete && (oli.fulfilled_amount === oli.requested_amount);
                            });
                            await supabase.from('order_line_items').upsert(orderLineItems).select();
                            await supabase.from('orders').update({order_status: allComplete ? 'Confirmed' : 'Acknowledge'}).eq('id', order.id);
                            props.closePanel(true)
                        }

                    }} icon={BsPatchCheckFill} theme={ButtonTheme.promoted}/>
                </div>
            }
        </div>
    </div>
}