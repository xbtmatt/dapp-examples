import * as React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import WalletModal from '../../wallet/WalletModal';
import { Wallet, useWallet } from "@aptos-labs/wallet-adapter-react";
import { disconnect } from 'process';
import Button from './Button';

interface EntryFunctionButtonProps extends React.HTMLAttributes<HTMLDivElement> {
	handleClick: (e: any) => void,
	buttonText: string,
}

export const EntryFunctionButton = (props: EntryFunctionButtonProps) => {
	const { connected, disconnect, wallets } = useWallet();
	const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false);

	const handleCloseWalletModal = () => { setWalletModalOpen(false) }
	const handleOpenWalletModal = useCallback(() => { setWalletModalOpen(true) }, []);

	const handleClick = useCallback((e: any) => {
		if (!connected) {
			handleOpenWalletModal();
		} else {
			props.handleClick(e);
		}
	}, [props, connected, handleOpenWalletModal]);

	return (
		<>
			<Button
				whileHover={{ scale: 1.1, }}
				whileTap={{ scale: 1, }}
				style={{
					...props.style,
				}}
				onMouseUp={(e) => { if (e.button === 0) handleClick(e); }}
			>
				{props.buttonText}
			</Button>
			{
				(wallets ?? new Array<Wallet>).length > 0 &&
				<WalletModal
					isOpen={walletModalOpen}
					handleClose={handleCloseWalletModal}
					onAfterOpen={() => { }}
					onRequestClose={handleCloseWalletModal}
				/>
			}
		</>
	);
}

export default EntryFunctionButton;
