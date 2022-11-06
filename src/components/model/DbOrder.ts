import {formatDateTime} from "../../routes/order-detail-panels/utils/formatDateTime";
import {formatOrderNo} from "../../routes/order-detail-panels/utils/formatOrderNo";

export const statusDescription = {
    'Placed': (order:DbOrder) => `The order of goods was entered into the system on ${formatDateTime(order.created_at)}.The tracking reference number for this order is ${formatOrderNo(order)}.Currently, the farm will confirm and prepare the ordered goods. After the farm confirms the list of items, the truck will deliver them to the customer\'s location the following day.`,
    'Acknowledge': (order:DbOrder) =>`The order of goods was entered into the system on ${formatDateTime(order.created_at)}.The tracking reference number for this order is ${formatOrderNo(order)}.It appears that not all items can be fulfilled by the farm; those that can be fulfilled will continue to be shipped to the customer\'s location first thing in the morning, while the remaining unfulfilled items will be refunded.`,
    'Confirmed': (order:DbOrder) =>`The order of goods was entered into the system on ${formatDateTime(order.created_at)}.The tracking reference number for this order is ${formatOrderNo(order)}. All orders have been confirmed by the farm, and they are all set to be delivered the following morning.`,
    'Send': (order:DbOrder) =>`The order of goods was entered into the system on ${formatDateTime(order.created_at)}.The tracking reference number for this order is ${formatOrderNo(order)}. Orders acknowledged by the farm are currently en route to the customer\'s location. The delivery was initiated by the truck at the crack of dawn.`,
    'Dispatched': (order:DbOrder) =>`The order of goods was entered into the system on ${formatDateTime(order.created_at)}.The tracking reference number for this order is ${formatOrderNo(order)}.The order is currently en route to the customer\'s location. The truck began its journey very early in the morning.`,
    'Delivered': (order:DbOrder) =>'The customer has received the order.',
    'Received': (order:DbOrder) =>'The customer\'s order has been delivered partially.',
    'Returned': (order:DbOrder) =>'The order has been cancelled due to one or more of the following reasons.',
}

export interface DbOrder {
    created_at?: string;//"2022-11-02T21:11:22+00:00"
    created_by: string;//"971509018075"
    id?: number;//1
    order_status: 'Placed' | 'Acknowledge' | 'Confirmed' | 'Send' | 'Dispatched' | 'Received' | 'Delivered' ;//"Placed"
    payment_amount: number;//100
    payment_date: string;//"2022-11-02"
    payment_method: string;//"visa"
    payment_reference_code: string;//"ABC-DEF-GHI"
    payment_status: string;//"complete"
    shipping_address_line_one: string;//"Marina Diamond 5 Tower"
    shipping_address_line_two: string;//"Marina Diamond 5"
    shipping_city: string;//"Dubai"
    shipping_country: string;//"UAE"
    shipping_note: string;//"Fragile !"
    shipping_receiver_first_name: string;//"Dono Kasino"
    shipping_receiver_last_name: string;//"Indro"
    shipping_receiver_phone: string;//"971509018075"
    shipping_state: string;//"Dubai"
    shipping_zipcode: string;//"61992"
    sub_total: number;//100
}
