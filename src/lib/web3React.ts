import { CHAIN_ID } from '../constants/settings';
import { UnsupportedChainIdError } from '@web3-react/core';
import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import { ethers } from 'ethers';

export const injected = new InjectedConnector({
  supportedChainIds: [CHAIN_ID],
});

export function getErrorMessage(error: any) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return 'Please authorize to access your account';
  } else if (error.code === -32002) {
    console.error(error);
    return 'Please check out Metamask wallet extension.';
  } else {
    console.error(error);
    return 'An unknown error occurred.';
  }
}
export const getLibrary = (provider: any): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};
