import { RiseWallet } from "@rise-wallet/wallet-adapter";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { TrustWallet } from "@trustwallet/aptos-wallet-adapter";
import {
  AptosWalletAdapterProvider,
  NetworkName,
} from "@aptos-labs/wallet-adapter-react";
import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
import { MSafeWalletAdapter } from "msafe-plugin-wallet-adapter";
import { BloctoWallet } from "@blocto/aptos-wallet-adapter-plugin";
import { WelldoneWallet } from "@welldone-studio/aptos-wallet-adapter";
import { NightlyWallet } from "@nightlylabs/aptos-wallet-adapter-plugin";

import {
  AutoConnectProvider,
  useAutoConnect,
} from "./AutoConnectProvider";
import { FC, ReactNode } from "react";
import { getNetworkName } from "../modules/utils";

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();

  const wallets = [
    new PetraWallet(),
    new MartianWallet(),
    new RiseWallet(),
    new PontemWallet(),
    //new TrustWallet(),
    new FewchaWallet(),
    new MSafeWalletAdapter(),
    new NightlyWallet(),
    // Blocto supports Testnet/Mainnet for now.
    new BloctoWallet({
      network: getNetworkName() as string == 'mainnet' ? NetworkName.Mainnet : getNetworkName() as string == 'testnet' ? NetworkName.Testnet : undefined,
      bloctoAppId: process.env.NEXT_PUBLIC_BLOCTO_APP_ID!,
    }),
    //new WelldoneWallet(),
  ];

  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={autoConnect}>
      {children}
    </AptosWalletAdapterProvider>
  );
};

export const AppContext: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AutoConnectProvider>
      <WalletContextProvider>{children}</WalletContextProvider>
    </AutoConnectProvider>
  );
};