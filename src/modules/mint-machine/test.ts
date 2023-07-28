import { HexString, Provider, Network, TxnBuilderTypes, AptosAccount, BCS } from 'aptos';
import { addMetadata, addMetadataRaw, enableMinting, initializeMintMachine, mint, toVectorVectorU8, upsertTier, viewBcsValues, viewCreatorObject, viewMintConfiguration } from './mint-machine';
import { printJSON } from '../utils';

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

export const defaultInitMintMachine = async(
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

(async() => {
    const pk = new HexString('0xad6aa5ac8ed6e6bcd4636518dd9692aefcce8da8cca589eb7473e62673cb1186');
    const address = new HexString('0x68d15865f69e7afb89f3400576ae7aae7beb7a5560aa8784dec6cd80c23f9857');

    const provider = new Provider(Network.DEVNET);
    const account = new AptosAccount(pk.toUint8Array());

   //const initResponse = await defaultInitMintMachine(provider, account);
   const creatorObj = (await viewCreatorObject(provider, address));
   const mintConfiguration = await viewMintConfiguration(provider, creatorObj);
   console.debug(mintConfiguration);

   const whitelistRes = await upsertTier(
    provider,
    account,
    "public",
    true,
    0,
    0,
    Date.now(),
    10
);
const mintConfiguration2 = await viewMintConfiguration(provider, creatorObj);
console.debug(mintConfiguration2);
console.debug(whitelistRes);
    // printJSON({
    //     //initResponse,
    //     mintConfiguration,
    //     creatorObj,
    // });

    //console.debug(BCS.serializeVectorWithFunc(['0', '1', '2', '3'], 'serializeStr'));
    //console.debug(BCS.serializeVectorWithFunc(['0x1::string::String', '0x1::string::String', '0x1::string::String', '0x1::string::String'], 'serializeStr'));
    //console.debug(HexString.fromUint8Array(BCS.serializeVectorWithFunc(['0x1::string::String', '0x1::string::String', '0x1::string::String', '0x1::string::String'], 'serializeStr')));
    //console.debug(HexString.fromUint8Array(BCS.serializeVectorWithFunc(['kkk0', 'kkk1', 'kkk2', 'kkk3'], 'serializeStr')));

    /*
    const res1 = await viewBcsValues(
        provider,
        ['023031', '023032', '023033', '023034'],
    )

    const res2 = await toVectorVectorU8(
        provider,
        ['0132'],
    )
    


    const enableMintingRes = await enableMinting(provider, account);
    console.debug(enableMintingRes);

    for (let i = 0; i < 1; i++) {
        const res3 = await addMetadataRaw(
            provider,
            account,
            BCS.serializeVectorWithFunc(['https://thisoneshouldwork.com/' + String(i)], 'serializeStr'),
            BCS.serializeVectorWithFunc(['desc1'], 'serializeStr'),
            new HexString('0x0104046b6b6b30046b6b6b31046b6b6b32046b6b6b33').toUint8Array(), // ['kkk1', 'kkk2', 'kkk3', 'kkk4']
            new HexString('0x0104023031023032023033023034').toUint8Array(),
            new HexString('0x0104133078313a3a737472696e673a3a537472696e67133078313a3a737472696e673a3a537472696e67133078313a3a737472696e673a3a537472696e67133078313a3a737472696e673a3a537472696e67').toUint8Array(),
        );
    }

    printJSON({
        res1,
        res2,
        whitelistRes,
        enableMintingRes,
    })

    */

    // const addMetadataTxHash = await addMetadata(
    //     provider,
    //     account,
    //     ['https://arweave.net/1', 'https://arweave.net/2'],
    //     ['0', '1'],
    //     [['asdf', 'asdf2'], ['asdf', 'asdf2']],
    //     [[new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3])], [new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3])]],
    //     [['asdf', 'asdf2'], ['asdf', 'asdf2']],
    // );
    console.debug(JSON.stringify(await mint(provider, account, address)));

})();