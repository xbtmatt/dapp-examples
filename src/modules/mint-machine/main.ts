import {
    HexString,
    Provider,
    Network,
    TxnBuilderTypes,
    AptosAccount,
    BCS,
    FaucetClient,
} from "aptos";
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
    viewTokenMetadata,
    viewTokenUris,
    viewAllowlistTierInfo,
    RESOURCE_ACCOUNT_ADDRESS,
} from "./mint-machine";
import { formatDateToLocalString, printTxErrors, printView } from "../string-utils";
import { AdminAddress, TokenUri, TokensAdded, addTokensInChunks } from "./add-tokens";
import fs from "fs";
import TokensJSON from "./json/tokens.json";
import TokensAddedJSON from "./json/tokens-added.json";
import { join } from "path";
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
    DEFAULT_MAX_GOLD_TIER_MINTS_PER_USER,
    DEFAULT_MAX_PUBLIC_TIER_MINTS_PER_USER,
} from "./mint-machine";
import { getConfig } from "./config";
import assert from "assert";
import { YES, getInput } from "../utils";

const DIRNAME = __dirname;
const TOKENS_ADDED_FILE_PATH = join(DIRNAME, "json/tokens-added.json");
const CONFIG_YAML_PATH = join(DIRNAME, "./.config.yaml");

// cast to a dictionary (Record) and delete the default value that typescript sometimes imports
const TOKENS_TO_ADD = TokensJSON as Record<TokenUri, any>;
if ("default" in TOKENS_TO_ADD) {
    delete TOKENS_TO_ADD["default"];
}

const TOKENS_ADDED_PER_ADMIN = TokensAddedJSON as Record<AdminAddress, TokensAdded>;
if ("default" in TOKENS_ADDED_PER_ADMIN) {
    delete TOKENS_ADDED_PER_ADMIN["default"];
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
};

(async () => {
    const [mintMachineProps, tierProps, chunkSize] = getConfig(CONFIG_YAML_PATH);
    printView(mintMachineProps);
    printView(tierProps);

    printView({ currentTime: formatDateToLocalString(new Date(Date.now())) });
    let input = await getInput(
        "Do these configuration options look okay to you? [y/n]\n",
    );
    if (!YES.includes(input.toLowerCase())) {
        return;
    }

    const account = new AptosAccount();
    const address = account.address();
    const provider = new Provider(Network.DEVNET);
    const faucetClient = new FaucetClient(
        provider.aptosClient.nodeUrl,
        `https://faucet.${Network.DEVNET}.aptoslabs.com`,
    );

    await faucetClient.fundAccount(address, 100_000_000);

    // await defaultInitMintMachine(provider, account);
    await initializeMintMachine(provider, account, mintMachineProps);
    const creatorObject = await viewCreatorObject(provider, address);

    printView({
        AccountAddress: address.hex(),
        PrivateKey: HexString.fromUint8Array(account.signingKey.secretKey)
            .toString()
            .slice(0, 66),
        CreatorObject: creatorObject.toString(),
        ResourceAddress: RESOURCE_ACCOUNT_ADDRESS,
    });

    const tokensAddedPerAdmin = await addTokensInChunks(
        provider,
        account,
        TOKENS_TO_ADD,
        TOKENS_ADDED_PER_ADMIN,
        chunkSize,
        false,
        false,
        false,
    );

    fs.writeFileSync(
        TOKENS_ADDED_FILE_PATH,
        JSON.stringify(tokensAddedPerAdmin, null, 3),
    );

    let tokenUris = await viewTokenUris(provider, account.address());
    printView(tokenUris);
    const tokenMetadata = await viewTokenMetadata(
        provider,
        account.address(),
        tokenUris.slice(0, 10),
    );
    // printView(tokenMetadata);

    // Create each allowlist tier
    for (const tier of tierProps) {
        printTxErrors(await upsertTier(provider, account, tier));
    }

    const viewAllowlistTierInfoData = await Promise.all(
        tierProps.map(async (tier) => {
            return {
                tier: tier.tierName,
                info: await viewAllowlistTierInfo(provider, creatorObject, tier.tierName),
            };
        }),
    );

    printView(viewAllowlistTierInfoData);

    const viewEligibleTiers = await Promise.all(
        tierProps.map(async (tier) => {
            return {
                tier: tier.tierName,
                info: await addressEligibleForTier(
                    provider,
                    creatorObject,
                    account.address(),
                    tier.tierName,
                ),
            };
        }),
    );
    printView(viewEligibleTiers);
    printView(await viewReadyForLaunch(provider, account.address()));

    printTxErrors(await enableMinting(provider, account));
    printView(await viewMintConfiguration(provider, creatorObject));
    printView(viewAllowlistTierInfoData);

    // mintAndViewTokens(provider, account, account.address(), 250);

    printTxErrors(
        await mintMultiple(provider, account, {
            adminAddress: account.address(),
            amount: 250,
        }),
    );

    tokenUris = await viewTokenUris(provider, account.address());
    printView(tokenUris);
    printView(
        await viewTokenMetadata(provider, account.address(), tokenUris.slice(0, 10)),
    );
})();
