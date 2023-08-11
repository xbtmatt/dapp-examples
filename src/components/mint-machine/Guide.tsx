import * as React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import WalletModal from "../../wallet/WalletModal";
import { Wallet, useWallet } from "@aptos-labs/wallet-adapter-react";
import InitializeMintMachine from "./Initialize";

interface MintMachineGuideProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MintMachineGuide = (props: MintMachineGuideProps) => {
    return (
        <>
            <InitializeMintMachine />
        </>
    );
};

export default MintMachineGuide;
