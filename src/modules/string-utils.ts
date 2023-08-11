import { Types } from 'aptos';
import prettyjson from 'prettyjson';
import colors from 'colors';
import { stringify } from 'querystring';

export const prettify = (
    obj: any,
    spacesPerIndent: number = 3,
    noAlign: boolean = true
): string => {
    obj = convertDatesInObject(obj);
    return colors.bold.grey('------------------------------------------------------------\n') + prettyjson.render(obj, {
        keysColor: 'grey',
        dashColor: 'brightWhite',
        stringColor: 'green',
        numberColor: 'blue',
        noAlign,
        defaultIndentation: spacesPerIndent,
        emptyArrayMsg: colors.bold.yellow('[]'),
    }) + colors.bold.grey('\n------------------------------------------------------------');
}

export const stringifyResponse = (
    t: Types.UserTransaction,
    spacesPerIndent: number = 3,
    colorize: boolean = true,
): string => {
    const { hash, sender, success, payload, events, vm_status } = t;
    const obj = { hash, sender, success, payload, events, vm_status };
    if (colorize) {
        return prettify(obj, spacesPerIndent);
    } else {
        return JSON.stringify(obj, null, spacesPerIndent);
    }
}

export const prettyPrint = (
    t: Types.UserTransaction,
    spacesPerIndent: number = 3,
    colorize: boolean = true,
) => {
    console.log(stringifyResponse(t, spacesPerIndent, colorize));
    console.log();
}

export const stringifyView = (
    v: any,
    spacesPerIndent: number = 3,
    colorize: boolean = true,
): string => {
    if (colorize) {
        return prettify(v, spacesPerIndent);
    } else {
        return JSON.stringify(v, null, spacesPerIndent);
    }
}

export const prettyView = (
    v: any,
    spacesPerIndent: number = 3,
    colorize: boolean = true,
) => {
    console.log(stringifyView(v, spacesPerIndent, colorize));
    console.log();
}

export function formatDateToLocalString(date: Date): string {
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const hours = Math.abs(Math.floor(offset / 60));
    const minutes = Math.abs(offset % 60);
    const timezone = `GMT ${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    // Example: "Aug 10, 2023, 7:40:13 PM GMT -07:00"
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}, ${date.toLocaleTimeString()} ${timezone}`;
}

function convertDatesInObject(obj: any): any {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] instanceof Date) {
                obj[key] = formatDateToLocalString(obj[key]);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                // Recursively convert nested objects
                convertDatesInObject(obj[key]);
            }
        }
    }
    return obj;
}
