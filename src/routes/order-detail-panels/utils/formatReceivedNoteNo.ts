import {DbReceivedNote} from "../../../components/model/DbReceivedNote";

export function formatReceivedNoteNo(receivedNote: DbReceivedNote) {
    if (receivedNote === null) {
        return '';
    }
    if (receivedNote.created_at === undefined || receivedNote.id === undefined) {
        return '';
    }
    const date = new Date(receivedNote.created_at);
    return `RN-${receivedNote.id.toString().padStart(6, '0')}-${date.getDate().toString().padStart(2, '0')}${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}