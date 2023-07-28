import { HexString, Provider, Network, TxnBuilderTypes, AptosAccount, BCS, Types } from 'aptos';
import { config } from 'dotenv';
config();

export const RESOURCE_ACCOUNT_ADDRESS = process.env.NEXT_PUBLIC_RESOURCE_ACCOUNT_ADDRESS!;
export const RESOURCE_ACCOUNT_ADDRESS_HEX = new HexString(RESOURCE_ACCOUNT_ADDRESS);
export const MIGRATION_TOOL_HELPER_ADDRESS = process.env.NEXT_PUBLIC_MIGRATION_TOOL_HELPER_ADDRESS!;
export const MIGRATION_TOOL_HELPER_ADDRESS_HEX = new HexString(MIGRATION_TOOL_HELPER_ADDRESS);

export const submitPayloadHelper = async(
    provider: Provider,
    account: AptosAccount,
    payload: TxnBuilderTypes.TransactionPayload,
): Promise<any> => {
    return await provider.waitForTransactionWithResult(await provider.generateSignSubmitTransaction(account, payload));
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


export const addMetadata = async(
    provider: Provider,
    account: AptosAccount,
    uris: Array<string>,
    descriptions: Array<string>,
    property_keys: Array<Array<string>>,
    property_values: Array<Array<Uint8Array>>,
    property_types: Array<Array<string>>,
): Promise<any> => {
    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::mint_machine`,
            'add_tokens',
            [],
            [
                BCS.serializeVectorWithFunc(uris, 'serializeStr'),
                BCS.serializeVectorWithFunc(descriptions, 'serializeStr'),
                BCS.serializeVectorWithFunc(property_keys.map(k => BCS.serializeVectorWithFunc(k, 'serializeStr')), 'serializeStr'),
                BCS.serializeVectorWithFunc(property_values, 'serializeStr'),
                BCS.serializeVectorWithFunc(property_types, 'serializeStr'),
            ]
        ),
    );

    return await submitPayloadHelper(provider, account, payload);
}

export const addMetadataRaw = async(
    provider: Provider,
    account: AptosAccount,
    uris: Uint8Array,
    descriptions: Uint8Array,
    property_keys: Uint8Array,
    property_values: Uint8Array,
    property_types: Uint8Array,
): Promise<any> => {
    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::mint_machine`,
            'add_tokens',
            [],
            [
                uris,
                descriptions,
                property_keys,
                property_values,
                property_types,
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

export const mint_multiple = async(
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
        function: constructTypeTag(RESOURCE_ACCOUNT_ADDRESS_HEX, 'package_manager', 'get_named_address'),
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
): Promise<any> => {
    return await provider.getAccountResource(
        address.toString(),
        constructTypeTag(RESOURCE_ACCOUNT_ADDRESS_HEX, 'mint_machine', 'MintConfiguration')
    );
}

export const viewBcsValues = async(
    provider: Provider,
    values: Array<String>,
): Promise<Array<any>> => {
    return await provider.view({
        function: constructTypeTag(MIGRATION_TOOL_HELPER_ADDRESS_HEX, 'token_v1_utils', 'view_bcs_values'),
        type_arguments: [],
        arguments: [values],
    });
}



export const toVectorVectorU8 = async(
    provider: Provider,
    values: Array<string>,
): Promise<Array<any>> => {
    return await provider.view({
        function: constructTypeTag(MIGRATION_TOOL_HELPER_ADDRESS_HEX, 'token_v1_utils', 'to_vector_vector_u8'),
        type_arguments: [],
        arguments: [values],
    });
}