import { HexString, Provider, Network, TxnBuilderTypes, AptosAccount, BCS } from 'aptos';
import { RESOURCE_ACCOUNT_ADDRESS_HEXSTRING, addMetadata, addMetadataRaw, constructTypeTag, enableMinting, initializeMintMachine, mint, toVectorVectorU8, upsertTier, viewBcsValues, viewCreatorObject, viewMintConfiguration } from './mint-machine';
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

    const nested1 = [[[1], [2], [3]], [[1], [2], [3]]];
    const nested2 = [[['11', 'ab'], ['22'], ['33']], [['44'], ['55'], ['66']]];

    const nestedPolymorphic = ["1", 1, true, 123, "This is a sentence!", true, false, false, 255, 511, 1023, 2047];
    const nestedPolymorphicTypes = [PropertyType.STRING, PropertyType.U8, PropertyType.BOOL, PropertyType.U64,
    PropertyType.STRING, PropertyType.BOOL, PropertyType.BOOL, PropertyType.BOOL, PropertyType.U8, PropertyType.U16, PropertyType.U32, PropertyType.U64];

    // console.debug(await viewInputTypes(provider));
    // console.debug(await viewAllTypes(provider));

    // prettyPrint(await verifySimplePropertyMap(
    //     provider,
    //     account,
    //     ["bool_1", "bool_2", "bool_3"],
    //     [true, false, true],
    //     [
    //         PropertyType.BOOL,
    //         PropertyType.BOOL,
    //         PropertyType.BOOL
    //     ]
    // ));

    // prettyPrint(await verifySimplePropertyMap(
    //     provider,
    //     account,
    //     ["bool_1", "bool_2", "bool_3"],
    //     ["cat is out of the bag", "what comes around goes around", "always darkest before dawn"],
    //     [
    //         PropertyType.STRING,
    //         PropertyType.STRING,
    //         PropertyType.STRING
    //     ]
    // ));

    const r = await readStringFromKey(
        provider,
        new HexString('0x44b44416f673dcc97007c7a4a0bb78572977f6003db2293ba8f60af4a6e88064'),
        "bool_1",
    );

    console.debug(r);
    prettyView(r);

    // prettyPrint(await readPropertyMapKey(
    //     provider,
    //     new HexString('0x44b44416f673dcc97007c7a4a0bb78572977f6003db2293ba8f60af4a6e88064'),
    //     "bool_3",
    //     "string",
    // ));

    // view function calls that DO NOT work
    // TODO: Investigate later..?
    // ApiError: {"message":"unexpected end of input","error_code":"internal_error","vm_error_code":null}
    // calls:
        // const viewKey = await provider.view({
        //     function: constructTypeTag(RESOURCE_ACCOUNT_ADDRESS_HEXSTRING, 'property_map_utils', 'read_key'),
        //     type_arguments: ["bool"],
        //     arguments: ["so"],
        // });
        // const viewKey = await provider.view({
        //     function: constructTypeTag(RESOURCE_ACCOUNT_ADDRESS_HEXSTRING, 'property_map_utils', 'read_key'),
        //     type_arguments: ["u64"],
        //     arguments: ["1"],
        // });
        // console.debug(viewKey);

    // let addKeysResponse = await addKeys(
    //     provider,
    //     account,
    //     ["aaa", "bbb"],
    //     [1, 2],
    //     PropertyType.U64,
    // );
    // console.debug(stringifyResponse(addKeysResponse, 3));

    // let addKeyResponse2 = await addKey(
    //     provider,
    //     account,
    //     "a",
    //     new HexString('0x0100000000000000').toUint8Array(),
    //     PropertyType.BYTE_VECTOR,
    // );

    // console.debug(stringifyResponse(addKeyResponse2, 3));

    // let asdf1 = await verifySimplePropertyMap(
    //     provider,
    //     account,
    //     ["token_1_key_a", "token_1_key_b", "token_1_key_c"],
    //     [1, 2, 3],
    //     [
    //         PropertyType.U64,
    //         PropertyType.U64,
    //         PropertyType.U64
    //     ]
    // );



    // let res1 = await tryBcsSerialization(
    //     provider,
    //     account,
    //     "1c",
    //     "1d",
    //     PropertyType.STRING,
    // );

    // console.debug(stringifyResponse(res1, 3));

    // let res2 = await tryManyBcsSerialization(
    //     provider,
    //     account,
    //     ["#4", "#5", "#6",],
    //     [123, 234, 345],
    //     PropertyType.U64,
    // );

    // console.debug(stringifyResponse(res2, 3));





    return

    var testArray: Array<any> = ["1", "2", "3"];
    console.debug(BCS.serializeVectorWithFunc(testArray, 'serializeStr'))
    console.debug(serializeVectors(testArray, createTypedArray(testArray, PropertyType.STRING)))
    console.debug('------------------------------------------')

    console.debug(BCS.bcsSerializeStr("123"))
    testArray = [[49], [50], [51]];
    console.debug(BCS.serializeVectorWithFunc(testArray, 'serializeU8'))
    console.debug(serializeVectors(testArray, createTypedArray(testArray, PropertyType.U8)))
    console.debug('------------------------------------------')

    testArray = [true, true, true];
    console.debug(BCS.serializeVectorWithFunc(testArray, 'serializeBool'))
    console.debug(serializeVectors(testArray, createTypedArray(testArray, PropertyType.BOOL)))
    console.debug('------------------------------------------')

    testArray = [10, 15, 20];
    console.debug(BCS.serializeVectorWithFunc(testArray, 'serializeU64'))
    console.debug(serializeVectors(testArray, createTypedArray(testArray, PropertyType.U64)))
    console.debug('------------------------------------------')

    console.debug(BCS.serializeVectorWithFunc([true, true, true], 'serializeBool'))

    // console.debug(HexString.fromUint8Array(serializeVectors(nested1, createTypedArray(nested1, PropertyType.U8))));
    // console.debug(HexString.fromUint8Array(serializeVectors(nested2, createTypedArray(nested2, PropertyType.STRING))));
    //console.debug(HexString.fromUint8Array(serializeVectors(['1a', '2a', '3a'], PropertyType.STRING)));
    //console.debug(HexString.fromUint8Array(serializeVectors([100, 155, 255], PropertyType.U64)));
    //console.debug(HexString.fromUint8Array(serializePropertyValue('1a', PropertyType.STRING)));
    //console.debug(HexString.fromUint8Array(serializeVectors(['1a', '2a', '3a'], PropertyType.STRING)));
    //console.debug(HexString.fromUint8Array(serializeVectors([100, 155, 255], PropertyType.U64)));
    // console.debug(HexString.fromUint8Array(BCS.serializeVectorWithFunc(['1a', '2a', '3a'], 'serializeStr')));
    console.debug('------------------------------------------')
    // console.debug(BCS.serializeVectorWithFunc([true, true, true], 'serializeBool'));
    // console.debug(BCS.serializeVectorWithFunc([1, 2, 3], 'serializeUint64'));

    const pmapSimple = await verifySimplePropertyMap(
        provider,
        account,
        [],
        [],
        [],
    );

    // const pmapSimple = await verifySimplePropertyMap(
    //     provider,
    //     account,
    //     ["1", "2", "3"],
    //     [true, true, true,],
    //     [PropertyType.BOOL, PropertyType.BOOL, PropertyType.BOOL],
    // );

    console.debug(pmapSimple);

    // const pmapResponse = await verifyPropertyMaps(
    //     provider,
    //     account,
    //     [
    //         ["1", "2", "3"],
    //     ],
    //     [
    //         [true, true, true,],
    //     ],
    //     [
    //         [PropertyType.BOOL, PropertyType.BOOL, PropertyType.BOOL],
    //     ],
    // );


    // const pmapResponse = await verifyPropertyMaps(
    //     provider,
    //     account,
    //     [
    //         ["1a", "2a", "3a"],
    //         ["1b", "2b", "3b"],
    //         ["1c", "2c", "3c"],
    //     ],
    //     [
    //         ["1", 1, true],
    //         ["2", 2, false],
    //         ["3", 3, true],
    //     ],
    //     [
    //         [PropertyType.STRING, PropertyType.U8, PropertyType.BOOL],
    //         [PropertyType.STRING, PropertyType.U16, PropertyType.BOOL],
    //         [PropertyType.STRING, PropertyType.U32, PropertyType.BOOL],
    //     ],
    // );


    // const pmapResponse = await verifyPropertyMaps(
    //     provider,
    //     account,
    //     [
    //         ["Key 1a", "Key 2a", "Key 3a", "Key 4a", "Key 5a"],
    //         ["Key 1b", "Key 2b", "Key 3b", "Key 4b", "Key 5b"],
    //         ["Key 1c", "Key 2c", "Key 3c", "Key 4c", "Key 5c", "Key 6c"],
    //         ["Key 1d", "Key 2d", "Key 3d", "Key 4d", "Key 5d"],
    //     ],
    //     [
    //         ["Value 1a", "Value 2a", "Value 3a", true, 7],
    //         ["Value 2b", "Value 3b", "Value 4b", true, 7],
    //         [1, 2, 3, 4, 5, 6],
    //         [false, false, false, false, false],
    //     ],
    //     [
    //         [PropertyType.STRING, PropertyType.STRING, PropertyType.STRING, PropertyType.BOOL, PropertyType.U64],
    //         [PropertyType.STRING, PropertyType.STRING, PropertyType.STRING, PropertyType.BOOL, PropertyType.U64],
    //         [PropertyType.U8, PropertyType.U16, PropertyType.U32, PropertyType.U64, PropertyType.U128, PropertyType.U256],
    //         [PropertyType.BOOL, PropertyType.BOOL, PropertyType.BOOL, PropertyType.BOOL, PropertyType.BOOL],
    //     ],
    // );

    // console.debug(pmapResponse);

    return;

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
    //const mintConfiguration2 = await viewMintConfiguration(provider, creatorObj);
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