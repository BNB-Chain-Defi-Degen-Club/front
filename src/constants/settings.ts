import { enUS } from 'date-fns/locale';
import { ethers } from 'ethers';

export const MAX_CHALLENGES = 6;
export const ALERT_TIME_MS = 2000;
export const LONG_ALERT_TIME_MS = 10000;
export const REVEAL_TIME_MS = 350;
export const WELCOME_INFO_MODAL_MS = 350;
export const DISCOURAGE_INAPP_BROWSERS = true;
export const ENABLE_MIGRATE_STATS = true;
export const BLOWFISH_KEY = 'xcQUAHsik#Thq&LG*8es2DsZ$3bw^e';
export const BLOWFISH_IV = '#45XmF^w';
export const ENABLE_ARCHIVED_GAMES = false;
export const DATE_LOCALE = enUS;

export const isDevelopment = () => {
  // return window.location.hostname !== 'domain';
  return true;
};

export const BASE_URL = '';
export const RPC_URL = isDevelopment()
  ? 'https://data-seed-prebsc-1-s1.binance.org:8545'
  : 'https://bsc-dataseed.binance.org';
export const BASE_BSC_SCAN_URL = isDevelopment() ? 'https://testnet.bscscan.com' : 'https://bscscan.com';
export const SNAPSHOT_BASE_URL = isDevelopment() ? 'https://testnet.snapshot.org' : 'https://hub.snapshot.org';
export const CHAIN_ID = isDevelopment() ? 97 : 56;
export const CHAIN_NAME = isDevelopment() ? 'Binance Smart Chain Testnet' : 'Binance Smart Chain Mainnet';

export const DEFAULT_TOKEN_DECIMAL = 18;
export const DEFAULT_GAS_LIMIT = 200000;

export const GAME_FEE = '0.001'; //수정필요
export const GAME_CONTRACT_ADDRESS = isDevelopment()
  ? '0xDed26Be6b2B09Fb9A29A26966C8B04C89A3F2617'
  : '0xDed26Be6b2B09Fb9A29A26966C8B04C89A3F2617';
export const TREASURY_CONTRACT_ADDRESS = isDevelopment()
  ? '0x9C20bc8309569070DEc6D705B8F1D61EB815f60c'
  : '0x9C20bc8309569070DEc6D705B8F1D61EB815f60c';
export const MINT_CONTRACT_ADDRESS = isDevelopment()
  ? '0xE41D27553137e3d7CC047d3a86fBC629ef2811Ce'
  : '0xE41D27553137e3d7CC047d3a86fBC629ef2811Ce';
export const CAKE_CONTRACT_ADDRESS = isDevelopment()
  ? '0xFa60D973F7642B748046464e165A65B7323b0DEE'
  : '0xFa60D973F7642B748046464e165A65B7323b0DEE';

export enum GAS_PRICE {
  default = '5',
  fast = '6',
  instant = '7',
  testnet = '10',
}

export const GAS_PRICE_GWEI = {
  default: isDevelopment()
    ? ethers.utils.parseUnits(GAS_PRICE.testnet, 'gwei').toString()
    : ethers.utils.parseUnits(GAS_PRICE.default, 'gwei').toString(),
  fast: ethers.utils.parseUnits(GAS_PRICE.fast, 'gwei').toString(),
  instant: ethers.utils.parseUnits(GAS_PRICE.instant, 'gwei').toString(),
};

export const uint256_MAX_INT = ethers.constants.MaxUint256;
