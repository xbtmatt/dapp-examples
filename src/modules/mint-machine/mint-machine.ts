import { HexString, Provider, Network, TxnBuilderTypes, AptosAccount, BCS, Types } from 'aptos';
import { config } from 'dotenv';
import { createTypedArray, serializeVectors } from './pmap-utils';
import { MoveResource } from 'aptos/src/generated';
import { MoveValue } from '../types';
import { MintConfiguration } from './types';
import { prettyPrint, prettyView } from '../string-utils';
import { PropertyType, PropertyValue } from './add-tokens';
config();

export const RESOURCE_ACCOUNT_ADDRESS = process.env.NEXT_PUBLIC_RESOURCE_ACCOUNT_ADDRESS!;
export const RESOURCE_ACCOUNT_ADDRESS_HEXSTRING = new HexString(RESOURCE_ACCOUNT_ADDRESS);
export const MIGRATION_TOOL_HELPER_ADDRESS = process.env.NEXT_PUBLIC_MIGRATION_TOOL_HELPER_ADDRESS!;
export const MIGRATION_TOOL_HELPER_ADDRESS_HEX = new HexString(MIGRATION_TOOL_HELPER_ADDRESS);

export const DEFAULT_COLLECTION_DESCRIPTION = "Your collection description here!";
export const DEFAULT_MUTABLE_COLLECTION_DESCRIPTION = false;
export const DEFAULT_MUTABLE_ROYALTY = false;
export const DEFAULT_MUTABLE_URI = false;
export const DEFAULT_MUTABLE_TOKEN_DESCRIPTION = false;
export const DEFAULT_MUTABLE_TOKEN_NAME = false;
export const DEFAULT_MUTABLE_TOKEN_PROPERTIES = true;
export const DEFAULT_MUTABLE_TOKEN_URI = false;
export const DEFAULT_TOKENS_BURNABLE_BY_CREATOR = false;
export const DEFAULT_TOKENS_FREEZABLE_BY_CREATOR = false;
export const DEFAULT_COLLECTION_NAME = "Krazy Kangaroos";
export const DEFAULT_TOKEN_BASE_NAME = "Krazy Kangaroo #";
export const DEFAULT_TOKEN_BASE_URI = "https://arweave.net/";
export const DEFAULT_COLLECTION_URI = "https://www.link-to-your-collection-image.com";
export const DEFAULT_ROYALTY_NUMERATOR = 5;
export const DEFAULT_ROYALTY_DENOMINATOR = 100;
export const DEFAULT_MAX_SUPPLY = 10;
export const DEFAULT_MAX_WHITELIST_MINTS_PER_USER = 20;
export const DEFAULT_MAX_PUBLIC_MINTS_PER_USER = 500;

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


export type SubmitPayloadHelperProps = {
    provider: Provider,
    account: AptosAccount,
    payload: TxnBuilderTypes.TransactionPayload,
}

export const submitPayloadHelper = async (props: SubmitPayloadHelperProps): Promise<Types.UserTransaction> => {
    const txnHash = await props.provider.generateSignSubmitTransaction(props.account, props.payload);
    return await props.provider.waitForTransactionWithResult(txnHash) as Types.UserTransaction;
}

///          get the Object => argument thing from your other branch

export type InitializeMintMachineProps = {
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
}

