import { HexString, Provider, Network, TxnBuilderTypes, AptosAccount, BCS, Types } from 'aptos';
import {
    RESOURCE_ACCOUNT_ADDRESS,
    RESOURCE_ACCOUNT_ADDRESS_HEXSTRING,
    MIGRATION_TOOL_HELPER_ADDRESS,
    MIGRATION_TOOL_HELPER_ADDRESS_HEX,
    submitPayloadHelper,
    stringUtilsToCanonicalAddress,
    viewCreatorObject,
    constructTypeTag
} from './mint-machine';

export type PropertyValue = boolean | number | string | Uint8Array | HexString;

export enum PropertyType {
    BOOL = "bool",
    U8 = "u8",
    U16 = "u16",
    U32 = "u32",
    U64 = "u64",
    U128 = "u128",
    U256 = "u256",
    ADDRESS = "address",
    BYTE_VECTOR = "vector<u8>",
    STRING = "0x1::string::String"
}

export function createTypedArray(valueArray: Array<any>, propertyType: PropertyType): Array<any> {
    return valueArray.map((element, index) => 
        Array.isArray(element) ? createTypedArray(element, propertyType) : propertyType
    );
}

    
    // TypeTagBool
    // TypeTagU8
    // TypeTagU16
    // TypeTagU32
    // TypeTagU64
    // TypeTagU128
    // TypeTagU256
    // TypeTagAddress
    // TypeTagVector

export function toTypeTag(propertyType: PropertyType): TxnBuilderTypes.TypeTag {
    switch(propertyType) {
        case PropertyType.BOOL:
            return new TxnBuilderTypes.TypeTagBool();
        case PropertyType.U8:
            return new TxnBuilderTypes.TypeTagU8();
        case PropertyType.U16:
            return new TxnBuilderTypes.TypeTagU16();
        case PropertyType.U32:
            return new TxnBuilderTypes.TypeTagU32();
        case PropertyType.U64:
            return new TxnBuilderTypes.TypeTagU64();
        case PropertyType.U128:
            return new TxnBuilderTypes.TypeTagU128();
        case PropertyType.U256:
            return new TxnBuilderTypes.TypeTagU256();
        case PropertyType.ADDRESS:
            return new TxnBuilderTypes.TypeTagAddress();
        case PropertyType.BYTE_VECTOR:
            return new TxnBuilderTypes.TypeTagVector(new TxnBuilderTypes.TypeTagU8());
        case PropertyType.STRING:
            return new TxnBuilderTypes.TypeTagStruct(TxnBuilderTypes.StructTag.fromString('0x1::string::String'));
        default:
            throw new Error(`Unsupported property type: ${propertyType}`);
    }
}

export function toGeneralTypeTag(v: any): TxnBuilderTypes.TypeTag {
    if (typeof v === 'boolean') {
        return new TxnBuilderTypes.TypeTagBool();
    } else if (typeof v === 'number') {
        return new TxnBuilderTypes.TypeTagU64();
    } else if (typeof v === 'string') {
        return new TxnBuilderTypes.TypeTagAddress();
    } else if (v instanceof Uint8Array) {
        return new TxnBuilderTypes.TypeTagVector(new TxnBuilderTypes.TypeTagU8());
    } else {
        throw new Error(`Unknown type: ${v}`);
    }
}

export const viewInputTypes = async(provider: Provider): Promise<Array<any>> => {
    return await provider.view({
        function: constructTypeTag(RESOURCE_ACCOUNT_ADDRESS_HEXSTRING, 'property_map_utils', 'view_input_types'),
        type_arguments: [
            "bool",
            "u8",
            "u16",
            "u32",
            "u64",
            "u128",
            "u256",
            "address",
            "vector<u8>",
            "0x1::string::String",
        ],
        arguments: [],
    });
}

export const viewAllTypes = async(provider: Provider): Promise<Array<any>> => {
    return await provider.view({
        function: constructTypeTag(RESOURCE_ACCOUNT_ADDRESS_HEXSTRING, 'property_map_utils', 'view_all_types'),
        type_arguments: [],
        arguments: [],
    });
}

