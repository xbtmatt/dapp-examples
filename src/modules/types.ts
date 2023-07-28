import { HexString } from "aptos";


export interface ScriptFunctionPayload {
	type: string;

	/**
	 * Script function id is string representation of a script function defined on-chain.
	 *
	 * Format: `{address}::{module name}::{function name}`
	 * Both `module name` and `function name` are case-sensitive.
	 */
	function: ScriptFunctionId;

	/** Generic type arguments required by the script function. */
	type_arguments: MoveTypeTagId[];

	/** The script function arguments. */
	arguments: MoveValue[];
}

export type ScriptFunctionId = string;
export type MoveTypeTagId = string;
export type MoveValue = any;


// MintMachine types
export interface MintConfiguration {
    collection_name: string;
    collection_addr: HexString;
    max_supply: number;
    token_base_name: string;
    minting_enabled: boolean;
    extend_ref: any;
    delete_ref: any;
    token_uris: any; // Assuming SmartVector is any for now.
    metadata_table: any; // Assuming SmartTable is any for now.
}