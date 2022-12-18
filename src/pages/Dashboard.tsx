import ABI_CAKE from '../abi/Cake.json';
import BNB from '../assets/Ellipse10.png';
import CAKE from '../assets/Ellipse11.png';
import WOM from '../assets/Ellipse12.png';
import MGP from '../assets/Ellipse13.png';
import WMX from '../assets/Ellipse14.png';
import QUO from '../assets/Ellipse15.png';
import Loading from '../components/Loading';
import { CAKE_CONTRACT_ADDRESS, TREASURY_CONTRACT_ADDRESS } from '../constants/settings';
import { useContract } from '../hooks/useContract';
import useWeb3Provider from '../hooks/useWeb3Provider';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { formatUnits } from 'ethers/lib/utils';
import { ChangeEvent, MutableRefObject, useEffect, useRef, useState } from 'react';

const Dashboard = () => {
  const [bnbTotalAmount, setBnbTotalAmount] = useState('0');
  const [myCakeAmount, setMyCakeAmount] = useState('0');
  const [openAddTokenModal, setOpenAddTokenModal] = useState(false);
  const [openTokenDropdown, setOpenTokenDropdown] = useState(false);
  const [fromToken, setFromToken] = useState('WOM');
  const [fromAmount, setFromAmount] = useState('');
  const [toToken, setToToken] = useState('ddcWOM');

  const { library } = useWeb3Provider();
  const { account } = useWeb3React();
  const cakeContract = useContract(CAKE_CONTRACT_ADDRESS, ABI_CAKE);

  const handleChangeFromAmount = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/^[0-9]*[.,]?[0-9]*$/)) setFromAmount(e.currentTarget.value);
  };

  const handleClickMax = () => {
    if (fromToken === 'CAKE') {
      setFromAmount(myCakeAmount);
    } else setFromAmount('0');
  };

  const handleClickAdd = (token: string) => {
    if (token === 'CAKE') {
      setFromToken('CAKE');
    } else {
      setFromToken('WOM');
    }
    setFromAmount('');
    setOpenAddTokenModal(true);
  };

  useEffect(() => {
    const renderTotalPrizes = async () => {
      if (library) {
        const balance = await library.getBalance(TREASURY_CONTRACT_ADDRESS);
        setBnbTotalAmount(formatUnits(balance));
      }
    };

    const renderMyCakeAmount = async () => {
      if (cakeContract && account) {
        const cakeBalance = await cakeContract.balanceOf(account);
        setMyCakeAmount(BigNumber(formatUnits(cakeBalance)).toFormat(5));
      }
    };

    renderTotalPrizes();
    renderMyCakeAmount();
  }, [library, cakeContract, account]);

  useEffect(() => {
    switch (fromToken) {
      case 'WOM':
        setToToken('ddcWOM');
        break;
      case 'CAKE':
        setToToken('ddcCAKE');
        break;

      default:
        break;
    }
  }, [fromToken]);
  return (
    <div className="px-5">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg w-full mb-8">
          <table className="w-full text-sm text-left">
            <caption className="bg-gray-800 px-6 py-3">
              <h1 className="text-white text-2xl font-extrabold text-left">Treasury</h1>
            </caption>
            <thead className="text-xs text-gray-700 uppercase bg-gray-700 text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6 w-80">
                  Protocol
                </th>
                <th scope="col" className="py-3 px-6">
                  Total Amount
                </th>
                <th scope="col" className="py-3 px-6">
                  Season Prize
                </th>
                <th scope="col" className="py-3 px-6">
                  My rewards
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex w-80">
                  <img src={BNB} width={20} className="mr-1" />
                  BNB Chain Node Delegation
                </th>
                <td className="py-4 px-6 text-white">{bnbTotalAmount ? bnbTotalAmount : ''} BNB</td>
                <td className="py-4 px-6 text-white">{bnbTotalAmount ? bnbTotalAmount : ''} BNB</td>

                <td className="py-4 px-6 text-white">
                  {account ? (
                    <>
                      <Loading /> &nbsp;BNB
                      <button
                        type="button"
                        className="focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 font-bold rounded-lg text-sm px-2 py-1 ml-4"
                      >
                        Claim
                      </button>
                    </>
                  ) : (
                    '0'
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg w-full ">
          <table className="w-full text-sm text-left">
            <caption className="bg-gray-800 px-6 py-3">
              <h1 className="text-white text-2xl font-extrabold text-left">DDC Governance</h1>
            </caption>
            <thead className="text-xs text-gray-700 uppercase bg-gray-700 text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6 w-80">
                  Protocol
                </th>
                <th scope="col" className="py-3 px-6">
                  Total Amount
                </th>
                <th scope="col" className="py-3 px-6">
                  My asset
                </th>
                <th scope="col" className="py-3 px-6">
                  My DDC asset
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex items-center w-80">
                  <img src={CAKE} width={20} height={20} className="mr-1" />
                  PancakeSwap
                  <button
                    onClick={() => handleClickAdd('CAKE')}
                    type="button"
                    className="focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 font-bold rounded-lg text-sm px-2 py-1 ml-4"
                  >
                    Add
                  </button>
                </th>
                <td className="py-4 px-6 text-white">0 CAKE</td>
                <td className="py-4 px-6 text-white">{myCakeAmount} CAKE</td>
                <td className="py-4 px-6 text-white">0 ddcCAKE</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex items-center w-80">
                  <img src={WOM} width={20} height={20} className="mr-1" />
                  Wombat Exchange
                  <button
                    onClick={() => handleClickAdd('WOM')}
                    type="button"
                    className="focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 font-bold rounded-lg text-sm px-2 py-1 ml-4"
                  >
                    Add
                  </button>
                </th>
                <td className="py-4 px-6 text-white">0 WOM</td>
                <td className="py-4 px-6 text-white">0 WOM</td>
                <td className="py-4 px-6 text-white">0 ddcWOM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {openAddTokenModal && (
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
                onClick={() => setOpenAddTokenModal(false)}
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
                <h1 className="text-white text-xl font-bold mb-4">Add Tokens</h1>
                <div>
                  <label htmlFor="from" className="mb-2 text-sm font-medium text-white flex justify-between">
                    <span>From {fromToken} </span>
                    <span>Balance : {fromToken === 'CAKE' ? myCakeAmount : '0'}</span>
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
                                  setFromToken('CAKE');
                                  setOpenTokenDropdown(false);
                                }}
                              >
                                CAKE
                              </button>
                            </li>
                            <li className="p-2">
                              <button
                                className="w-full text-left"
                                onClick={() => {
                                  setFromToken('WOM');
                                  setOpenTokenDropdown(false);
                                }}
                              >
                                WOM
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
                    <button className="bg-white text-black p-2 ml-2 rounded-lg" onClick={handleClickMax}>
                      Max
                    </button>
                  </div>
                </div>
                <div className="my-2">
                  <label htmlFor="to" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    To {toToken}
                  </label>
                  <div
                    id="to"
                    className="h-10 border border-gray-300 text-sm rounded-lg block w-full p-2.5 bg-gray-700 text-white "
                  >
                    {fromAmount}
                  </div>
                </div>

                <button
                  data-modal-toggle="popup-modal"
                  type="button"
                  className="text-white bg-yellow-400 rounded-lg font-bold text-lg px-4 py-2.5 text-center mt-4"
                >
                  Lock Tokens
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
