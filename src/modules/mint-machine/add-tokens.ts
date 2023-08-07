import { AptosAccount, HexString, Provider, TxnBuilderTypes } from 'aptos';
import { addTokens, viewCreatorObject, viewMintConfiguration } from './mint-machine';
import TokensJSON from './json/tokens.json';
import TokensAddedJSON from './json/tokens-added.json';
import fs from 'fs';
import { join } from 'path';
import { prettyView } from '../string-utils';

const DIRNAME = __dirname;
const TOKENS_ADDED_FILE_PATH = join(DIRNAME, 'json/tokens-added.json');

export enum PropertyType {
    BOOL = "bool",
    U8 = "u8",
    U16 = "u16",
    U32 = "u32",
    U64 = "u64",
    U128 = "u128",
    U256 = "u256",
    ADDRESS = "address",
    BYTE_VECTOR = "vector<u8>",
    STRING = "0x1::string::String"
}


export type PropertyMapJSONType = string | boolean | number | number[];

///  These functions only support the following Typescript types: boolean, number, string, and Array<number>.
///  All are converted to bool, u64, 0x1::string::String, address, or vector<u8>
export type PropertyValue = boolean | number | string | Uint8Array | HexString;

export type TokenPropertyMaps = {
    uris: string[],
    descriptions: string[],
    propertyKeys: string[][],
    propertyValues: PropertyValue[][],
    propertyTypes: PropertyType[][],
}

type ExampleToken = {
    "https://tokens.com/1": {
        "Description": string,
        "Helmet": 'Metal Helmet',
        "Armor": 'Silver Armor',
        "Enemies Slain": 0,
        "Best Friend": "0x68d15865f69e7afb89f3400576ae7aae7beb7a5560aa8784dec6cd80c23f9857",
        "Alive": true,
        "Data": [
            0, 1, 2, 3, 4, 5, 6, 7
        ],
    }
}

type TokenUri = string;
type AdminAddress = string;

type Response = {
    success: boolean,
    explorerUrl: string,
}
export type TokensAdded = Record<TokenUri, Response>;

// cast to a dictionary (Record) and delete the default value that typescript sometimes imports
const tokensToAdd = TokensJSON as Record<TokenUri, any>;
if ('default' in tokensToAdd) {
    delete tokensToAdd['default'];
}

const tokensAddedPerAdmin = TokensAddedJSON as Record<AdminAddress, TokensAdded>;
if ('default' in tokensAddedPerAdmin) {
    delete tokensAddedPerAdmin['default'];
}

