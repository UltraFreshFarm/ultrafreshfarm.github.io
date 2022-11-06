export interface DbOrderConfirmationLineItems {
    amount_fulfilled: number;
    created_at: string;
    id: number;
    order_confirmation: number;//4
    order_line_item: number;//33
    unable_to_fulfill: boolean;//
    reason_unable_to_fulfill: string;//
}