import {
    HexString,
    Provider,
    Network,
    TxnBuilderTypes,
    AptosAccount,
    BCS,
    Types,
} from "aptos";
import {
    RESOURCE_ACCOUNT_ADDRESS,
    RESOURCE_ACCOUNT_ADDRESS_HEXSTRING,
    stringUtilsToCanonicalAddress,
    viewCreatorObject,
    constructTypeTag,
} from "./mint-machine";
import { PropertyType, PropertyValue } from "./add-tokens";

export function toTypeTag(propertyType: PropertyType): TxnBuilderTypes.TypeTag {
    switch (propertyType) {
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
            return new TxnBuilderTypes.TypeTagStruct(
                TxnBuilderTypes.StructTag.fromString("0x1::string::String"),
            );
        default:
            throw new Error(`Unsupported property type: ${propertyType}`);
    }
}

export function serializePropertyValue(
    v: PropertyValue,
    propertyType: PropertyType,
    doubleSerialize: boolean = false,
): Uint8Array {
    switch (propertyType) {
        case PropertyType.BOOL:
            if (typeof v !== "boolean") {
                throw new Error(
                    "The given value's type does not match the propertyType.",
                );
            }
            return doubleSerialize
                ? BCS.bcsSerializeBytes(BCS.bcsSerializeBool(v))
                : BCS.bcsSerializeBool(v);
        case PropertyType.U8:
            if (typeof v !== "number") {
                throw new Error(
                    "The given value's type does not match the propertyType.",
                );
            }
            return doubleSerialize
                ? BCS.bcsSerializeBytes(BCS.bcsSerializeU8(v))
                : BCS.bcsSerializeU8(v);
        case PropertyType.U16:
            if (typeof v !== "number") {
                throw new Error(
                    "The given value's type does not match the propertyType.",
                );
            }
            return doubleSerialize
                ? BCS.bcsSerializeBytes(BCS.bcsSerializeU16(v))
                : BCS.bcsSerializeU16(v);
        case PropertyType.U32:
            if (typeof v !== "number") {
                throw new Error(
                    "The given value's type does not match the propertyType.",
                );
            }
            return doubleSerialize
                ? BCS.bcsSerializeBytes(BCS.bcsSerializeU32(v))
                : BCS.bcsSerializeU32(v);
        case PropertyType.U64:
            if (typeof v !== "number") {
                throw new Error(
                    "The given value's type does not match the propertyType.",
                );
            }
            return doubleSerialize
                ? BCS.bcsSerializeBytes(BCS.bcsSerializeUint64(v))
                : BCS.bcsSerializeUint64(v);
        case PropertyType.U128:
            if (typeof v !== "number") {
                throw new Error(
                    "The given value's type does not match the propertyType.",
                );
            }
            return doubleSerialize
                ? BCS.bcsSerializeBytes(BCS.bcsSerializeU128(v))
                : BCS.bcsSerializeU128(v);
        case PropertyType.U256:
            if (typeof v !== "number") {
                throw new Error(
                    "The given value's type does not match the propertyType.",
                );
            }
            return doubleSerialize
                ? BCS.bcsSerializeBytes(BCS.bcsSerializeU256(v))
                : BCS.bcsSerializeU256(v);
        case PropertyType.ADDRESS:
            if (!(v instanceof HexString)) {
                throw new Error(
                    "The given value's type does not match the propertyType.",
                );
            }
            return doubleSerialize
                ? BCS.bcsSerializeBytes(
                      BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(v)),
                  )
                : BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(v));
        case PropertyType.BYTE_VECTOR:
            if (!(v instanceof Uint8Array)) {
                throw new Error(
                    "The given value's type does not match the propertyType.",
                );
            }
            return doubleSerialize
                ? BCS.bcsSerializeBytes(BCS.bcsSerializeBytes(v))
                : BCS.bcsSerializeBytes(v);
        case PropertyType.STRING:
            if (typeof v !== "string") {
                throw new Error(
                    "The given value's type does not match the propertyType.",
                );
            }
            return doubleSerialize
                ? BCS.bcsSerializeBytes(BCS.bcsSerializeStr(v))
                : BCS.bcsSerializeStr(v);
        default:
            throw new Error(`Unsupported property type: ${propertyType}`);
    }
}

export function serializeVectors(
    values: Array<any>,
    propertyTypes: Array<any> | any,
    doubleSerialize: boolean = false,
): Uint8Array {
    // If there is only one type provided, we assume we can apply this type to all elements in the array
    propertyTypes = Array.isArray(propertyTypes)
        ? propertyTypes
        : createTypedArray(values, propertyTypes);

    // If we encounter an array, we need to recursively serialize each element.
    if (Array.isArray(values)) {
        const serializedElements: Uint8Array[] = values.map((v, i) =>
            Array.isArray(v)
                ? serializeVectors(v, propertyTypes[i], doubleSerialize)
                : serializePropertyValue(v, propertyTypes[i], doubleSerialize),
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

export function createTypedArray(
    propertyValues: Array<any>,
    propertyType: PropertyType,
): any {
    if (Array.isArray(propertyValues)) {
        return propertyValues.map((value) => createTypedArray(value, propertyType));
    }
    return propertyType;
}
