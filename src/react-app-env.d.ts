// <reference types="react-scripts" />

interface Window {
  ethereum: {
    isMetaMask: boolean;
    selectedAddress: string;
    networkVersion: number;
    request: (...args: any[]) => Promise<void>;
  };
  BinanceChain?: {
    bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>;
  };
}
