import { HexString, Provider, Network, TxnBuilderTypes, AptosAccount, BCS, Types } from 'aptos';
import { config } from 'dotenv';
import { createTypedArray, PropertyType, PropertyValue, serializeVectors } from './pmap-utils';
import { MoveResource } from 'aptos/src/generated';
import { MoveValue } from '../types';
config();

export const RESOURCE_ACCOUNT_ADDRESS = process.env.NEXT_PUBLIC_RESOURCE_ACCOUNT_ADDRESS!;
export const RESOURCE_ACCOUNT_ADDRESS_HEXSTRING = new HexString(RESOURCE_ACCOUNT_ADDRESS);
export const MIGRATION_TOOL_HELPER_ADDRESS = process.env.NEXT_PUBLIC_MIGRATION_TOOL_HELPER_ADDRESS!;
export const MIGRATION_TOOL_HELPER_ADDRESS_HEX = new HexString(MIGRATION_TOOL_HELPER_ADDRESS);

export const submitPayloadHelper = async(
    provider: Provider,
    account: AptosAccount,
    payload: TxnBuilderTypes.TransactionPayload,
): Promise<any> => {
    return await provider.waitForTransactionWithResult(await provider.generateSignSubmitTransaction(account, payload)) as Types.UserTransaction;
}


export const initializeMintMachine = async(
    provider: Provider,
    account: AptosAccount,
    description: string,
    maxSupply: number,
    name: string,
    uri: string,
    mutableDescription: boolean,
    mutableRoyalty: boolean,
    mutableUri: boolean,
    mutableTokenDescription: boolean,
    mutableTokenName: boolean,
    mutableTokenProperties: boolean,
    mutableTokenUri: boolean,
    tokensBurnableByCreator: boolean,
    tokensFreezableByCreator: boolean,
    royaltyNumerator: number,
    royaltyDenominator: number,
    tokenBaseName: string,
): Promise<any> => {
    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::mint_machine`,
            'initialize_mint_machine',
            [],
            [
                BCS.bcsSerializeStr(description),
                BCS.bcsSerializeUint64(maxSupply),
                BCS.bcsSerializeStr(name),
                BCS.bcsSerializeStr(uri),
                BCS.bcsSerializeBool(mutableDescription),
                BCS.bcsSerializeBool(mutableRoyalty),
                BCS.bcsSerializeBool(mutableUri),
                BCS.bcsSerializeBool(mutableTokenDescription),
                BCS.bcsSerializeBool(mutableTokenName),
                BCS.bcsSerializeBool(mutableTokenProperties),
                BCS.bcsSerializeBool(mutableTokenUri),
                BCS.bcsSerializeBool(tokensBurnableByCreator),
                BCS.bcsSerializeBool(tokensFreezableByCreator),
                BCS.bcsSerializeUint64(royaltyNumerator),
                BCS.bcsSerializeUint64(royaltyDenominator),
                BCS.bcsSerializeStr(tokenBaseName),
            ]
        ),
    );

    return await submitPayloadHelper(provider, account, payload);
}

/// Keep in mind that javascript's Date.now() is in milliseconds and the contract checks timestamp::now_seconds() in seconds.
export const upsertTier = async(
    provider: Provider,
    account: AptosAccount,
    tierName: string,
    openToPublic: boolean,
    price: number,
    startTimestamp: number,
    endTimestamp: number,
    perUserLimit: number,
): Promise<any> => {
    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::mint_machine`,
            'upsert_tier',
            [],
            [
                BCS.bcsSerializeStr(tierName),
                BCS.bcsSerializeBool(openToPublic),
                BCS.bcsSerializeUint64(price),
                BCS.bcsSerializeUint64(startTimestamp),
                BCS.bcsSerializeUint64(endTimestamp),
                BCS.bcsSerializeUint64(perUserLimit),
            ]
        ),
    );

    return await submitPayloadHelper(provider, account, payload);
}

export const addTokens = async(
    provider: Provider,
    account: AptosAccount,
    uris: Array<string>,
    descriptions: Array<string>,
    propertyKeys: Array<Array<string>>,
    propertyValues: Array<Array<PropertyValue>>,
    propertyTypes: Array<Array<PropertyType>> | Array<PropertyType> | PropertyType,
    safe: boolean = true,
): Promise<any> => {
    // If types is a single PropertyType, auto populate an array of size propertyValues.length with the propertyType as every value
    propertyTypes = Array.isArray(propertyTypes) ? propertyTypes : (createTypedArray(propertyValues, propertyTypes) as Array<any>);
    // Ensure that the lengths of propertyValues and propertyTypes are the same.
    if (propertyKeys.length !== propertyValues.length || propertyKeys.length !== propertyTypes.length) {
        throw new Error("The lengths of propertyValues and propertyTypes must be the same");
    }

    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::mint_machine`,
            `add_tokens${safe ? '_safe' : ''}`,
            [],
            [
                serializeVectors(uris, PropertyType.STRING),
                serializeVectors(descriptions, PropertyType.STRING),
                serializeVectors(propertyKeys, PropertyType.STRING),
                serializeVectors(propertyValues, propertyTypes, true),
                serializeVectors(propertyTypes, PropertyType.STRING),
            ]
        ),
    );

    return await submitPayloadHelper(provider, account, payload);
}

export const enableMinting = async(
    provider: Provider,
    account: AptosAccount,
): Promise<any> => {
    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::mint_machine`,
            'enable_minting',
            [],
            []
        ),
    );

    return await submitPayloadHelper(provider, account, payload);
}

