import {DbDeliveryNote} from "../../../components/model/DbDeliveryNote";

export function formatDeliveryNoteNo(deliveryNote: DbDeliveryNote) {
    if (deliveryNote === null) {
        return '';
    }
    if (deliveryNote.created_at === undefined || deliveryNote.id === undefined) {
        return '';
    }
    const date = new Date(deliveryNote.created_at);
    return `DN-${deliveryNote.id.toString().padStart(6, '0')}-${date.getDate().toString().padStart(2, '0')}${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}