// For the wallet adapter/dapp
export const initializeMintMachinePayload = (props: InitializeMintMachineProps): TxnBuilderTypes.TransactionPayloadEntryFunction => {
    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::mint_machine`,
            'initialize_mint_machine',
            [],
            [
                BCS.bcsSerializeStr(props.description),
                BCS.bcsSerializeUint64(props.maxSupply),
                BCS.bcsSerializeStr(props.name),
                BCS.bcsSerializeStr(props.uri),
                BCS.bcsSerializeBool(props.mutableDescription),
                BCS.bcsSerializeBool(props.mutableRoyalty),
                BCS.bcsSerializeBool(props.mutableUri),
                BCS.bcsSerializeBool(props.mutableTokenDescription),
                BCS.bcsSerializeBool(props.mutableTokenName),
                BCS.bcsSerializeBool(props.mutableTokenProperties),
                BCS.bcsSerializeBool(props.mutableTokenUri),
                BCS.bcsSerializeBool(props.tokensBurnableByCreator),
                BCS.bcsSerializeBool(props.tokensFreezableByCreator),
                BCS.bcsSerializeUint64(props.royaltyNumerator),
                BCS.bcsSerializeUint64(props.royaltyDenominator),
                BCS.bcsSerializeStr(props.tokenBaseName),
            ]
        ),
    );
}

// For the .ts script
export const initializeMintMachine = async (
    provider: Provider,
    admin: AptosAccount,
    props: InitializeMintMachineProps
): Promise<Types.UserTransaction> => {
    return await submitPayloadHelper({
        provider,
        account: admin,
        payload: initializeMintMachinePayload(props),
    });
}

export type UpsetTierProps = {
    tierName: string,
    openToPublic: boolean,
    price: number,
    startTimestamp: number,
    endTimestamp: number,
    perUserLimit: number,
}

// For the wallet adapter/dapp
export const upsertTierPayload = (props: UpsetTierProps): TxnBuilderTypes.TransactionPayloadEntryFunction => {
    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::mint_machine`,
            'upsert_tier',
            [],
            [
                BCS.bcsSerializeStr(props.tierName),
                BCS.bcsSerializeBool(props.openToPublic),
                BCS.bcsSerializeUint64(props.price),
                BCS.bcsSerializeUint64(props.startTimestamp),
                BCS.bcsSerializeUint64(props.endTimestamp),
                BCS.bcsSerializeUint64(props.perUserLimit),
            ]
        ),
    );
}

// For the .ts script
/// Keep in mind that javascript's Date.now() is in milliseconds and the contract checks timestamp::now_seconds() in seconds.
export const upsertTier = async (
    provider: Provider,
    admin: AptosAccount,
    props: UpsetTierProps
): Promise<Types.UserTransaction> => {
    return await submitPayloadHelper({
        provider,
        account: admin,
        payload: upsertTierPayload(props),
    });
}

export type AddTokensProps = {
    uris: Array<string>,
    descriptions: Array<string>,
    propertyKeys: Array<Array<string>>,
    propertyValues: Array<Array<PropertyValue>>,
    propertyTypes: Array<Array<PropertyType>> | Array<PropertyType> | PropertyType,
    safe?: boolean,
}

// For the wallet adapter/dapp
export const addTokensPayload = (props: AddTokensProps): TxnBuilderTypes.TransactionPayloadEntryFunction => {
    // If types is a single PropertyType, auto populate an array of size propertyValues.length with the propertyType as every value
    props.propertyTypes = Array.isArray(props.propertyTypes) ? props.propertyTypes : (createTypedArray(props.propertyValues, props.propertyTypes) as Array<any>);
    // Ensure that the lengths of propertyValues and propertyTypes are the same.
    if (props.propertyKeys.length !== props.propertyValues.length || props.propertyKeys.length !== props.propertyTypes.length) {
        throw new Error("The lengths of propertyValues and propertyTypes must be the same");
    }

    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::mint_machine`,
            'add_tokens',
            [],
            [
                serializeVectors(props.uris, PropertyType.STRING),
                serializeVectors(props.descriptions, PropertyType.STRING),
                serializeVectors(props.propertyKeys, PropertyType.STRING),
                serializeVectors(props.propertyValues, props.propertyTypes, true),
                serializeVectors(props.propertyTypes, PropertyType.STRING),
                BCS.bcsSerializeBool(props.safe ?? false),
            ]
        ),
    );
}

// For the .ts script
export const addTokens = async (
    provider: Provider,
    admin: AptosAccount,
    props: AddTokensProps
): Promise<Types.UserTransaction> => {
    return await submitPayloadHelper({
        provider,
        account: admin,
        payload: addTokensPayload(props),
    });
}

export const enableMintingPayload = (): TxnBuilderTypes.TransactionPayloadEntryFunction => {
    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::mint_machine`,
            'enable_minting',
            [],
            []
        ),
    );
}

export const enableMinting = async (
    provider: Provider,
    admin: AptosAccount
): Promise<Types.UserTransaction> => {
    return await submitPayloadHelper({
        provider,
        account: admin,
        payload: enableMintingPayload(),
    });
}

export type MintProps = {
    adminAddress: HexString,
}