export const readStringFromKey = async(
    provider: Provider,
    objAddr: HexString,
    key: string,
): Promise<any> => {
    return await provider.view({
        function: constructTypeTag(RESOURCE_ACCOUNT_ADDRESS_HEXSTRING, 'property_map_utils', 'read_string_property_map_key'),
        type_arguments: [],
        arguments: [objAddr.toString(), key],
    });
}

export const readPropertyMapKey = async(
    provider: Provider,
    objAddr: HexString,
    key: string,
    type: string,
): Promise<any> => {
    return await provider.view({
        function: constructTypeTag(RESOURCE_ACCOUNT_ADDRESS_HEXSTRING, 'property_map_utils', 'read_property_map_key'),
        type_arguments: [type],
        arguments: [objAddr.toString(), key],
    });
}

export const addKeys = async(
    provider: Provider,
    account: AptosAccount,
    keys: Array<string>,
    values: Array<PropertyValue>,
    type: PropertyType
): Promise<any> => {
    // Ensure that the lengths of propertyValues and propertyTypes are the same.
    if (keys.length !== values.length) {
        throw new Error("The lengths of keys and values must be the same");
    }

    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::property_map_utils`,
            'add',
            [toTypeTag(type)],
            [
                serializeVectors(keys, PropertyType.STRING),
                serializeVectors(values, type),
            ]
        ),
    );

    return await submitPayloadHelper(provider, account, payload);
}

export const tryManyBcsSerialization = async(
    provider: Provider,
    account: AptosAccount,
    keys: Array<string>,
    values: Array<PropertyValue>,
    types: Array<PropertyType> | PropertyType
): Promise<any> => {
    // If types is a single PropertyType, auto populate an array of size propertyValues.length with the propertyType as every value
    types = Array.isArray(types) ? types : createTypedArray(values, types);

    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::property_map_utils`,
            'try_many_bcs_serialization',
            [],
            [
                serializeVectors(keys, PropertyType.STRING),
                serializeVectors(values, types, true),
                serializeVectors(types, PropertyType.STRING),
            ]
        ),
    );

    return await submitPayloadHelper(provider, account, payload);
}

export const addKey = async(
    provider: Provider,
    account: AptosAccount,
    key: string,
    value: PropertyValue,
    type: PropertyType
): Promise<any> => {
    console.debug(HexString.fromUint8Array(serializePropertyValue(type, PropertyType.STRING)));
    console.debug(HexString.fromUint8Array(serializePropertyValue(value, type)));
    console.debug(HexString.fromUint8Array(serializePropertyValue(value, type)));
    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::property_map_utils`,
            'add_key',
            [toTypeTag(type)],
            [
                serializePropertyValue(key, PropertyType.STRING),
                serializePropertyValue(value, type),
            ]
        ),
    );

    return await submitPayloadHelper(provider, account, payload);
}


export const tryBcsSerialization = async(
    provider: Provider,
    account: AptosAccount,
    key: string,
    value: PropertyValue,
    type: PropertyType
): Promise<any> => {
    console.debug(HexString.fromUint8Array(serializePropertyValue(type, PropertyType.STRING)));
    console.debug(HexString.fromUint8Array(serializePropertyValue(value, type)));
    console.debug(HexString.fromUint8Array(serializePropertyValue(value, type)));
    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::property_map_utils`,
            'try_bcs_serialization',
            [],
            [
                serializePropertyValue(key, PropertyType.STRING),
                serializePropertyValue(value, type, true), // requires specialized double serialization
                serializePropertyValue(type, PropertyType.STRING),
            ]
        ),
    );

    return await submitPayloadHelper(provider, account, payload);
}

