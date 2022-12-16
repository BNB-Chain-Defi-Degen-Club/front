import { RPC_URL } from '../constants/settings';
import { ethers } from 'ethers';

export const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(RPC_URL);