export const mintPayload = (props: MintProps): TxnBuilderTypes.TransactionPayloadEntryFunction => {
    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::mint_machine`,
            'mint',
            [],
            [BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(props.adminAddress))]
        ),
    );
}

export const mint = async (
    provider: Provider,
    minter: AptosAccount,
    props: MintProps
): Promise<Types.UserTransaction> => {
    return await submitPayloadHelper({
        provider,
        account: minter,
        payload: mintPayload(props),
    });
}

export type MintMultipleProps = {
    adminAddress: HexString,
    amount: number,
}

export const mintMultiplePayload = (props: MintMultipleProps): TxnBuilderTypes.TransactionPayloadEntryFunction => {
    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            `${RESOURCE_ACCOUNT_ADDRESS}::mint_machine`,
            'mint_multiple',
            [],
            [
                BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(props.adminAddress)),
                BCS.bcsSerializeUint64(props.amount),
            ]
        ),
    );
}

export const mintMultiple = async (
    provider: Provider,
    minter: AptosAccount,
    props: MintMultipleProps
): Promise<Types.UserTransaction> => {
    return await submitPayloadHelper({
        provider,
        account: minter,
        payload: mintMultiplePayload(props),
    });
}

export function stringUtilsToCanonicalAddress(address: HexString): string {
    let hex = address.toString();
    if (hex.startsWith("0x")) {
        hex = hex.replace("0x", "@");
    }
    return hex;
}

export const viewTokensAddedByAdmin = async (
    provider: Provider,
    adminAddress: HexString,
): Promise<number> => {
    try {
        const creatorObjectAddress = await viewCreatorObject(provider, adminAddress);
        const mintMachineConfiguration = await viewMintConfiguration(provider, creatorObjectAddress);
        return Number(mintMachineConfiguration.metadata_table.size);
    } catch (e) {
        console.log(e); // TODO: Add error handling that checks if the creator object doesn't exist vs some other error
    }

    return -1;
}

export const viewCreatorObject = async (
    provider: Provider,
    adminAddress: HexString,
): Promise<HexString> => {
    return new HexString((await provider.view({
        function: constructTypeTag(RESOURCE_ACCOUNT_ADDRESS_HEXSTRING, 'package_manager', 'get_named_address'),
        type_arguments: [],
        arguments: [stringUtilsToCanonicalAddress(adminAddress)],
    }))[0].toString());
}

export const constructTypeTag = (
    accountAddress: HexString,
    moduleName: string,
    functionNameOrType: string
): string => {
    return `${accountAddress.toString()}::${moduleName}::${functionNameOrType}`
}

// "0x3a97c07858472f01a2303a2ee4b83d3ec1183c3cd7d50da858acd5263b51d725::mint_machine::MintConfiguration"
// The address specified should be the object/creator address, not the admin address.
export const viewMintConfiguration = async (
    provider: Provider,
    creatorObjectAddress: HexString,
): Promise<MintConfiguration> => {
    const mintConfigurationResource = (await provider.getAccountResource(
        creatorObjectAddress.toString(),
        constructTypeTag(RESOURCE_ACCOUNT_ADDRESS_HEXSTRING, 'mint_machine', 'MintConfiguration')
    )).data as MintConfiguration;

    return mintConfigurationResource;
}

export type Eligibility = {
    inTier: boolean,
    hasAnyLeft: boolean,
    notTooEarly: boolean,
    notTooLate: boolean,
    hasEnoughCoins: boolean,
}

export const addressEligibleForTier = async (
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

export const viewWhitelistTierInfo = async (
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
        openToPublic: Boolean(res[0]),
        price: Number(res[1]),
        startTime: Number(res[2]),
        endTime: Number(res[3]),
        perUserLimit: Number(res[4]),
    }
}

export type ReadyForLaunch = {
    mintConfigExists: boolean,
    whitelistExists: boolean,
    hasValidTier: boolean,
    collectionExists: boolean,
    metadataComplete: boolean,
};

export const viewReadyForLaunch = async (
    provider: Provider,
    adminAddr: HexString,
): Promise<ReadyForLaunch> => {
    const res = (await provider.view({
        function: constructTypeTag(RESOURCE_ACCOUNT_ADDRESS_HEXSTRING, 'mint_machine', 'ready_for_launch'),
        type_arguments: [],
        arguments: [adminAddr.toString()],
    }))[0] as any;
    return {
        mintConfigExists: Boolean(res.mint_config_exists),
        whitelistExists: Boolean(res.whitelist_exists),
        hasValidTier: Boolean(res.has_valid_tier),
        collectionExists: Boolean(res.collection_exists),
        metadataComplete: Boolean(res.metadata_complete),
    }
}

export const mintAndViewTokens = async (
    provider: Provider,
    minter: AptosAccount,
    adminAddress: HexString,
    amount: number,
) => {
    prettyPrint(await mintMultiple(provider, minter, {
        adminAddress,
        amount,
    }));

    prettyView(
        await provider.indexerClient.getOwnedTokens(
            minter.address(),
        )
    )
}
