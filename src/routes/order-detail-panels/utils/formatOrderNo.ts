import {DbOrder} from "../../../components/model/DbOrder";

export function formatOrderNo(order: DbOrder|null) {
    if(order === null){
        return '';
    }
    if(order.created_at === undefined || order.id === undefined){
        return '';
    }
    const date = new Date(order.created_at);
    return `PO-${order.id.toString().padStart(6,'0')}-${date.getDate().toString().padStart(2,'0')}${(date.getMonth() + 1).toString().padStart(2,'0')}`;
}
