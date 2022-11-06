
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
export function formatDateTime(dateString?: string) {
    if (dateString === undefined || dateString === null) {
        return '';
    }
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2,'0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`
}
