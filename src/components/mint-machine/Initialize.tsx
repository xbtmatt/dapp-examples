import * as React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import WalletModal from '../../wallet/WalletModal';
import { Wallet, useWallet } from "@aptos-labs/wallet-adapter-react";
import EntryFunctionButton from '../buttons/EntryFunctionButton';
import {
	InitializeMintMachineProps,
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
    DEFAULT_MAX_WHITELIST_MINTS_PER_USER,
    DEFAULT_MAX_PUBLIC_MINTS_PER_USER,
} from '@/modules/mint-machine/mint-machine';
import { Types } from 'aptos';
interface InitializeMintMachinePrpos extends React.HTMLAttributes<HTMLDivElement> {
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



export const InitializeMintMachine = (props: InitializeMintMachinePrpos) => {

	const { signAndSubmitTransaction } = useWallet();

	const [mintMachineConfig, setMintMachineConfig] = useState<InitializeMintMachineProps>({
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

	const handleInitialization = useCallback((e: any) => {
		const payload = initializeMintMachinePayload(mintMachineConfig);

		console.log(payload);
		console.log(payload as unknown as Types.TransactionPayload);

		//await signAndSubmitTransaction(payload as Types.TransactionPayload);

	}, [mintMachineConfig]);


	return (
		<>
			<EntryFunctionButton
				buttonText='Initialize Mint Machine'
				handleClick={handleInitialization}
			>
			</EntryFunctionButton>
		</>
	);
}

export default InitializeMintMachine;
