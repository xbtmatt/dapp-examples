import * as React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import WalletModal from '../../wallet/WalletModal';
import { Wallet, useWallet } from "@aptos-labs/wallet-adapter-react";
import { disconnect } from 'process';

interface EntryFunctionButtonProps extends React.HTMLAttributes<HTMLDivElement> {
	handleClick: (e: any) => void,
	buttonText: string,
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
	}, [connected, handleOpenWalletModal]);

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
