import useWeb3Provider from '../hooks/useWeb3Provider';
import { simpleRpcProvider } from '../lib/providers';
import { ethers } from 'ethers';

export const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};

export const useContract = (address: string, abi: any) => {
  const { library, account } = useWeb3Provider();
  if (library && account) return getContract(abi, address, library.getSigner(account));
};
