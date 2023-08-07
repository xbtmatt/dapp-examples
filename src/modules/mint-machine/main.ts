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
import { addTokensInChunks } from './add-tokens';

const COLLECTION_DESCRIPTION = "Your collection description here!";
const MUTABLE_COLLECTION_DESCRIPTION = false;
const MUTABLE_ROYALTY = false;
const MUTABLE_URI = false;
const MUTABLE_TOKEN_DESCRIPTION = false;
const MUTABLE_TOKEN_NAME = false;
const MUTABLE_TOKEN_PROPERTIES = true;
const MUTABLE_TOKEN_URI = false;
const TOKENS_BURNABLE_BY_CREATOR = false;
const TOKENS_FREEZABLE_BY_CREATOR = false;
const COLLECTION_NAME = "Krazy Kangaroos";
const TOKEN_BASE_NAME = "Krazy Kangaroo #";
const TOKEN_BASE_URI = "https://arweave.net/";
const COLLECTION_URI = "https://www.link-to-your-collection-image.com";
const ROYALTY_NUMERATOR = 5;
const ROYALTY_DENOMINATOR = 100;
const MAX_SUPPLY = 10;
const MAX_WHITELIST_MINTS_PER_USER = 20;
const MAX_PUBLIC_MINTS_PER_USER = 500;

export const defaultInitMintMachine = async (
    provider: Provider,
    admin: AptosAccount,
): Promise<any> => {
    return await initializeMintMachine(provider, admin, {
        description: COLLECTION_DESCRIPTION,
        maxSupply: MAX_SUPPLY,
        name: COLLECTION_NAME,
        uri: COLLECTION_URI,
        mutableDescription: MUTABLE_COLLECTION_DESCRIPTION,
        mutableRoyalty: MUTABLE_ROYALTY,
        mutableUri: MUTABLE_URI,
        mutableTokenDescription: MUTABLE_TOKEN_DESCRIPTION,
        mutableTokenName: MUTABLE_TOKEN_NAME,
        mutableTokenProperties: MUTABLE_TOKEN_PROPERTIES,
        mutableTokenUri: MUTABLE_TOKEN_URI,
        tokensBurnableByCreator: TOKENS_BURNABLE_BY_CREATOR,
        tokensFreezableByCreator: TOKENS_FREEZABLE_BY_CREATOR,
        royaltyNumerator: ROYALTY_NUMERATOR,
        royaltyDenominator: ROYALTY_DENOMINATOR,
        tokenBaseName: TOKEN_BASE_NAME,
    });
}

(async () => {
    // const pk = new HexString('0xad6aa5ac8ed6e6bcd4636518dd9692aefcce8da8cca589eb7473e62673cb1186');
    // const address = new HexString('0x68d15865f69e7afb89f3400576ae7aae7beb7a5560aa8784dec6cd80c23f9857');
    // const account = new AptosAccount(pk.toUint8Array());

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

    await addTokensInChunks(
        provider,
        account,
        127,
        false,
        false,
        false,
    );

    await upsertTier(provider, account, {
        tierName: "public",
        openToPublic: true,
        price: 1,
        startTimestamp: Math.floor(Date.now() / 1000),
        endTimestamp: Math.floor(Date.now() / 1000) + 1000000,
        perUserLimit: MAX_PUBLIC_MINTS_PER_USER
    });

    await upsertTier(provider, account, {
        tierName: "whitelist",
        openToPublic: true,
        price: 0,
        startTimestamp: Math.floor(Date.now() / 1000),
        endTimestamp: Math.floor(Date.now() / 1000) + 1000000,
        perUserLimit: MAX_WHITELIST_MINTS_PER_USER
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


