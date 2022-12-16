import ABI_GAME from '../../abi/BDDCGame.json';
import { GAME_FEE, GAME_CONTRACT_ADDRESS } from '../../constants/settings';
import { BNB_PAID_SUCCESSFULLY } from '../../constants/strings';
import { useAlert } from '../../context/AlertContext';
import { useContract } from '../../hooks/useContract';
import useWeb3Provider from '../../hooks/useWeb3Provider';
import { BaseModal } from './BaseModal';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleSetPaid: () => void;
}

const NeedFeeModal = ({ isOpen, handleClose, handleSetPaid }: Props) => {
  const { account } = useWeb3React();
  const { library } = useWeb3Provider();
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } = useAlert();
  const gameContract = useContract(GAME_CONTRACT_ADDRESS, ABI_GAME);
  const gameInterface = new ethers.utils.Interface(ABI_GAME);

  const handleClickStartGame = async () => {
    try {
      if (account && library && gameContract) {
        const parsedAmount = ethers.utils.parseUnits(GAME_FEE);
        const amountToHexValue = ethers.utils.hexValue(parsedAmount);

        // //트랜잭션에 사용할 data를 위해 인코딩
        const data = gameInterface.encodeFunctionData('insertCoin');

        const gasLimit = await library.estimateGas({
          from: account,
          to: GAME_CONTRACT_ADDRESS,
          data,
          value: amountToHexValue,
        });
        const gasLimitToHexValue = ethers.utils.hexValue(gasLimit.add(100000));

        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: account,
              to: GAME_CONTRACT_ADDRESS,
              gas: gasLimitToHexValue,
              data,
              value: amountToHexValue,
            },
          ],
        });
        if (String(txHash)) {
          localStorage.setItem('paidTxHash', String(txHash));
          handleClose();
          showSuccessAlert(BNB_PAID_SUCCESSFULLY);
          handleSetPaid();
        }
      }
    } catch (error) {
      showErrorAlert('Failed');
      console.error(error);
    }
  };

  return (
    <BaseModal title="0.001BNB Required" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        You have to pay a participation fee(0.001BNB) to start the game. You can get a reward if you get the right
        answer.
      </p>

      <button onClick={handleClickStartGame} className="w-full	px-2 py-1 mt-5 bg-amber-500 rounded-sm font-bold">
        Start Game
      </button>
    </BaseModal>
  );
};

export default NeedFeeModal;