export const verifySimplePropertyMap = async(
    provider: Provider,
    account: AptosAccount,
    propertyKeys: Array<string>,
    propertyValues: Array<PropertyValue>,
    propertyTypes: Array<PropertyType> | PropertyType
): Promise<any> => {
    // If types is a single PropertyType, auto populate an array of size propertyValues.length with the propertyType as every value
    propertyTypes = Array.isArray(propertyTypes) ? propertyTypes : createTypedArray(propertyValues, propertyTypes);
    // Ensure that the lengths of propertyValues and propertyTypes are the same.
    if (propertyKeys.length !== propertyValues.length || propertyKeys.length !== propertyTypes.length) {
        throw new Error("The lengths of propertyValues and propertyTypes must be the same");
    }

    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::property_map_utils`,
            'verify_valid_property_map',
            [],
            [
                serializeVectors(propertyKeys, PropertyType.STRING),
                serializeVectors(propertyValues, propertyTypes, true),
                serializeVectors(propertyTypes, PropertyType.STRING),
            ]
        ),
    );

    return await submitPayloadHelper(provider, account, payload);
}

export const verifyPropertyMaps = async(
    provider: Provider,
    account: AptosAccount,
    propertyKeys: Array<Array<string>>,
    propertyValues: Array<Array<PropertyValue>>,
    propertyTypes: Array<Array<PropertyType>> | Array<PropertyType> | PropertyType,
): Promise<any> => {
    propertyTypes = Array.isArray(propertyTypes) ? propertyTypes : createTypedArray(propertyValues, propertyTypes);
    propertyTypes = Array.isArray(propertyTypes[0]) ? propertyTypes : createTypedArray(propertyValues, propertyTypes[0]);
    // Ensure that the lengths of propertyValues and propertyTypes are the same.
    if (propertyKeys.length !== propertyValues.length || propertyKeys.length !== propertyTypes.length) {
        throw new Error("The lengths of propertyValues and propertyTypes must be the same");
    }

    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::property_map_utils`,
            'verify_valid_property_maps',
            [],
            [
                serializeVectors(propertyKeys, createTypedArray(propertyTypes, PropertyType.STRING)),
                serializeVectors(propertyValues, propertyTypes, true),
                serializeVectors(propertyTypes, createTypedArray(propertyTypes, PropertyType.STRING)),
            ]
        ),
    );

    return await submitPayloadHelper(provider, account, payload);
}

export function serializePropertyValue(v: PropertyValue, propertyType: PropertyType, doubleSerialize: boolean = false): Uint8Array {
    switch(propertyType) {
        case PropertyType.BOOL:
            if (typeof v !== 'boolean') { throw new Error('The given value\'s type does not match the propertyType.') }
            //console.debug(v, PropertyType.BOOL, HexString.fromUint8Array(BCS.bcsSerializeBool(v)));
            return doubleSerialize ? BCS.bcsSerializeBytes(BCS.bcsSerializeBool(v)) : BCS.bcsSerializeBool(v);
        case PropertyType.U8:
            if (typeof v !== 'number') { throw new Error('The given value\'s type does not match the propertyType.') }
            //console.debug(v, PropertyType.U8, HexString.fromUint8Array(BCS.bcsSerializeU8(v)));
            return doubleSerialize ? BCS.bcsSerializeBytes(BCS.bcsSerializeU8(v)) : BCS.bcsSerializeU8(v);
        case PropertyType.U16:
            if (typeof v !== 'number') { throw new Error('The given value\'s type does not match the propertyType.') }
            //console.debug(v, PropertyType.U16, HexString.fromUint8Array(BCS.bcsSerializeU16(v)));
            return doubleSerialize ? BCS.bcsSerializeBytes(BCS.bcsSerializeU16(v)) : BCS.bcsSerializeU16(v);
        case PropertyType.U32:
            if (typeof v !== 'number') { throw new Error('The given value\'s type does not match the propertyType.') }
            //console.debug(v, PropertyType.U32, HexString.fromUint8Array(BCS.bcsSerializeU32(v)));
            return doubleSerialize ? BCS.bcsSerializeBytes(BCS.bcsSerializeU32(v)) : BCS.bcsSerializeU32(v);
        case PropertyType.U64:
            if (typeof v !== 'number') { throw new Error('The given value\'s type does not match the propertyType.') }
            //console.debug(v, PropertyType.U64, HexString.fromUint8Array(BCS.bcsSerializeUint64(v)));
            return doubleSerialize ? BCS.bcsSerializeBytes(BCS.bcsSerializeUint64(v)) : BCS.bcsSerializeUint64(v);
        case PropertyType.U128:
            if (typeof v !== 'number') { throw new Error('The given value\'s type does not match the propertyType.') }
            //console.debug(v, PropertyType.U128, HexString.fromUint8Array(BCS.bcsSerializeU128(v)));
            return doubleSerialize ? BCS.bcsSerializeBytes(BCS.bcsSerializeU128(v)) : BCS.bcsSerializeU128(v);
        case PropertyType.U256:
            if (typeof v !== 'number') { throw new Error('The given value\'s type does not match the propertyType.') }
            //console.debug(v, PropertyType.U256, HexString.fromUint8Array(BCS.bcsSerializeU256(v)));
            return doubleSerialize ? BCS.bcsSerializeBytes(BCS.bcsSerializeU256(v)) : BCS.bcsSerializeU256(v);
        case PropertyType.ADDRESS:
            if (!(v instanceof HexString)) { throw new Error('The given value\'s type does not match the propertyType.') }
            //console.debug(v, PropertyType.ADDRESS, HexString.fromUint8Array(BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(v))));
            return doubleSerialize ? BCS.bcsSerializeBytes(BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(v))) : BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(v));
        case PropertyType.BYTE_VECTOR:
            if (!(v instanceof Uint8Array)) { throw new Error('The given value\'s type does not match the propertyType.') }
            //console.debug(v, PropertyType.BYTE_VECTOR, HexString.fromUint8Array(BCS.bcsSerializeBytes(v)));
            return doubleSerialize ? BCS.bcsSerializeBytes(BCS.bcsSerializeBytes(v)) : BCS.bcsSerializeBytes(v);
        case PropertyType.STRING:
            if (typeof v !== 'string') { throw new Error('The given value\'s type does not match the propertyType.') }
            //onsole.debug('--------------------------------     test       --------------------------------');
            //console.debug(BCS.bcsSerializeStr(v))
            //console.debug(v, PropertyType.STRING, HexString.fromUint8Array(BCS.bcsSerializeStr(v)));
            return doubleSerialize ? BCS.bcsSerializeBytes(BCS.bcsSerializeStr(v)) : BCS.bcsSerializeStr(v);
        default:
            throw new Error(`Unsupported property type: ${propertyType}`);
    }
}

