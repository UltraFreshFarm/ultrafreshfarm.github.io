import {DbOrderConfirmation} from "../../../components/model/DbOrderConfirmation";

export function formatConfirmationNo(confirmation: DbOrderConfirmation) {
    if (confirmation === null) {
        return '';
    }
    if (confirmation.created_at === undefined || confirmation.id === undefined) {
        return '';
    }
    const date = new Date(confirmation.created_at);
    return `CN-${confirmation.id.toString().padStart(6, '0')}-${date.getDate().toString().padStart(2, '0')}${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}
