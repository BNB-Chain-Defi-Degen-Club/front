import ABI_DLP from '../abi/DLP.json';
import BNB from '../assets/Ellipse10.png';
import CAKE from '../assets/Ellipse11.png';
import WOM from '../assets/Ellipse12.png';
import BUSD from '../assets/Ellipse26.png';
import USDT from '../assets/Ellipse27.png';
import USDC from '../assets/Ellipse28.png';
import { DLP_CONTRACT_ADDRESS } from '../constants/settings';
import { useAlert } from '../context/AlertContext';
import { getContract, useContract } from '../hooks/useContract';
import useWeb3Provider from '../hooks/useWeb3Provider';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { ChangeEvent, MutableRefObject, useEffect, useRef, useState } from 'react';

const Pool = () => {
  const dlpContract = getContract(ABI_DLP, DLP_CONTRACT_ADDRESS); //provider = ethers
  const udlpContract = useContract(DLP_CONTRACT_ADDRESS, ABI_DLP); //provider = user
  const dlpInterface = new ethers.utils.Interface(ABI_DLP);
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } = useAlert();

  const [openTokenDropdown, setOpenTokenDropdown] = useState(false);
  const [fromToken, setFromToken] = useState('BNB');
  const [fromBalance, setFromBalance] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [toToken, setToToken] = useState('BNB');
  const [toAmount, setToAmount] = useState('');
  const [tradeState, setTradeState] = useState('buy');
  const [stakeState, setStakeState] = useState('stake');
  const [apr, setApr] = useState('');
  const [stakingBalance, setStakingBalance] = useState('');
  const [openStakingModal, setOpenStakingModal] = useState(false);
  const [stakingAmount, setStakingAmount] = useState('');

  const { library } = useWeb3Provider();
  const { account } = useWeb3React();

  const handleInitInput = () => {
    setFromAmount('');
    setToAmount('');
  };

  const handleChangeEstimatedDLP = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/^[0-9]*[.,]?[0-9]*$/) && dlpContract) {
      setFromAmount(e.target.value);
      const ratio = await dlpContract.getDLPRatio('BNB');
      if (e.target.value) {
        setToAmount(BigNumber(e.target.value).dividedBy(formatUnits(ratio)).toString());
      } else setToAmount('');
    }
  };

  const handleChangeEstimatedToAmount = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/^[0-9]*[.,]?[0-9]*$/) && dlpContract) {
      setFromAmount(e.target.value);
      const ratio = await dlpContract.getDLPRatio('BNB');
      if (e.target.value) {
        setToAmount(BigNumber(e.target.value).multipliedBy(formatUnits(ratio)).toString());
      } else setToAmount('');
    }
  };

  const handleClickBuy = async () => {
    try {
      if (!account) {
        showErrorAlert('Connect Wallet');
        return;
      }
      if (account && library && udlpContract) {
        const parsedAmount = ethers.utils.parseUnits(fromAmount);
        const amountToHexValue = ethers.utils.hexValue(parsedAmount);

        // //트랜잭션에 사용할 data를 위해 인코딩
        const data = dlpInterface.encodeFunctionData('buyDLP');

        const gasLimit = await library.estimateGas({
          from: account,
          to: DLP_CONTRACT_ADDRESS,
          data,
          value: amountToHexValue,
        });
        const gasLimitToHexValue = ethers.utils.hexValue(gasLimit.add(100000));

        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: account,
              to: DLP_CONTRACT_ADDRESS,
              gas: gasLimitToHexValue,
              data,
              value: amountToHexValue,
            },
          ],
        });
        if (String(txHash)) {
          showSuccessAlert('Bought successfully');
          handleInitInput();
        }
      }
    } catch (error) {
      showErrorAlert('Failed');
      console.error(error);
    }
  };

  const handleClickSell = async () => {
    try {
      if (!account) {
        showErrorAlert('Connect Wallet');
        return;
      }
      if (account && library && udlpContract) {
        const parsedAmount = ethers.utils.parseUnits(fromAmount);

        // //트랜잭션에 사용할 data를 위해 인코딩
        const data = dlpInterface.encodeFunctionData('sellDLP', [parsedAmount]);

        const gasLimit = await library.estimateGas({
          from: account,
          to: DLP_CONTRACT_ADDRESS,
          data,
        });
        const gasLimitToHexValue = ethers.utils.hexValue(gasLimit.add(100000));

        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: account,
              to: DLP_CONTRACT_ADDRESS,
              gas: gasLimitToHexValue,
              data,
            },
          ],
        });
        if (String(txHash)) {
          showSuccessAlert('Sold successfully');
          handleInitInput();
        }
      }
    } catch (error) {
      showErrorAlert('Failed');
      console.error(error);
    }
  };

  const handleChangeStakingAmount = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/^[0-9]*[.,]?[0-9]*$/)) setStakingAmount(e.currentTarget.value);
  };

  const handleClickMaxDLP = async () => {
    if (udlpContract) {
      const balance = await udlpContract.balanceOf(account);
      setStakingAmount(formatUnits(balance));
    }
  };

  const handleClickConfirmStaking = async () => {
    try {
      if (!account) {
        showErrorAlert('Connect Wallet');
        return;
      }

      if (account && library && udlpContract) {
        if (stakeState === 'stake') {
          const parsedAmount = ethers.utils.parseUnits(stakingAmount);

          // //트랜잭션에 사용할 data를 위해 인코딩
          const data = dlpInterface.encodeFunctionData('stake', [parsedAmount]);

          const gasLimit = await library.estimateGas({
            from: account,
            to: DLP_CONTRACT_ADDRESS,
            data,
          });
          const gasLimitToHexValue = ethers.utils.hexValue(gasLimit.add(100000));

          const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: account,
                to: DLP_CONTRACT_ADDRESS,
                gas: gasLimitToHexValue,
                data,
              },
            ],
          });
          if (String(txHash)) {
            showSuccessAlert('Staked successfully');
            setStakingAmount('');
            setOpenStakingModal(false);
          }
        } else {
          const parsedAmount = ethers.utils.parseUnits(stakingAmount);

          // //트랜잭션에 사용할 data를 위해 인코딩
          const data = dlpInterface.encodeFunctionData('unstake', [parsedAmount]);

          const gasLimit = await library.estimateGas({
            from: account,
            to: DLP_CONTRACT_ADDRESS,
            data,
          });
          const gasLimitToHexValue = ethers.utils.hexValue(gasLimit.add(100000));

          const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: account,
                to: DLP_CONTRACT_ADDRESS,
                gas: gasLimitToHexValue,
                data,
              },
            ],
          });
          if (String(txHash)) {
            showSuccessAlert('Unstaked successfully');
            setStakingAmount('');
            setOpenStakingModal(false);
          }
        }
      }
    } catch (error) {
      showErrorAlert('Failed');
      console.error(error);
    }
  };

  useEffect(() => {
    const renderFromTokenBalance = async () => {
      if (library && account && udlpContract) {
        if (fromToken === 'BNB') {
          const balance = await library.getBalance(account);
          setFromBalance(formatUnits(balance));
        } else if (fromToken === 'DLP') {
          const balance = await udlpContract.myBalance();
          // const balance = await dlpContract.balanceOf(account);
          setFromBalance(formatUnits(balance));
        } else setFromBalance('0');
      }
    };

    const renderStakingInfo = async () => {
      if (library && dlpContract) {
        const APR_CONSTANT = (365.2422 * 24 * 60 * 60) / 3; // 1year / BNB block 생성주기
        const totalSupply = await dlpContract.totalSupply();

        const result = BigNumber(formatUnits(totalSupply)).gt(0)
          ? BigNumber(APR_CONSTANT)
              .times(BigNumber(100)) //🚧 supplyPerBlock 임시값
              .div(BigNumber(formatUnits(totalSupply)))
              .times(BigNumber(100))
              .toFixed(2)
          : '0.00';
        setApr(result);

        if (udlpContract) {
          const staked = await udlpContract.getStakingBalance(account);
          setStakingBalance(BigNumber(formatUnits(staked)).toFormat(5));
        }
      }
    };

    renderFromTokenBalance();
    renderStakingInfo();
  }, [fromToken, library, account, dlpContract, udlpContract]);

  return (
    <div className="px-5">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg h-full flex-grow">
          <table className="w-full text-sm text-left h-full ">
            <caption className="bg-gray-800 px-6 py-3">
              <h1 className="text-white text-2xl font-extrabold text-left">DLP Pool</h1>
            </caption>
            <thead className="text-xs text-gray-700 uppercase bg-gray-700 text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Token
                </th>
                <th scope="col" className="py-3 px-6">
                  Size
                </th>
                <th scope="col" className="py-3 px-6">
                  Importance
                </th>
                <th scope="col" className="py-3 px-6">
                  Utilization
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex ">
                  <img src={BNB} width={20} className="mr-1" />
                  BNB
                </th>
                <td className="py-4 px-6 text-white">220.123 BNB</td>
                <td className="py-4 px-6 text-white">20%/20%</td>
                <td className="py-4 px-6 text-white">68%</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex ">
                  <img src={BUSD} width={20} className="mr-1" />
                  BUSD
                </th>
                <td className="py-4 px-6 text-white">131.33 BUSD</td>
                <td className="py-4 px-6 text-white">35%/35%</td>
                <td className="py-4 px-6 text-white">32%</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex ">
                  <img src={USDT} width={20} className="mr-1" />
                  USDT
                </th>
                <td className="py-4 px-6 text-white">69.5 USDT</td>
                <td className="py-4 px-6 text-white">13%/13%</td>
                <td className="py-4 px-6 text-white">20%</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex ">
                  <img src={USDC} width={20} className="mr-1" />
                  USDC
                </th>
                <td className="py-4 px-6 text-white">47.8 USDC</td>
                <td className="py-4 px-6 text-white">12%/12%</td>
                <td className="py-4 px-6 text-white">20%</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex ">
                  <img src={CAKE} width={20} className="mr-1" />
                  ddcCAKE
                </th>
                <td className="py-4 px-6 text-white">100.2 ddcCAKE</td>
                <td className="py-4 px-6 text-white">15%/15%</td>
                <td className="py-4 px-6 text-white">-</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex ">
                  <img src={WOM} width={20} className="mr-1" />
                  ddcWOM
                </th>
                <td className="py-4 px-6 text-white">500.55 ddcWOM</td>
                <td className="py-4 px-6 text-white">5%/5%</td>
                <td className="py-4 px-6 text-white">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="md:max-w-[40%] w-full sm:rounded-lg bg-gray-800 ">
          <div className="px-6 py-3 flex flex-col	justify-center">
            <h1 className="text-white text-xl font-bold mb-4">Trade DLP</h1>
            <div className="flex mb-2">
              <button
                onClick={() => {
                  setTradeState('buy');
                  setFromToken('BNB');
                  setToToken('DLP');
                  handleInitInput();
                }}
                className={
                  'text-white font-bold flex-1 rounded-tr-none rounded-br-none rounded-sm p-2  ' +
                  (tradeState === 'buy' ? 'bg-yellow-500' : 'bg-gray-700')
                }
              >
                Buy
              </button>
              <button
                onClick={() => {
                  setTradeState('sell');
                  setFromToken('DLP');
                  setToToken('BNB');
                  handleInitInput();
                }}
                className={
                  'text-white font-bold flex-1  rounded-tl-none rounded-bl-none rounded-sm p-2   ' +
                  (tradeState === 'sell' ? 'bg-yellow-500' : 'bg-gray-700')
                }
              >
                Sell
              </button>
            </div>
            {tradeState === 'buy' ? (
              <div>
                <div>
                  <label htmlFor="from" className="mb-2 text-sm font-medium text-white flex justify-between">
                    <span>From {fromToken} </span>
                    <span>Balance : {fromBalance ? BigNumber(fromBalance).toFormat(5) : '0'}</span>
                  </label>
                  <div className="flex">
                    <div className="mr-2 relative">
                      <button
                        id="dropdownDefault"
                        data-dropdown-toggle="dropdown"
                        className="text-white bg-blue-700 font-medium text-sm px-4 py-2.5 text-center inline-flex items-center"
                        type="button"
                        onClick={() => {
                          setOpenTokenDropdown(true);
                        }}
                      >
                        {fromToken}
                        <svg
                          className="ml-2 w-4 h-4"
                          aria-hidden="true"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                      {openTokenDropdown && (
                        <div
                          id="dropdown"
                          className="z-10 divide-y divide-gray-100 shadow bg-gray-700"
                          style={{
                            position: 'absolute',
                            top: 40,
                            left: 0,
                            width: '100%',
                          }}
                        >
                          <ul className="text-sm text-gray-200 bg-blue-800 " aria-labelledby="dropdownDefault">
                            <li className="p-2">
                              <button
                                className="w-full text-left"
                                onClick={() => {
                                  setFromToken('BNB');
                                  setOpenTokenDropdown(false);
                                }}
                              >
                                BNB
                              </button>
                            </li>
                            <li className="p-2">
                              <button
                                className="w-full text-left"
                                onClick={() => {
                                  // setFromToken('BUSD');
                                  setOpenTokenDropdown(false);
                                }}
                              >
                                BUSD
                              </button>
                            </li>
                            <li className="p-2">
                              <button
                                className="w-full text-left"
                                onClick={() => {
                                  // setFromToken('USDT');
                                  setOpenTokenDropdown(false);
                                }}
                              >
                                USDT
                              </button>
                            </li>
                            <li className="p-2">
                              <button
                                className="w-full text-left"
                                onClick={() => {
                                  // setFromToken('USDC');
                                  setOpenTokenDropdown(false);
                                }}
                              >
                                USDC
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      id="from"
                      className="border border-gray-300 text-sm rounded-lg block w-full p-2.5 bg-gray-700 text-white "
                      value={fromAmount}
                      onChange={handleChangeEstimatedDLP}
                    />
                  </div>
                </div>
                <div className="my-2">
                  <label htmlFor="to" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    To DLP
                  </label>
                  <div
                    id="to"
                    className="h-10 border border-gray-300 text-sm rounded-lg block w-full p-2.5 bg-gray-700 text-white "
                  >
                    {toAmount}
                  </div>
                </div>

                <button
                  type="button"
                  className="text-black bg-yellow-400 rounded-lg font-bold text-lg px-4 py-2.5 text-center mt-4 w-full"
                  onClick={handleClickBuy}
                >
                  Buy DLP
                </button>
              </div>
            ) : (
              <div>
                <div>
                  <label htmlFor="from" className="mb-2 text-sm font-medium text-white flex justify-between">
                    <span>From DLP </span>
                    <span>Balance : {fromBalance ? BigNumber(fromBalance).toFormat(5) : '0'}</span>
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="from"
                      className="border border-gray-300 text-sm rounded-lg block w-full p-2.5 bg-gray-700 text-white "
                      value={fromAmount}
                      onChange={handleChangeEstimatedToAmount}
                    />
                  </div>
                </div>
                <div className="my-2">
                  <label htmlFor="to" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    To {toToken}
                  </label>
                  <div className="flex">
                    <div className="mr-2 relative">
                      <button
                        id="dropdownDefault"
                        data-dropdown-toggle="dropdown"
                        className="text-white bg-blue-700 font-medium text-sm px-4 py-2.5 text-center inline-flex items-center"
                        type="button"
                        onClick={() => {
                          setOpenTokenDropdown(true);
                        }}
                      >
                        {toToken}
                        <svg
                          className="ml-2 w-4 h-4"
                          aria-hidden="true"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                      {openTokenDropdown && (
                        <div
                          id="dropdown"
                          className="z-10 divide-y divide-gray-100 shadow bg-gray-700"
                          style={{
                            position: 'absolute',
                            top: 40,
                            left: 0,
                            width: '100%',
                          }}
                        >
                          <ul className="text-sm text-gray-200 bg-blue-800 " aria-labelledby="dropdownDefault">
                            <li className="p-2">
                              <button
                                className="w-full text-left"
                                onClick={() => {
                                  setToToken('BNB');
                                  setOpenTokenDropdown(false);
                                }}
                              >
                                BNB
                              </button>
                            </li>
                            <li className="p-2">
                              <button
                                className="w-full text-left"
                                onClick={() => {
                                  // setToToken('BUSD');
                                  setOpenTokenDropdown(false);
                                }}
                              >
                                BUSD
                              </button>
                            </li>
                            <li className="p-2">
                              <button
                                className="w-full text-left"
                                onClick={() => {
                                  // setToToken('USDT');
                                  setOpenTokenDropdown(false);
                                }}
                              >
                                USDT
                              </button>
                            </li>
                            <li className="p-2">
                              <button
                                className="w-full text-left"
                                onClick={() => {
                                  // setToToken('USDC');
                                  setOpenTokenDropdown(false);
                                }}
                              >
                                USDC
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    <div
                      id="to"
                      className="h-10 border border-gray-300 text-sm rounded-lg block w-full p-2.5 bg-gray-700 text-white "
                    >
                      {toAmount}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="text-black bg-yellow-400 rounded-lg font-bold text-lg px-4 py-2.5 text-center mt-4 w-full"
                  onClick={handleClickSell}
                >
                  Sell DLP
                </button>
              </div>
            )}
          </div>
          <div className="px-6 py-3 flex flex-col	justify-center">
            <h1 className="text-white text-xl font-bold mb-4">Stake DLP</h1>
            <div className="flex">
              <div className="text-white flex-1 text-center">
                <h2>Price</h2>
                <h3>$0.082</h3>
              </div>
              <div className="text-white flex-1 text-center">
                <h2>APR</h2>
                <h3>{apr}</h3>
              </div>
              <div className="text-white flex-1 text-center">
                <h2>Staked</h2>
                <h3>{stakingBalance}</h3>
              </div>
            </div>

            <button
              type="button"
              className="text-black bg-yellow-400 rounded-lg font-bold text-lg px-4 py-2.5 text-center mt-4 w-full"
              onClick={() => setOpenStakingModal(true)}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>

      {openStakingModal && (
        <div
          id="popup-modal"
          tabIndex={-1}
          aria-modal="true"
          className="bg-black/50 fixed top-0 left-0 right-0 z-50  p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal h-full flex justify-center items-center"
        >
          <div className="relative w-full h-full max-w-xl h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-toggle="popup-modal"
                onClick={() => setOpenStakingModal(false)}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <div className="px-6 py-12 flex flex-col	justify-center">
                <div className="flex mb-2">
                  <button
                    onClick={() => {
                      setStakeState('stake');
                    }}
                    className={
                      'text-white font-bold flex-1 rounded-tr-none rounded-br-none rounded-sm p-2  ' +
                      (stakeState === 'stake' ? 'bg-yellow-500' : 'bg-gray-600')
                    }
                  >
                    Stake
                  </button>
                  <button
                    onClick={() => {
                      setStakeState('unstake');
                    }}
                    className={
                      'text-white font-bold flex-1  rounded-tl-none rounded-bl-none rounded-sm p-2   ' +
                      (stakeState === 'unstake' ? 'bg-yellow-500' : 'bg-gray-600')
                    }
                  >
                    Unstake
                  </button>
                </div>
                <div className="flex">
                  <input
                    type="text"
                    id="from"
                    className="border border-gray-300 text-sm rounded-lg block w-full p-2.5 bg-gray-700 text-white "
                    required
                    value={stakingAmount}
                    onChange={handleChangeStakingAmount}
                  />
                  <button className="bg-white text-black p-2 ml-2 rounded-lg" onClick={handleClickMaxDLP}>
                    Max
                  </button>
                </div>
                <button
                  type="button"
                  className="text-white bg-yellow-400 rounded-lg font-bold text-lg px-4 py-2.5 text-center mt-4"
                  onClick={handleClickConfirmStaking}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pool;