// Function to divide an array into chunks
function chunkArray<T>(array: T[], size: number): T[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

/// This function takes in the imported "tokens.json" JSON file and processes them to be passed into the addTokens function
///  - Adds `chunkSize` tokens to the token metadata, from the index `start` to `start + chunkSize`
///  - Only processes `numTokens` tokens,
///  - It converts typescript types into Move types with the toGeneralTypeTag function
///  - It only supports the following Typescript types: boolean, number, string, and Array<number>. All are converted to bool, u64, 0x1::string::String, address, or vector<u8>
///  - All fields except the "description" field in each token's JSON data will be included as property map traits
///  - For each attempt to add a token, a value of tokenUri: Response is added to a `tokens-added.json` array, with the admin address as the key
///      - This records the last successful (or unsuccessful) attempt to add a token so that it makes no repeated attempts
///      - The the adminAccount is the account adding tokens to the metadata, and ultimately the indirect owner of the collection (it owns the object that creates the collections)
export async function addTokensInChunks(
    provider: Provider,
    adminAccount: AptosAccount,
    chunkSize: number = 50,   // Number of tokens added per transaction. If you are getting a FAILED_TO_DESERIALIZE_ARGUMENT and you are using a large chunkSize, try reducing it first.
    verifyTokensAdded: boolean = true,   // Verifies that the tokens recorded in `tokens-added.json` is equal to the number of tokens in the tokensToAdd
    verifyMaxSupply: boolean = true,     // Verifies that the max supply of the tokens.json file equals the max supply of the collection
    verifySerialization: boolean = true, // Validates that the propertyValues were correctly serialized, this increases the gas cost for each token added
) {
    const adminAddress = adminAccount.address().toString();
    if (!(adminAddress in tokensAddedPerAdmin)) {
        tokensAddedPerAdmin[adminAddress] = {};
    }
    // If the admin address isn't in tokens-added.json, add it
    const tokensAdded: TokensAdded = (!Object.keys(tokensAddedPerAdmin).includes(adminAddress)) ? {} : tokensAddedPerAdmin[adminAddress];
    const tokensToAddFiltered: Record<TokenUri, any> = {};

    const tokensSuccessfullyAdded: TokensAdded = {}

    // Iterate over tokensToAdd and filter out the ones that have been successfully added
    Object.keys(tokensToAdd).forEach(tokenUriToAdd => {
        const response = tokensAdded[tokenUriToAdd];

        // If the token is not in tokensAdded or the last attempt to add it failed, include it in tokensToAddFiltered
        if (!response || !response.success) {
            tokensToAddFiltered[tokenUriToAdd] = tokensToAdd[tokenUriToAdd];
        } else {
            tokensSuccessfullyAdded[tokenUriToAdd] = response;
        }
    });
    
    const mintConfiguration = await viewMintConfiguration(provider, await viewCreatorObject(provider, adminAccount.address()));
    const maxSupply = Number(mintConfiguration.max_supply);
    const numTokensAddedOnChain = Number(mintConfiguration.metadata_table.size);

    // verifyTokensAdded: Verify that the tokens added on chain matches the number of tokens in tokens-added.json
    // verifyMaxSupply: Verify that the number of tokens to add + the number on chain already is less than the max supply
    if (verifyTokensAdded || verifyMaxSupply) {
        const adminAddress = adminAccount.address().toString();
        const numTokensInJSON = Object.keys(tokensSuccessfullyAdded).length;
        if (verifyTokensAdded && numTokensAddedOnChain !== numTokensInJSON) {
            console.error(`[ERROR]: Admin address: ${adminAddress}\nThe number of tokens added on chain [${numTokensAddedOnChain}] does not match `
            + `the number of tokens in tokens-added.json [${numTokensInJSON}].` + '\n'
            + `If you would like to proceed anyway, set the 'safe' parameter to false.`);
            throw new Error('VERIFY_TOKENS_ADDED_FAILED');
        }
        const numTokensToAdd = Object.keys(tokensToAddFiltered).length;
        if (verifyMaxSupply && (numTokensAddedOnChain + numTokensToAdd) >= maxSupply) {
            console.error(`[ERROR]: Admin address: ${adminAddress}\nThe number of tokens already added [${numTokensAddedOnChain}] plus the number of tokens to add [${numTokensToAdd}] ` + 
            `is greater than the max supply of the collection [${maxSupply}].` + '\n');
            throw new Error('VERIFY_MAX_SUPPLY_FAILED');
        }
    }

    const tokenPropertyMaps = processTokens(tokensToAddFiltered);

    // Even if we don't verify tokens, we stop adding more when the max supply on chain has been reached by truncating chunkSize to supplyLeft
    const supplyLeft = maxSupply - numTokensAddedOnChain;
    await addTokensAndWriteToFile(provider, adminAccount, chunkSize, tokenPropertyMaps, verifySerialization, TOKENS_ADDED_FILE_PATH, supplyLeft);

}

export async function addTokensAndWriteToFile(
    provider: Provider,
    adminAccount: AptosAccount,
    chunkSize: number,
    tokenPropertyMaps: TokenPropertyMaps,
    verifySerialization: boolean,
    filePath: string,
    supplyLeft: number,
) {
    const adminAddress = adminAccount.address().toString();
    let quitAfterNextChunk = false;
    // Split the arrays into sections of chunkSize
    for (let i = 0; i < tokenPropertyMaps.uris.length && !quitAfterNextChunk; i += chunkSize) {
        if (chunkSize > supplyLeft) {
            if (supplyLeft == 0) {
                console.log(`[INFO]: Admin address: ${adminAddress}\n` + 
                            `[INFO]: Max supply reached, no more tokens to add.`)
                return;
            }
            console.log(`[INFO]: Admin address: ${adminAddress}\n` +
                        `[INFO]: Max supply exceeded, only adding ${supplyLeft} tokens.`)
            chunkSize = supplyLeft;
            quitAfterNextChunk = true;
        }
        const urisChunk = tokenPropertyMaps.uris.slice(i, i + chunkSize);
        const descriptionsChunk = tokenPropertyMaps.descriptions.slice(i, i + chunkSize);
        const propertyKeysChunk = tokenPropertyMaps.propertyKeys.slice(i, i + chunkSize);
        const propertyValuesChunk = tokenPropertyMaps.propertyValues.slice(i, i + chunkSize);
        const propertyTypesChunk = tokenPropertyMaps.propertyTypes.slice(i, i + chunkSize);

        // Call addTokens with the chunks
        try {
            const result = await addTokens(provider, adminAccount, {
                    uris: urisChunk, 
                    descriptions: descriptionsChunk, 
                    propertyKeys: propertyKeysChunk, 
                    propertyValues: propertyValuesChunk, 
                    propertyTypes: propertyTypesChunk, 
                    safe: verifySerialization
                });
            
            const thisRecord: TokensAdded = {}
            // Try to write to file, if not, print it out so user can at least try to parse
            const explorerUrl = `https://explorer.aptoslabs.com/txn/${result.version}/?network=${provider.network}`;
            try {
                supplyLeft -= urisChunk.length;
                urisChunk.forEach((uri) => {
                    const r = {
                        success: Boolean(result.success),
                        explorerUrl,
                    };
                    thisRecord[uri] = r;
                    tokensAddedPerAdmin[adminAddress][uri] = r;
                });
                prettyView({
                    version: result.version,
                    timestamp: new Date(Number(result.timestamp) / 1000),
                    success: Boolean(result.success),
                    tokensAdded: Object.keys(thisRecord).length,
                    supplyLeft: supplyLeft,
                    explorerUrl,
                });
                fs.writeFileSync(filePath, JSON.stringify(tokensAddedPerAdmin, null, 3));
            } catch (e) {
                console.log(thisRecord);
                console.error(e);
            }
        } catch (e) {
            console.error(e);
        }
    }
}

type TokenPropertyMap = {
    uri: string,
    description: string,
    propertyKeys: string[],
    propertyValues: PropertyValue[],
    propertyTypes: PropertyType[],
}

export function processTokens(tokensJson: Record<string, any>): TokenPropertyMaps {
    const uris: string[] = [];
    const descriptions: string[] = [];
    const outerPropertyKeys: string[][] = [];
    const outerPropertyValues: PropertyValue[][] = [];
    const outerPropertyTypes: PropertyType[][] = [];
    // For each token in tokensJson, convert the values to valid property map keys, values, and types
    // The uri is the key, the rest of the fields are to be used in the property map
    Object.keys(tokensJson).forEach(tokenUri => {
        const tokenPropertyMap: TokenPropertyMap = {
            uri: tokenUri,
            description: '',
            propertyKeys: [],
            propertyValues: [],
            propertyTypes: [],
        }

        const token = tokensJson[tokenUri];
        for (const key of Object.keys(token)) {
            const value = token[key];

            // Push the description if it exists, don't push the key to the property map
            if (key.toLowerCase() === 'description') {
                tokenPropertyMap.description = value;
                continue;
            } else {
                // Push the key if it's a property map field
                tokenPropertyMap.propertyKeys.push(key);
                if (typeof value === 'string') {
                    // address
                    if (value.startsWith('0x') && TxnBuilderTypes.AccountAddress.isValid(value)) {
                        tokenPropertyMap.propertyValues.push(new HexString(value));
                        tokenPropertyMap.propertyTypes.push(PropertyType.ADDRESS);
                    // string
                    } else {
                        tokenPropertyMap.propertyValues.push(value);
                        tokenPropertyMap.propertyTypes.push(PropertyType.STRING);
                    }
                // bool
                } else if (typeof value === 'boolean') {
                    tokenPropertyMap.propertyValues.push(value);
                    tokenPropertyMap.propertyTypes.push(PropertyType.BOOL);
                // u64
                } else if (typeof value === 'number') {
                    tokenPropertyMap.propertyValues.push(value);
                    tokenPropertyMap.propertyTypes.push(PropertyType.U64);
                // vector<u8>
                } else if (Array.isArray(value) && value.every(item => typeof item === 'number')) {
                    tokenPropertyMap.propertyValues.push(new Uint8Array(value));
                    tokenPropertyMap.propertyTypes.push(PropertyType.BYTE_VECTOR);
                } else {
                    throw new Error(`Invalid JSON type for property map: tokens[${key}]: ${value}`);
                }
            }
        }

        uris.push(tokenPropertyMap.uri);
        descriptions.push(tokenPropertyMap.description);
        outerPropertyKeys.push(tokenPropertyMap.propertyKeys);
        outerPropertyValues.push(tokenPropertyMap.propertyValues);
        outerPropertyTypes.push(tokenPropertyMap.propertyTypes);
    });

    return {
        uris,
        descriptions,
        propertyKeys: outerPropertyKeys,
        propertyValues: outerPropertyValues,
        propertyTypes: outerPropertyTypes,
    };
}


/// We provide a general conversion function for typescript types to TypeTag.
/// Typescript => Move type
/// boolean => bool
/// number => u64
/// TxnBuilderTypes.AccountAddress => address
/// string => 0x1::string::String
/// Uint8Array => vector<u8>
export function toGeneralTypeTag(v: PropertyValue): TxnBuilderTypes.TypeTag {
    if (typeof v === 'boolean') {
        return new TxnBuilderTypes.TypeTagBool();
    } else if (typeof v === 'number') {
        return new TxnBuilderTypes.TypeTagU64();
    } else if (v instanceof TxnBuilderTypes.AccountAddress) {
        return new TxnBuilderTypes.TypeTagAddress();
    } else if (typeof v === 'string') {
        return new TxnBuilderTypes.TypeTagStruct(TxnBuilderTypes.StructTag.fromString('0x1::string::String'));
    } else if (v instanceof Uint8Array) {
        return new TxnBuilderTypes.TypeTagVector(new TxnBuilderTypes.TypeTagU8());
    } else {
        throw new Error(`Unknown type: ${v}`);
    }
}
