import { Types } from 'aptos';
import prettyjson from 'prettyjson';
import colors from 'colors';

export const prettify = (
    obj: any,
    spacesPerIndent: number = 3,
): string => {
    return colors.bold.grey('{\n') + prettyjson.render(obj, {
        keysColor: 'grey',
        dashColor: 'brightWhite',
        stringColor: 'green',
        numberColor: 'blue',
        noAlign: true,
        defaultIndentation: spacesPerIndent,
        emptyArrayMsg: colors.bold.yellow('[]'),
    }) + colors.bold.grey('\n}');
}

export const stringifyResponse = (
    t: Types.UserTransaction,
    spacesPerIndent: number = 3,
    colorize: boolean = true,
): string => {
    const { hash, sender, success, payload, events, vm_status } = t;
    const obj =  {hash, sender, success, payload, events, vm_status };
    if (colorize) {
        return prettify(obj, spacesPerIndent);
    } else {
        return JSON.stringify(obj, null, spacesPerIndent);
    }
}

export const prettyPrint =(
    t: Types.UserTransaction,
    spacesPerIndent: number = 3,
    colorize: boolean = true,
) => {
    console.log(stringifyResponse(t, spacesPerIndent, colorize));   
}

export const prettyView =(
    v: any,
    spacesPerIndent: number = 3,
    colorize: boolean = true,
) => {
    if (colorize) {
        return prettify(v, spacesPerIndent);
    } else {
        return JSON.stringify(v, null, spacesPerIndent);
    }
}