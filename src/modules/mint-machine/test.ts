import { HexString, Provider, Network, TxnBuilderTypes, AptosAccount, BCS } from 'aptos';
import {
    RESOURCE_ACCOUNT_ADDRESS_HEXSTRING, 
    addTokens, 
    addressEligibleForTier, 
    constructTypeTag, 
    enableMinting, 
    initializeMintMachine, 
    mint, 
    mintMultiple, 
    upsertTier, 
    viewCreatorObject, 
    viewMintConfiguration,
    whitelistTierInfo
} from './mint-machine';
import { printJSON } from '../utils';
import {
    PropertyType,
    addKey,
    addKeys,
    createTypedArray,
    readPropertyMapKey,
    readStringFromKey,
    serializePropertyValue,
    serializeVectors,
    toTypeTag,
    tryBcsSerialization,
    tryManyBcsSerialization,
    verifyPropertyMaps,
    verifySimplePropertyMap,
    viewAllTypes,
    viewInputTypes
} from './pmap-utils';
import { prettyPrint, prettyView, stringifyResponse } from '../string-utils';
import * as tokensJson from './tokens.json';
import { Token } from './add-tokens';

const COLLECTION_DESCRIPTION = "Your collection description here!";
const TOKEN_DESCRIPTION = "Your token description here!";
const MUTABLE_COLLECTION_DESCRIPTION = false;
const MUTABLE_ROYALTY = false;
const MUTABLE_URI = false;
const MUTABLE_TOKEN_DESCRIPTION = false;
const MUTABLE_TOKEN_NAME = false;
const MUTABLE_TOKEN_PROPERTIES = true;
const MUTABLE_TOKEN_URI = false;
const TOKENS_BURNABLE_BY_CREATOR = false;
const TOKENS_FREEZABLE_BY_CREATOR = false;
const MINTER_STARTING_COINS = 100;
const COLLECTION_NAME = "Krazy Kangaroos";
const TOKEN_BASE_NAME = "Krazy Kangaroo #";
const TOKEN_BASE_URI = "https://arweave.net/";
const COLLECTION_URI = "https://www.link-to-your-collection-image.com";
const ROYALTY_NUMERATOR = 5;
const ROYALTY_DENOMINATOR = 100;
const MAX_SUPPLY = 100;

export const defaultInitMintMachine = async (
    provider: Provider,
    account: AptosAccount,
): Promise<any> => {
    return await initializeMintMachine(
        provider,
        account,
        COLLECTION_DESCRIPTION,
        MAX_SUPPLY,
        COLLECTION_NAME,
        COLLECTION_URI,
        MUTABLE_COLLECTION_DESCRIPTION,
        MUTABLE_ROYALTY,
        MUTABLE_URI,
        MUTABLE_TOKEN_DESCRIPTION,
        MUTABLE_TOKEN_NAME,
        MUTABLE_TOKEN_PROPERTIES,
        MUTABLE_TOKEN_URI,
        TOKENS_BURNABLE_BY_CREATOR,
        TOKENS_FREEZABLE_BY_CREATOR,
        ROYALTY_NUMERATOR,
        ROYALTY_DENOMINATOR,
        TOKEN_BASE_NAME,
    );
}

(async () => {
    const pk = new HexString('0xad6aa5ac8ed6e6bcd4636518dd9692aefcce8da8cca589eb7473e62673cb1186');
    const address = new HexString('0x68d15865f69e7afb89f3400576ae7aae7beb7a5560aa8784dec6cd80c23f9857');

    const provider = new Provider(Network.DEVNET);
    const account = new AptosAccount(pk.toUint8Array());

    //prettyPrint(await defaultInitMintMachine(provider, account));
    const creatorObject = await viewCreatorObject(provider, address);
    prettyView(await viewMintConfiguration(provider, creatorObject));
    // prettyView(await viewMintConfiguration(provider, creatorObject));
    //prettyView(await viewBcsValues(provider, address));
    await upsertTier(
        provider,
        account,
        "public",
        true,
        1,
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000) + 1000000,
        3
    );

    const tokensDict = 'default' in tokensJson ? tokensJson.default as Record<string, Token> : tokensJson as Record<string, Token>;

    // const r = await processTokens(
    //     provider,
    //     account,
    //     10,
    //     0,
    //     tokensDict,
    //     true,
    // );
    // r.forEach(v => prettyPrint(v));

    // prettyPrint(await enableMinting(provider, account));

    const whitelistTierInfoData = 
        await whitelistTierInfo(
            provider,
            creatorObject,
            "public",
        );
    prettyView(whitelistTierInfoData);

    console.debug(Date.now() / 1000 > whitelistTierInfoData.startTime);
    console.debug(Date.now() / 1000 < whitelistTierInfoData.endTime);

    prettyView(
        await addressEligibleForTier(
            provider,
            creatorObject,
            account.address(),
            "public",
        )
    );

    prettyPrint(await mintMultiple(
        provider,
        account,
        account.address(),
        3
    ));

    prettyView(
        await provider.indexerClient.getOwnedTokens(
            account.address(),
        )
    )
    
    // await addTokens(
    //     provider,
    //     account,

    // )

})();