
import Modal from 'react-modal';
import styled from 'styled-components';
import { defined } from '../modules/utils';
import { motion } from 'framer-motion';
import CloseButtonSVG from '../components/svg/CloseButton';
import { useWallet, Wallet, WalletReadyState } from '@aptos-labs/wallet-adapter-react';

const ModalWrapper = styled.div`
display: flex;
flex-direction: column;
place-content: center;
height: auto;
width: auto;
color: white;
padding: 1.7em;
padding-top: 1.3em;
padding-bottom: 1.3em;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 0.5em;
  height: 2em;
  width: 2em;
  z-index: 3;
  filter: invert(1);

  &:hover {
	 cursor: pointer;
  }
`;
Modal.setAppElement('#__next');

interface MintModalProps {
	isOpen: boolean,
	handleClose: () => void,
	onAfterOpen: () => void,
	onRequestClose: () => void,
}

const WalletChoice = styled(motion.div)`
	display: flex;
	font-family: expressway, sans-serif;
	font-weight: 700;
	color: white;
	background: var(--background-dark-neutral-gradient);
	font-size: 1.4em;
	text-align: left;
	height: var(--small-button-height);
	padding-left: calc(2.1em + 1.4em);
	padding-right: calc(2.1em);
	//place-content: left;
	border-radius: 7px;
	margin: 7px;
	box-shadow: var(--sexy-shadows);

	&:hover {
		cursor: pointer;
	}
`;

const LogoAndText = styled.div`
	display: flex;
	flex-direction: row;
	height: 100%;
	width: 100%;
	position: relative;
`;

export const WalletModal = (props: MintModalProps) => {
	const {
		connected,
		connect,
		disconnect,
		wallet,
		wallets,
	} = useWallet();

	const iconStyle: any = { position: 'absolute', transform: 'translateY(-50%)', top: '50%', marginTop: '0px', marginLeft: '-1.5em', height: '1em', width: '1em', };

	const walletList = (wallets ?? new Array<Wallet>).map( (wallet) => {
		return (
		(defined(wallet, wallet.readyState) && wallet.readyState == WalletReadyState.Installed) &&
				<WalletChoice
					key={wallet.name}
					onClick={ () => { connect(wallet.name); props.handleClose(); } }
					whileHover={{
						x: '0.31em',
						background: 'linear-gradient(to top right, rgb(81, 101, 150) 0%, rgb(171, 181, 151) 100%)',
						transition: {
							background: {
								from: 'linear-gradient(to top right, rgb(18, 36, 57) 0%, rgb(41, 59, 80) 100%)',
								type: 'spring',
								duration: 1,
							},
							x: {
								type: 'spring',
								duration: 0.2,
							}
						}
					}}
					whileTap={{
						scale: 0.95,
						transition: {
							duration: 0.1,
							type: 'spring',
						}
					}}
				>
					<LogoAndText>
						<img alt={`${wallet.name} icon`} style={iconStyle} src={wallet.icon} />
						<div style={{ display: 'flex', marginTop: 'auto', marginBottom: 'auto', textAlign: 'left', }}>{wallet.name === 'Rise Wallet' ? 'Rise' : wallet.name === 'TrustWallet' ? 'Trust' : wallet.name}</div>
					</LogoAndText>
				</WalletChoice>
		);
	});

	return (
		<Modal
			isOpen={props.isOpen}
			onAfterOpen={props.onAfterOpen}
			onRequestClose={props.handleClose}
			style={{
				overlay: {
					outline: 'none', background: 'rgba(0, 0, 0, .95)', zIndex: '2',
				},
				content: {
					top: '50%', left: '50%', right: 'auto', bottom: 'auto',
					marginRight: '-50%',
					transform: 'translate(-50%, -50%)',
					background: 'rgba(21, 31, 41, 1)',
					borderRadius: '10px',
					border: 'none',
					overflow: 'none',
				},
			}}
		>
			<ModalWrapper>
				<CloseButton onClick={props.handleClose}>
					<CloseButtonSVG />
				</CloseButton>
				{walletList.length == 0 ? <div>You don&apos;t have any wallets.</div> : walletList}
			</ModalWrapper>
		</Modal>
	);
}

export default WalletModal;