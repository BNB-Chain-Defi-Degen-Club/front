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
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [bnbTotalAmount, setBnbTotalAmount] = useState('0');
  const [myCakeAmount, setMyCakeAmount] = useState('0');
  const { library } = useWeb3Provider();
  const { account } = useWeb3React();
  const cakeContract = useContract(CAKE_CONTRACT_ADDRESS, ABI_CAKE);

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
                        className="focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-2 py-2 ml-4"
                      >
                        Claim
                      </button>
                    </>
                  ) : (
                    'Connect Wallet'
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
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex w-80">
                  <img src={CAKE} width={20} className="mr-1" />
                  PancakeSwap
                </th>
                <td className="py-4 px-6 text-white">0 CAKE</td>
                <td className="py-4 px-6 text-white">{myCakeAmount} CAKE</td>
                <td className="py-4 px-6 text-white">0 CAKE</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex w-80">
                  <img src={WOM} width={20} className="mr-1" />
                  Wombat Exchange
                </th>
                <td className="py-4 px-6 text-white">0 WOM</td>
                <td className="py-4 px-6 text-white">0 WOM</td>
                <td className="py-4 px-6 text-white">0 WOM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
