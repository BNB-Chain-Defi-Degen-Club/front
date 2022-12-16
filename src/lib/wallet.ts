// Set of helper functions to facilitate wallet setup
import { CHAIN_ID, CHAIN_NAME, RPC_URL, BASE_BSC_SCAN_URL } from '../constants/settings';

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */

export const setupNetwork = async () => {
  const provider = window.ethereum;
  if (provider && provider.request) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
      });
      return true;
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902 || switchError.code === -32603) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${CHAIN_ID.toString(16)}`,
                rpcUrls: [RPC_URL],
                chainName: CHAIN_NAME,
                nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'bnb' },
                blockExplorerUrls: [BASE_BSC_SCAN_URL],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error('Failed to setup the network in Metamask:', addError);
          return false;
        }
      }
      console.error('Failed to setup the network in Metamask:', switchError);
      return false;
    }
  } else {
    console.error("Can't setup the BNB network on metamask");
    return false;
  }
};
