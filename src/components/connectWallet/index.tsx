import ImgBNBLogo from '../../assets/bnbLogo.png';
import ImgWallet from '../../assets/wallet.svg';
import { useAlert } from '../../context/AlertContext';
import useMetamaskAuth from '../../hooks/useMetamaskAuth';
import { isMetamaskConnected, isMetamaskUnlocked } from '../../lib/metamaskOnboarding';
import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';

const ConnectWallet = () => {
  const { account } = useWeb3React();
  const { login: connectWallet } = useMetamaskAuth();
  const [openDropdown, setOpenDropdown] = useState(false);
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } = useAlert();

  const handleConnect = async () => {
    // 연결 요청
    try {
      await connectWallet();
      if (!(await isMetamaskUnlocked())) {
        showErrorAlert('Please check out Metamask wallet extension.');
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleClickProfile = () => {
    setOpenDropdown(!openDropdown);
  };

  return (
    <div>
      {account ? (
        <div className="relative">
          <button onClick={handleClickProfile}>
            <img src={ImgBNBLogo} alt="BDDC" />
          </button>
          {openDropdown && (
            <div className="absolute top-11 right-0 bg-amber-500 rounded">
              <ul className="w-32">
                <li className="flex items-center justify-between p-1">
                  <img src={ImgWallet} alt="wallet" className="mr-1" />
                  <h1 className="text-black text-sm">{account.slice(0, 5).concat('...').concat(account.slice(-5))}</h1>
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button onClick={handleConnect} className="px-2 py-1 bg-amber-500 rounded font-bold text-sm">
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
