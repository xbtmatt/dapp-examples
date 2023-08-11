import { create } from "zustand";
import { AptosClient, HexString, Network, Provider, TokenClient } from "aptos";

interface State {
    provider: Provider;
    setProvider: (p: Provider) => void;
}

export const useStore = create<State>((set) => ({
    provider: new Provider(Network.DEVNET),
    setProvider: (p) => set({ provider: p }),
}));
