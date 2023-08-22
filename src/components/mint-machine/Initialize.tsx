import * as React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import WalletModal from '../../wallet/WalletModal';
import { Wallet, useWallet } from "@aptos-labs/wallet-adapter-react";
import EntryFunctionButton from '../buttons/EntryFunctionButton';
import {
	initializeMintMachinePayload,
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
} from '@/modules/mint-machine/mint-machine';
import { BCS, TxnBuilderTypes, Types } from 'aptos';
import { EntryFunctionId, MoveType } from 'aptos/src/generated';
interface InitializeMintMachineProps extends React.HTMLAttributes<HTMLDivElement> {
}

export const Button = styled(motion.div)`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 10ch;
	max-width: 200px;
	font-family: expressway, sans-serif;
	border-radius: 1.5em;
	font-size: 0.65em;
	font-weight: 400;
	text-align: center;
	background: linear-gradient(to top, rgba(111, 121, 171) 0%, rgba(171, 171, 231) 100%);
	color: rgba(131, 255, 255);
	margin-bottom: 10px;
	padding: 2.15ch;
	padding-left: 2.25ch;
	padding-right: 2.25ch;
	pointer-events: auto;
	cursor: pointer;
	margin: auto;
	margin-top: 1ch;
	margin-bottom: 1.2ch;
	box-shadow: var(--nice-shadows);

	transition: 111ms;

	&:hover {
		cursor: pointer;
	}
`;



export const InitializeMintMachine = (props: InitializeMintMachineProps) => {

	const { signAndSubmitBCSTransaction } = useWallet();

	const handleClick = async() => {
		await signAndSubmitBCSTransaction(mintMultiplePayload(3));
	}

	return (
		<>
			<EntryFunctionButton
				buttonText='Mint Tickets'
				handleClick={() => { handleClick() }}
			>
			</EntryFunctionButton>
		</>
	);
}

export default InitializeMintMachine;

const MINT_MACHINE_MODULE_ADDRESS="0xe826b3d007fcf093af19eb002ccb2bada64c3f3d8e49cb2cb8cbaf251fc9d93e";

const MINT_MACHINE_ADMIN_ADDRESS="0xe7702b9e5d8542bf7e53654364b5c676228a85d0d376889eea43daa5397119aa";

export const mintMultiplePayload = (amount: number): TxnBuilderTypes.TransactionPayloadEntryFunction => {
  return new TxnBuilderTypes.TransactionPayloadEntryFunction(
    TxnBuilderTypes.EntryFunction.natural(
      `${MINT_MACHINE_MODULE_ADDRESS!}::mint_machine`,
      "mint_multiple",
      [],
      [
        BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(MINT_MACHINE_ADMIN_ADDRESS)),
        BCS.bcsSerializeUint64(amount),
      ],
    ),
  );
};