export const mint = async(
    provider: Provider,
    account: AptosAccount,
    adminAddress: HexString,
): Promise<any> => {
    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::mint_machine`,
            'mint',
            [],
            [BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(adminAddress))]
        ),
    );

    return await submitPayloadHelper(provider, account, payload);
}

export const mintMultiple = async(
    provider: Provider,
    account: AptosAccount,
    adminAddress: HexString,
    amount: number,
): Promise<any> => {
    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::mint_machine`,
            'mint_multiple',
            [],
            [
                BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(adminAddress)),
                BCS.bcsSerializeUint64(amount),
            ]
        ),
    );

    return await submitPayloadHelper(provider, account, payload);
}

// Initialization of a mint machine in the happy path move test

// mint_machine::upsert_tier(
//     admin,
//     str(b"public"),
//     true, // open to public
//     1,
//     START_TIMESTAMP_PUBLIC,
//     END_TIMESTAMP_PUBLIC,
//     PER_USER_LIMIT
// );

// add_test_metadata(admin, MAX_SUPPLY);
// mint_machine::assert_ready_for_launch(admin_addr);
// mint_machine::verify_valid_property_map(admin);

// // collection is ready for launch, enable it!
// mint_machine::enable_minting(admin);

// let minter_1_addr = signer::address_of(minter_1);
// let whitelist_addr = mint_machine::get_creator_addr(admin_addr);
// whitelist::assert_eligible_for_tier(whitelist_addr, minter_1_addr, str(b"public"));


export function stringUtilsToCanonicalAddress(address: HexString): string {
    let hex = address.toString();
    if (hex.startsWith("0x")) {
        hex = hex.replace("0x", "@");
    }
    return hex;
}

export const viewCreatorObject = async(
    provider: Provider,
    address: HexString,
): Promise<HexString> => {
    return new HexString((await provider.view({
        function: constructTypeTag(RESOURCE_ACCOUNT_ADDRESS_HEXSTRING, 'package_manager', 'get_named_address'),
        type_arguments: [],
        arguments: [stringUtilsToCanonicalAddress(address)],
    }))[0].toString());
}

export const constructTypeTag = (
    accountAddress: HexString,
    moduleName: string,
    functionNameOrType: string
): string => {
    return `${accountAddress.toString()}::${moduleName}::${functionNameOrType}`
}

export const viewMintConfiguration = async(
    provider: Provider,
    address: HexString,
): Promise<MoveResource> => {
    return await provider.getAccountResource(
        address.toString(),
        constructTypeTag(RESOURCE_ACCOUNT_ADDRESS_HEXSTRING, 'mint_machine', 'MintConfiguration')
    );
}

export type Eligibility = {
    inTier: boolean,
    hasAnyLeft: boolean,
    notTooEarly: boolean,
    notTooLate: boolean,
    hasEnoughCoins: boolean,
}

export const addressEligibleForTier = async(
    provider: Provider,
    creatorAddr: HexString,
    accountAddr: HexString,
    tierName: string,
): Promise<Eligibility> => {
    const res = await provider.view({
        function: constructTypeTag(RESOURCE_ACCOUNT_ADDRESS_HEXSTRING, 'whitelist', 'address_eligible_for_tier'),
        type_arguments: [],
        arguments: [creatorAddr.toString(), accountAddr.toString(), tierName],
    }) as Array<any>;

    console.debug(res);

    return {
        inTier: res[0],
        hasAnyLeft: res[1],
        notTooEarly: res[2],
        notTooLate: res[3],
        hasEnoughCoins: res[4],
    }
}

export type TierInfo = {
    openToPublic: boolean,
    price: number,
    startTime: number,
    endTime: number,
    perUserLimit: number,
}

export const whitelistTierInfo = async(
    provider: Provider,
    creatorAddr: HexString,
    tierName: string,
): Promise<TierInfo> => {
    const res = await provider.view({
        function: constructTypeTag(RESOURCE_ACCOUNT_ADDRESS_HEXSTRING, 'whitelist', 'tier_info'),
        type_arguments: [],
        arguments: [creatorAddr.toString(), tierName],
    }) as Array<boolean | number>;

    return {
        openToPublic: res[0] as boolean,
        price: res[1] as number,
        startTime: res[2] as number,
        endTime: res[3] as number,
        perUserLimit: res[4] as number,
    }
}