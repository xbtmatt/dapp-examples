import { AptosAccount, Provider } from 'aptos';
import { PropertyType } from './pmap-utils';
import { addTokens } from './mint-machine';

export interface Token {
  uri: string;
  //traits: number;
  background: string;
  body: string;
  clothing: string;
  eyes: string;
  mouth: string;
  headwear: string;
  fly: string;
  //rarity: number;
}

export async function processTokens(
    provider: Provider,
    account: AptosAccount,
    numTokens: number,
    start: number,
    tokensDict: Record<string, Token>,
    safe: boolean = true,
  ): Promise<Array<any>> {
    const uris: Array<string> = [];
    const descriptions: Array<string> = [];
    const propertyKeys: Array<Array<string>> = [];
    const propertyValues: Array<Array<string>> = [];
  
    const keys = Object.keys(tokensDict).slice(start, start + numTokens);
    for (const key of keys) {
      const token = tokensDict[key];
  
      uris.push(token.uri);
      descriptions.push(`Aptoad #${key}`);
  
      // Exclude keys that are not relevant; here, I'm assuming 'uri' is not relevant
      const keysForToken = Object.keys(token).filter(k => !['uri', 'traits', 'rarity'].includes(k));
      const filteredKeys: string[] = [];
      const filteredValues: string[] = [];
  
      for (const k of keysForToken) {
        const value = token[k as keyof Token];

        if (value !== "None") {
          filteredKeys.push(k);
          filteredValues.push(value);
        }
      }
  
      propertyKeys.push(filteredKeys);
      propertyValues.push(filteredValues);
    }
  
    // Other values needed for addTokens call
    const propertyTypes: PropertyType = PropertyType.STRING;
  
    // Split the arrays into sections of numTokens
    const chunkSize = numTokens;
    const results = [];
    for (let i = 0; i < uris.length; i += chunkSize) {
      const urisChunk = uris.slice(i, i + chunkSize);
      const descriptionsChunk = descriptions.slice(i, i + chunkSize);
      const propertyKeysChunk = propertyKeys.slice(i, i + chunkSize);
      const propertyValuesChunk = propertyValues.slice(i, i + chunkSize);
  
      // Call addTokens with the chunks
      const result = await addTokens(provider, account, urisChunk, descriptionsChunk, propertyKeysChunk, propertyValuesChunk, propertyTypes, safe);
      results.push(result);
    }
    return results;
  }
  