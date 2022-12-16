import BNB from '../assets/Ellipse10.png';
import CAKE from '../assets/Ellipse11.png';
import WOM from '../assets/Ellipse12.png';
import MGP from '../assets/Ellipse13.png';
import WMX from '../assets/Ellipse14.png';
import QUO from '../assets/Ellipse15.png';
import Loading from '../components/Loading';
import { TREASURY_CONTRACT_ADDRESS } from '../constants/settings';
import useWeb3Provider from '../hooks/useWeb3Provider';
import { useWeb3React } from '@web3-react/core';
import { formatUnits } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [bnbTotalAmount, setBnbTotalAmount] = useState('');
  const { library } = useWeb3Provider();
  const { account } = useWeb3React();

  useEffect(() => {
    const renderTotalPrizes = async () => {
      if (library) {
        const balance = await library.getBalance(TREASURY_CONTRACT_ADDRESS);
        setBnbTotalAmount(formatUnits(balance));
      }
    };

    renderTotalPrizes();
  }, [library]);
  return (
    <div className="px-5">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg grow max-w-4xl">
          <table className="w-full text-sm text-left">
            <caption className="bg-gray-800 px-6 py-3">
              <h1 className="text-white text-2xl font-extrabold text-left">Treasury</h1>
              <h1 className="text-white text-lg font-bold text-left">BNB DeFi Protocols</h1>
            </caption>
            <thead className="text-xs text-gray-700 uppercase bg-gray-700 text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Protocol
                </th>
                <th scope="col" className="py-3 px-6">
                  Amount
                </th>
                <th scope="col" className="py-3 px-6">
                  Reward
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex">
                  <img src={BNB} width={20} className="mr-1" />
                  BNB Chain Node Delegation
                </th>
                <td className="py-4 px-6 text-white">{bnbTotalAmount ? bnbTotalAmount : ''} BNB</td>
                <td className="py-4 px-6 text-white">
                  <Loading /> &nbsp;BNB
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex">
                  <img src={CAKE} width={20} className="mr-1" />
                  PancakeSwap
                </th>
                <td className="py-4 px-6 text-white">0 CAKE</td>
                <td className="py-4 px-6 text-white">0 CAKE</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex">
                  <img src={WOM} width={20} className="mr-1" />
                  Wombat Exchange
                </th>
                <td className="py-4 px-6 text-white">0 WOM</td>
                <td className="py-4 px-6 text-white">0 WOM</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex">
                  <img src={MGP} width={20} className="mr-1" />
                  Magpie
                </th>
                <td className="py-4 px-6 text-white">0 MGP</td>
                <td className="py-4 px-6 text-white">0 MGP</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex">
                  <img src={WMX} width={20} className="mr-1" />
                  Wombex Finance
                </th>
                <td className="py-4 px-6 text-white">0 WMX</td>
                <td className="py-4 px-6 text-white">0 WMX</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex">
                  <img src={QUO} width={20} className="mr-1" />
                  Quoll Finance
                </th>
                <td className="py-4 px-6 text-white">0 QUO</td>
                <td className="py-4 px-6 text-white">0 QUO</td>
              </tr>
            </tbody>
          </table>
        </div>
        {Boolean(account) && (
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left">
              <caption className="bg-gray-800 px-6 py-3">
                <h1 className="text-white text-2xl font-extrabold text-left">My Reward</h1>
                <button
                  type="button"
                  className="float-left px-2 focus:outline-none text-white bg-yellow-500 hover:bg-yellow-600 font-bold rounded-sm text-lg "
                >
                  Claim All
                </button>
              </caption>
              <thead className="text-xs text-gray-700 uppercase bg-gray-700 text-gray-400">
                <tr>
                  <th scope="col" className="py-3 px-6">
                    Protocol
                  </th>
                  <th scope="col" className="py-3 px-6 text-amber-400">
                    Claimable
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex">
                    <img src={BNB} width={20} className="mr-1" />
                    BNB Chain Node Delegation
                  </th>
                  <td className="py-4 px-6 text-white">
                    <Loading />
                    &nbsp;BNB
                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex">
                    <img src={CAKE} width={20} className="mr-1" />
                    PancakeSwap
                  </th>
                  <td className="py-4 px-6 text-white">0 CAKE</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex">
                    <img src={WOM} width={20} className="mr-1" />
                    Wombat Exchange
                  </th>
                  <td className="py-4 px-6 text-white">0 WOM</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex">
                    <img src={MGP} width={20} className="mr-1" />
                    Magpie
                  </th>
                  <td className="py-4 px-6 text-white">0 MGP</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex">
                    <img src={WMX} width={20} className="mr-1" />
                    Wombex Finance
                  </th>
                  <td className="py-4 px-6 text-white">0 WMX</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="py-4 px-6 font-medium  whitespace-nowrap text-white flex">
                    <img src={QUO} width={20} className="mr-1" />
                    Quoll Finance
                  </th>
                  <td className="py-4 px-6 text-white">0 QUO</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
