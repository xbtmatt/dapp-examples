import * as React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import WalletModal from '../../wallet/WalletModal';
import { Wallet, useWallet } from "@aptos-labs/wallet-adapter-react";
import EntryFunctionButton from '../buttons/EntryFunctionButton';
import { AptosAccount, BCS, HexString, TxnBuilderTypes, Types, Provider, Network, TransactionBuilder } from 'aptos';
import { EntryFunctionId, MoveType } from 'aptos/src/generated';
import { create } from 'domain';
interface SponsorTransactionProps extends React.HTMLAttributes<HTMLDivElement> {
}

const toAddress = TxnBuilderTypes.AccountAddress.fromHex("0xe7702b9e5d8542bf7e53654364b5c676228a85d0d376889eea43daa5397119aa");

const petraccount = new AptosAccount(); // normally have priv key here

const feePayerAccountAddress = TxnBuilderTypes.AccountAddress.fromHex(petraccount.address())

const provider = new Provider(Network.TESTNET);

export const SponsorTransaction = (props: SponsorTransactionProps) => {

	const { signAndSubmitBCSTransaction, signTransaction, account } = useWallet();

    console.log((window as any).petra);
    console.log((window as any).martian);
    console.log((window as any).rise);

    const handleClick = async (to: TxnBuilderTypes.AccountAddress, amount: number) => {
        const serializer = new BCS.Serializer();
        const payload = createPayload(to, amount);
        const rawTxn = await provider.generateTransaction(account!.address, payload);
        const signers: Array<TxnBuilderTypes.AccountAddress> = [];
        const feePayerTxn = new TxnBuilderTypes.FeePayerRawTransaction(rawTxn, signers, feePayerAccountAddress);
        console.log(account!.address);
        const multiTx = new TxnBuilderTypes.MultiAgentRawTransaction(rawTxn, [feePayerAccountAddress]);
        const feePayerTxnxx = await provider.generateFeePayerTransaction(
            account!.address,
            payload,
            feePayerAccountAddress.toHexString(),
            [feePayerAccountAddress.toHexString()],
        );
        console.log(multiTx);
        console.log(feePayerTxn);
        console.log(feePayerTxnxx);
        
            // It's because of this:
            //  the `getEntryFunctionPayloadInfo` is trying to parse the payload 'function' as `function` field
            // instead of `function_name`
            // 
            // this is *most* likely because you're trying to send it in as the incorrect type of payload entry function
            // I think this is the diff between bcs/non bcs payloads
        
        


        const signedTransaction = HexString.ensure(await ((window as any).petra).signMultiAgentTransaction(feePayerTxn)).toUint8Array();
        const senderAuthenticator = new TxnBuilderTypes.AccountAuthenticatorEd25519(
            new TxnBuilderTypes.Ed25519PublicKey(HexString.ensure(account!.publicKey as string).toUint8Array()),
            new TxnBuilderTypes.Ed25519Signature(signedTransaction),
        );
        // console.log(signedTransaction);
        // const multiAccountAuthenticator = new TxnBuilderTypes.AccountAuthenticatorEd25519(
            // new TxnBuilderTypes.Ed25519PublicKey(HexString.ensure(account!.publicKey as string).toUint8Array()),
            // new TxnBuilderTypes.Ed25519Signature(signedTransaction),
        // );
        // const accAuth = new TxnBuilderTypes.TransactionAuthenticatorMultiAgent()
        // console.log(signedTransaction);
        // console.log(signedTransaction.length);
        // console.log(account?.publicKey)
        const feePayerAuthenticator = await provider.signMultiTransaction(petraccount, feePayerTxn);
        // const multiAuthenticator = await provider.signMultiTransaction(petraccount, multiTx);
        // const multiAgentAuthenticator = new TxnBuilderTypes.TransactionAuthenticatorMultiAgent(
            // senderAuthenticator,
            // [TxnBuilderTypes.AccountAddress.fromHex(petraccount.address())],
            // [multiAuthenticator]
        // );
        console.log(senderAuthenticator)
        console.log(feePayerAuthenticator)
        // console.log(multiAuthenticator)
        // const txn = await provider.submitFeePayerTransaction(feePayerTxn, senderAuthenticator, feePayerAuthenticator)
        const txn = await provider.submitFeePayerTransaction(feePayerTxn, senderAuthenticator, feePayerAuthenticator);
        // const bcsTxn = BCS.bcsToBytes(new TxnBuilderTypes.SignedTransaction(rawTxn, feePayerAuthenticator));
        // const txn = await provider.submitSignedBCSTransaction(bcsTxn);
        console.log(txn.hash);
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
    // const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
    //     TxnBuilderTypes.EntryFunction.natural(
    //         "0x1::aptos_account",
    //         "transfer_coins",
    //         [],
    //         [
    //             BCS.bcsToBytes(to),
    //             BCS.bcsSerializeUint64(amount),
    //         ],
    //     )
    // );
    const payload: Types.TransactionPayload_EntryFunctionPayload = {
        type: 'entry_function_payload',
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        function: `0x1::aptos_account::transfer_coins`,
        arguments: [
            to.toHexString(),
            amount
        ]
    }
    console.log(payload);

    return payload;
}