export function serializeVectors(values: Array<any>, propertyTypes: Array<any> | any, doubleSerialize: boolean = false): Uint8Array {
    // If there is only one type provided, we assume we can apply this type to all elements in the array
    propertyTypes = Array.isArray(propertyTypes) ? propertyTypes : createTypedArray(values, propertyTypes);

    // If we encounter an array, we need to recursively serialize each element.
    if (Array.isArray(values)) {
        const serializedElements: Uint8Array[] = values.map((v, i) =>
            Array.isArray(v) ? serializeVectors(v, propertyTypes[i], doubleSerialize) : serializePropertyValue(v, propertyTypes[i], doubleSerialize)
        );

        // Combine the serialized elements into a single Uint8Array.
        const combinedElements = concatUint8Arrays(serializedElements);

        // Prepend the length of the original array (number of elements) to the start.
        const lengthPrefix = new Uint8Array([values.length]);

        return concatUint8Arrays([lengthPrefix, combinedElements]);
    } else {
        throw new Error("The `values` should be an array");
    }
}


function concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
    let totalLength = arrays.reduce((acc, val) => acc + val.length, 0);
    let result = new Uint8Array(totalLength);
    let length = 0;
    for (let array of arrays) {
        result.set(array, length);
        length += array.length;
    }
    return result;
}

// function dehexifyVectors(serializedData: string, propertyType: PropertyType): PropertyPair[] {
//     let currentIndex = 0;
//     const pairs: PropertyPair[] = [];

//     while (currentIndex < serializedData.length) {
//         // Get the length of the next value.
//         const valueLength = parseInt(serializedData.substr(currentIndex, 2), 16);
//         currentIndex += 2;

//         // Get the serialized value.
//         const serializedValue = serializedData.substr(currentIndex, valueLength * 2);
//         currentIndex += valueLength * 2;

//         // Deserialize the value.
//         const value = deserializePropertyValue(serializedValue, propertyType);

//         // Add the pair to the array.
//         pairs.push({
//             pair: {
//                 value,
//                 propertyType
//             }
//         });
//     }

//     return pairs;
// }
