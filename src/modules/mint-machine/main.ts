import { HexString, Provider, Network, TxnBuilderTypes, AptosAccount, BCS, FaucetClient } from 'aptos';
import {
    RESOURCE_ACCOUNT_ADDRESS_HEXSTRING,
    addTokens,
    addressEligibleForTier,
    constructTypeTag,
    enableMinting,
    initializeMintMachine,
    initializeMintMachinePayload,
    mint,
    mintAndViewTokens,
    mintMultiple,
    upsertTier,
    viewCreatorObject,
    viewMintConfiguration,
    viewReadyForLaunch,
    viewWhitelistTierInfo
} from './mint-machine';
import { prettyPrint, prettyView } from '../string-utils';
import { AdminAddress, TokenUri, TokensAdded, addTokensInChunks } from './add-tokens';
import fs from 'fs';
import TokensJSON from './json/tokens.json';
import TokensAddedJSON from './json/tokens-added.json';
import { join } from 'path';
import {
    DEFAULT_COLLECTION_DESCRIPTION,
    DEFAULT_MUTABLE_COLLECTION_DESCRIPTION,
    DEFAULT_MUTABLE_ROYALTY,
    DEFAULT_MUTABLE_URI,
    DEFAULT_MUTABLE_TOKEN_DESCRIPTION,
    DEFAULT_MUTABLE_TOKEN_NAME,
    DEFAULT_MUTABLE_TOKEN_PROPERTIES,
    DEFAULT_MUTABLE_TOKEN_URI,
    DEFAULT_TOKENS_BURNABLE_BY_CREATOR,
    DEFAULT_TOKENS_FREEZABLE_BY_CREATOR,
    DEFAULT_COLLECTION_NAME,
    DEFAULT_TOKEN_BASE_NAME,
    DEFAULT_COLLECTION_URI,
    DEFAULT_ROYALTY_NUMERATOR,
    DEFAULT_ROYALTY_DENOMINATOR,
    DEFAULT_MAX_SUPPLY,
    DEFAULT_MAX_WHITELIST_MINTS_PER_USER,
    DEFAULT_MAX_PUBLIC_MINTS_PER_USER,
} from './mint-machine';

const DIRNAME = __dirname;
const TOKENS_ADDED_FILE_PATH = join(DIRNAME, 'json/tokens-added.json');


// cast to a dictionary (Record) and delete the default value that typescript sometimes imports
const TOKENS_TO_ADD = TokensJSON as Record<TokenUri, any>;
if ('default' in TOKENS_TO_ADD) {
    delete TOKENS_TO_ADD['default'];
}

const TOKENS_ADDED_PER_ADMIN = TokensAddedJSON as Record<AdminAddress, TokensAdded>;
if ('default' in TOKENS_ADDED_PER_ADMIN) {
    delete TOKENS_ADDED_PER_ADMIN['default'];
}

export const defaultInitMintMachine = async (
    provider: Provider,
    admin: AptosAccount,
): Promise<any> => {
    return await initializeMintMachine(provider, admin, {
        description: DEFAULT_COLLECTION_DESCRIPTION,
        maxSupply: DEFAULT_MAX_SUPPLY,
        name: DEFAULT_COLLECTION_NAME,
        uri: DEFAULT_COLLECTION_URI,
        mutableDescription: DEFAULT_MUTABLE_COLLECTION_DESCRIPTION,
        mutableRoyalty: DEFAULT_MUTABLE_ROYALTY,
        mutableUri: DEFAULT_MUTABLE_URI,
        mutableTokenDescription: DEFAULT_MUTABLE_TOKEN_DESCRIPTION,
        mutableTokenName: DEFAULT_MUTABLE_TOKEN_NAME,
        mutableTokenProperties: DEFAULT_MUTABLE_TOKEN_PROPERTIES,
        mutableTokenUri: DEFAULT_MUTABLE_TOKEN_URI,
        tokensBurnableByCreator: DEFAULT_TOKENS_BURNABLE_BY_CREATOR,
        tokensFreezableByCreator: DEFAULT_TOKENS_FREEZABLE_BY_CREATOR,
        royaltyNumerator: DEFAULT_ROYALTY_NUMERATOR,
        royaltyDenominator: DEFAULT_ROYALTY_DENOMINATOR,
        tokenBaseName: DEFAULT_TOKEN_BASE_NAME,
    });
}

(async () => {
    const account = new AptosAccount();
    const address = account.address();
    prettyView({
        address: address.hex(),
        pk: HexString.fromUint8Array(account.signingKey.secretKey),
    })
    const provider = new Provider(Network.DEVNET);
    const faucetClient = new FaucetClient(provider.aptosClient.nodeUrl, `https://faucet.${Network.DEVNET}.aptoslabs.com`);

    await faucetClient.fundAccount(address, 100_000_000);

    await defaultInitMintMachine(provider, account);
    const creatorObject = await viewCreatorObject(provider, address);

    const tokensAddedPerAdmin = await addTokensInChunks(
        provider,
        account,
        127,
        false,
        false,
        false,
        TOKENS_TO_ADD,
        TOKENS_ADDED_PER_ADMIN,
    );

    fs.writeFileSync(TOKENS_ADDED_FILE_PATH, JSON.stringify(tokensAddedPerAdmin, null, 3));

    await upsertTier(provider, account, {
        tierName: "public",
        openToPublic: true,
        price: 1,
        startTimestamp: Math.floor(Date.now() / 1000),
        endTimestamp: Math.floor(Date.now() / 1000) + 1000000,
        perUserLimit: DEFAULT_MAX_PUBLIC_MINTS_PER_USER
    });

    await upsertTier(provider, account, {
        tierName: "whitelist",
        openToPublic: true,
        price: 0,
        startTimestamp: Math.floor(Date.now() / 1000),
        endTimestamp: Math.floor(Date.now() / 1000) + 1000000,
        perUserLimit: DEFAULT_MAX_WHITELIST_MINTS_PER_USER
    });

    prettyView(await viewReadyForLaunch(
        provider,
        account.address(),
    ));

    const viewWhitelistTierInfoData =
        await viewWhitelistTierInfo(
            provider,
            creatorObject,
            "public",
        );
    prettyView(await addressEligibleForTier(
        provider,
        creatorObject,
        account.address(),
        "public",
    ));
    prettyView(await enableMinting(provider, account));
    prettyView(await viewMintConfiguration(provider, creatorObject));
    prettyView(viewWhitelistTierInfoData);

    //mintAndViewTokens(provider, account, 250);
    const { events, ...response } = (await mintMultiple(provider, account, {
        adminAddress: account.address(),
        amount: 10,
    }));
    prettyPrint({ events: [], ...response });

})();


