import Image from "next/image";
import styles from "../app/index.module.css";
import WalletModal from "@/wallet/WalletModal";
import { useState } from "react";
import { NextPage } from "next";
import ConnectButton from "@/components/buttons/ConnectButton";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ScriptFunctionPayload } from "@/modules/types";
import { HexString, BCS, TxnBuilderTypes } from "aptos";
import OnRender from "@/components/utils/OnRender";
import { publishPayloadWithPackageManager } from "@/modules/package-manager/publish-package";
import EntryFunctionButton from "@/components/buttons/EntryFunctionButton";
import MintMachineGuide from "@/components/mint-machine/Guide";

const IndexPage: NextPage = () => {
    const {
        connected,
        connect,
        disconnect,
        wallet,
        wallets,
        network,
        signAndSubmitTransaction,
        signAndSubmitBCSTransaction,
    } = useWallet();

    const handleCloseWalletModal = () => {};
    const handleCloseMintModal = () => {};

    return (
        <OnRender>
            <ConnectButton />
            <EntryFunctionButton
                buttonText="Publish Package"
                handleClick={() => {}}
            ></EntryFunctionButton>
            <MintMachineGuide />
        </OnRender>
    );
};

export default IndexPage;
