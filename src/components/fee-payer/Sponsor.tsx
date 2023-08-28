import * as React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import WalletModal from '../../wallet/WalletModal';
import { Wallet, useWallet } from "@aptos-labs/wallet-adapter-react";
import EntryFunctionButton from '../buttons/EntryFunctionButton';
import { AptosAccount, BCS, HexString, TxnBuilderTypes, Types, Provider, Network, TransactionBuilder, FaucetClient } from 'aptos';
import { EntryFunctionId, MoveType } from 'aptos/src/generated';
import { create } from 'domain';
interface SponsorTransactionProps extends React.HTMLAttributes<HTMLDivElement> {
}

const toAddress = TxnBuilderTypes.AccountAddress.fromHex("0xe7702b9e5d8542bf7e53654364b5c676228a85d0d376889eea43daa5397119aa");
const feePayer = new AptosAccount(); 
const faucetClient = new FaucetClient('https://fullnode.testnet.aptoslabs.com', 'https://faucet.testnet.aptoslabs.com');
const feePayerAccountAddress = TxnBuilderTypes.AccountAddress.fromHex(feePayer.address())
const provider = new Provider(Network.TESTNET);

export const SponsorTransaction = (props: SponsorTransactionProps) => {

	const { signAndSubmitBCSTransaction, signTransaction, account } = useWallet();

    const handleClick = async (to: TxnBuilderTypes.AccountAddress, amount: number) => {
        await faucetClient.fundAccount(feePayer.address(), 100_000_000);
        const payload = createPayload(to, amount);
        const rawTxn = await provider.generateTransaction(account!.address, payload);
        const signers: Array<TxnBuilderTypes.AccountAddress> = [];
        const feePayerTxn = new TxnBuilderTypes.FeePayerRawTransaction(rawTxn, signers, feePayerAccountAddress);
        const signedTransaction = HexString.ensure(await ((window as any).petra).signFeePayerTransaction(feePayerTxn)).toUint8Array();
        const senderAuthenticator = new TxnBuilderTypes.AccountAuthenticatorEd25519(
            new TxnBuilderTypes.Ed25519PublicKey(HexString.ensure(account!.publicKey as string).toUint8Array()),
            new TxnBuilderTypes.Ed25519Signature(signedTransaction),
        );
        const feePayerAuthenticator = await provider.signMultiTransaction(feePayer, feePayerTxn);
        const txn = await provider.submitFeePayerTransaction(feePayerTxn, senderAuthenticator, feePayerAuthenticator);
        const response = await provider.waitForTransactionWithResult(txn.hash);
        console.log(response);
    }

	return (
		<>
			<EntryFunctionButton
				buttonText='Sponsor transfer coins transaction'
				handleClick={() => { handleClick(toAddress, 1) }}
			>
			</EntryFunctionButton>
		</>
	);
}

export default SponsorTransaction;

const createPayload = (
    to: TxnBuilderTypes.AccountAddress,
    amount: number,
): Types.EntryFunctionPayload => {
    const payload: Types.TransactionPayload_EntryFunctionPayload = {
        type: 'entry_function_payload',
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        function: `0x1::aptos_account::transfer_coins`,
        arguments: [
            to.toHexString(),
            amount
        ]
    }
    return payload;
}