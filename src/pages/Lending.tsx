import ABI_DLP from '../abi/DLP.json';
import BNB from '../assets/Ellipse10.png';
import CAKE from '../assets/Ellipse11.png';
import BUSD from '../assets/Ellipse26.png';
import USDT from '../assets/Ellipse27.png';
import USDC from '../assets/Ellipse28.png';
import { DLP_CONTRACT_ADDRESS } from '../constants/settings';
import { useContract } from '../hooks/useContract';
import useWeb3Provider from '../hooks/useWeb3Provider';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { formatUnits } from 'ethers/lib/utils';
import { ChangeEvent, MutableRefObject, useEffect, useRef, useState } from 'react';

const Lending = () => {
  const [openBorrowModal, setOpenBorrowModal] = useState(false);
  const [openTokenDropdown, setOpenTokenDropdown] = useState(false);

  const [fromAmount, setFromAmount] = useState('');
  const [toToken, setToToken] = useState('BNB');
  const [toAmount, setToAmount] = useState('');
  const [dlpBalance, setDlpBalance] = useState('');

  const { library } = useWeb3Provider();
  const { account } = useWeb3React();
  const udlpContract = useContract(DLP_CONTRACT_ADDRESS, ABI_DLP); //provider = user

  const handleChangeFromAmount = (e: ChangeEvent<HTMLInputElement>) => {
    //🚧 최대 대출가능한 수량 제어
    if (e.target.value.match(/^[0-9]*[.,]?[0-9]*$/)) setFromAmount(e.currentTarget.value);
  };

  const handleClickConfirm = () => {
    console.log('c');
  };

  const handleClickBorrow = () => {
    setOpenBorrowModal(true);
  };

  useEffect(() => {
    if (openBorrowModal && udlpContract && account) {
      const renderDlpBalance = async () => {
        const balance = await udlpContract.balanceOf(account);
        setDlpBalance(formatUnits(balance));
      };

      renderDlpBalance();
    }
  }, [openBorrowModal, udlpContract, account]);

  return (
    <div className="px-5">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg w-full mb-8">
          <table className="w-full text-sm text-left">
            <caption className="bg-gray-800 px-6 py-3">
              <h1 className="text-white text-2xl font-extrabold text-left">Borrow</h1>
            </caption>
            <thead className="text-xs text-gray-700 uppercase bg-gray-700 text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6 ">
                  Token
                </th>
                <th scope="col" className="py-3 px-6">
                  Borrow APR
                </th>
                <th scope="col" className="py-3 px-6">
                  Earn APR
                </th>
                <th scope="col" className="py-3 px-6">
                  Liquidity
                </th>
                <th scope="col" className="py-3 px-6">
                  Utilization
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex ">
                  <img src={BNB} width={20} className="mr-1" />
                  BNB
                </th>
                <td className="py-4 px-6 text-white">-3.13%</td>
                <td className="py-4 px-6 text-white">6.14%</td>
                <td className="py-4 px-6 text-white">1892.213 BNB</td>
                <td className="py-4 px-6 text-white">78%</td>
                <td className="py-4 px-6 text-white">
                  <div className="flex">
                    <button
                      className="text-white font-medium flex-1 rounded-sm p-2 bg-yellow-500 mx-2"
                      onClick={handleClickBorrow}
                    >
                      Borrow
                    </button>
                    <button className="text-white font-medium flex-1 rounded-sm p-2 bg-yellow-500 mx-2">Repay</button>
                  </div>
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex ">
                  <img src={BUSD} width={20} className="mr-1" />
                  BUSD
                </th>
                <td className="py-4 px-6 text-white">-4.23%</td>
                <td className="py-4 px-6 text-white">3.14%</td>
                <td className="py-4 px-6 text-white">123.43 BUSD</td>
                <td className="py-4 px-6 text-white">54.12%</td>
                <td className="py-4 px-6 text-white">
                  <div className="flex">
                    <button className="text-white font-medium flex-1 rounded-sm p-2 bg-yellow-500 mx-2">Borrow</button>
                    <button className="text-white font-medium flex-1 rounded-sm p-2 bg-yellow-500 mx-2">Repay</button>
                  </div>
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex ">
                  <img src={USDT} width={20} className="mr-1" />
                  USDT
                </th>
                <td className="py-4 px-6 text-white">-4.11%</td>
                <td className="py-4 px-6 text-white">4.14%</td>
                <td className="py-4 px-6 text-white">442.98 USDT</td>
                <td className="py-4 px-6 text-white">79%</td>
                <td className="py-4 px-6 text-white">
                  <div className="flex">
                    <button className="text-white font-medium flex-1 rounded-sm p-2 bg-yellow-500 mx-2">Borrow</button>
                    <button className="text-white font-medium flex-1 rounded-sm p-2 bg-yellow-500 mx-2">Repay</button>
                  </div>
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex ">
                  <img src={USDC} width={20} className="mr-1" />
                  USDC
                </th>
                <td className="py-4 px-6 text-white">-3.13%</td>
                <td className="py-4 px-6 text-white">6.14%</td>
                <td className="py-4 px-6 text-white">768.32 USDC</td>
                <td className="py-4 px-6 text-white">40%</td>
                <td className="py-4 px-6 text-white">
                  <div className="flex">
                    <button className="text-white font-medium flex-1 rounded-sm p-2 bg-yellow-500 mx-2">Borrow</button>
                    <button className="text-white font-medium flex-1 rounded-sm p-2 bg-yellow-500 mx-2">Repay</button>
                  </div>
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex ">
                  <img src={CAKE} width={20} className="mr-1" />
                  CAKE
                </th>
                <td className="py-4 px-6 text-white">-6.89%</td>
                <td className="py-4 px-6 text-white">9.14%</td>
                <td className="py-4 px-6 text-white">768.102 CAKE</td>
                <td className="py-4 px-6 text-white">70%</td>
                <td className="py-4 px-6 text-white">
                  <div className="flex">
                    <button className="text-white font-medium flex-1 rounded-sm p-2 bg-yellow-500 mx-2">Borrow</button>
                    <button className="text-white font-medium flex-1 rounded-sm p-2 bg-yellow-500 mx-2">Repay</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {openBorrowModal && (
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
                onClick={() => setOpenBorrowModal(false)}
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
                <h1 className="text-white text-xl font-bold mb-4">Borrow</h1>
                <h1 className="text-white text-sm font-bold mb-4">DLP Balance: {dlpBalance}</h1>
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
                                setToToken('BUSD');
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
                                setToToken('USDT');
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
                                setToToken('USDC');
                                setOpenTokenDropdown(false);
                              }}
                            >
                              USDC
                            </button>
                          </li>
                          <li className="p-2">
                            <button
                              className="w-full text-left"
                              onClick={() => {
                                setToToken('CAKE');
                                setOpenTokenDropdown(false);
                              }}
                            >
                              CAKE
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
                    required
                    value={fromAmount}
                    onChange={handleChangeFromAmount}
                  />
                  {/* <button className="bg-white text-black p-2 ml-2 rounded-lg" onClick={handleClickMax}>
                    Max
                  </button> */}
                </div>
                <button
                  type="button"
                  className="text-white bg-yellow-400 rounded-lg font-bold text-lg px-4 py-2.5 text-center mt-4"
                  onClick={handleClickConfirm}
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

export default Lending;
