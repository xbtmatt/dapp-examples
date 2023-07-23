

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