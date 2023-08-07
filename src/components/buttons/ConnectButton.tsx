import * as React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import WalletModal from '../../wallet/WalletModal';
import { Wallet, useWallet } from "@aptos-labs/wallet-adapter-react";
import Button from './Button';

interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {
}

export const ConnectButton = (props: ButtonProps) => {
	const { connected, disconnect, wallets } = useWallet();
	const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false);

	const handleCloseWalletModal = () => { setWalletModalOpen(false) }
	const handleOpenWalletModal = useCallback(() => { setWalletModalOpen(true) }, []);

	const handleClick = useCallback((e: any) => {
		if (!connected) {
			handleOpenWalletModal();
		} else {
			disconnect();
		}
	}, [disconnect, connected, handleOpenWalletModal]);

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
				{connected ? "Disconnect" : "Connect"}
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

export default ConnectButton;
