import { Types } from 'aptos';
import prettyjson from 'prettyjson';
import colors from 'colors';
import { stringify } from 'querystring';

export const prettify = (
    obj: any,
    spacesPerIndent: number = 3,
    noAlign: boolean = true
): string => {
    const objCopy = JSON.parse(JSON.stringify(obj));
    const jsonString = prettyjson.render(objCopy, {
        keysColor: 'white',
        dashColor: 'brightWhite',
        stringColor: 'green',
        numberColor: 'blue',
        noAlign,
        defaultIndentation: spacesPerIndent,
        emptyArrayMsg: colors.bold.yellow('[]'),
    });
    const maxLength = findLongestLineLength(jsonString);
    return colors.bold.magenta('\n' + '-'.repeat(maxLength) + '\n')
         + jsonString;
         //+ colors.bold.magenta('\n\n' + '-'.repeat(maxLength) + '\n');
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

export type PrintTxResponseProps = {
    txn: Types.UserTransaction,
    spacesPerIndent?: number,
    colorize?: boolean,
    onlyErrors?: boolean,
}

const DefaultPrintTxResponseProps = {
    spacesPerIndent: 3,
    colorize: true,
    onlyErrors: false,
}

export const printTxResponse = (props: PrintTxResponseProps) => {
    props = { ...DefaultPrintTxResponseProps, ...props };
    if (!props.txn.success) {
        error(props.txn.vm_status);
    }
    if (props.onlyErrors) return;
    console.log(stringifyResponse(props.txn, props.spacesPerIndent, props.colorize));
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

export const printView = (
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

const findLongestLineLength = (input: string): number => {
    return Math.max(...input.split('\n').map(line => getVisibleLength(line)));
}

const getVisibleLength = (str: string): number => {
    // This regex matches the general pattern for ANSI escape sequences.
    const ansiEscapeRegex = /\u001b\[\d{1,3}m/g;

    // Strip all color codes from the string
    const visibleString = str.replace(ansiEscapeRegex, '');

    return visibleString.length;
};

export const error = (s: any) => {
    console.error(`[${colors.bold.red("ERROR")}]: ${colors.white(s)}`);
}