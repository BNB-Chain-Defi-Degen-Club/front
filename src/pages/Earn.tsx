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

const Earn = () => {
  return (
    <div className="px-5">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg flex-1">
          <table className="w-full text-sm text-left">
            <caption className="bg-gray-800 px-6 py-3">
              <h1 className="text-white text-2xl font-extrabold text-left">DDC</h1>
            </caption>
            <tbody>
              <tr className="bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="p-2 ">
                  APR
                </th>
                <td>18,78%</td>
              </tr>
              <tr className="p-2 bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="p-2 ">
                  My Accounts
                </th>
                <td>789.2 DDC</td>
              </tr>
              <tr className="p-2 bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="p-2 ">
                  Staked
                </th>
                <td>0.0 DDC</td>
              </tr>
              <tr className="p-2 bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="p-2 ">
                  Rewards
                </th>
                <td>$0.00</td>
              </tr>
            </tbody>
          </table>
          <table className="w-full text-sm text-left mt-4">
            <caption className="bg-gray-800 px-6 py-3">
              <h1 className="text-white text-2xl font-extrabold text-left">DLP</h1>
            </caption>
            <tbody>
              <tr className="bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="p-2 ">
                  APR
                </th>
                <td>18,78%</td>
              </tr>
              <tr className="p-2 bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="p-2 ">
                  My Accounts
                </th>
                <td>789.2 DDC</td>
              </tr>
              <tr className="p-2 bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="p-2 ">
                  Staked
                </th>
                <td>0.0 DDC</td>
              </tr>
              <tr className="p-2 bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="p-2 ">
                  Rewards
                </th>
                <td>$0.00</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg flex-1">
          <table className="w-full text-sm text-left">
            <caption className="bg-gray-800 px-6 py-3">
              <h1 className="text-white text-2xl font-extrabold text-left">DDC Statistics</h1>
            </caption>
            <tbody>
              <tr className="bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="p-2 ">
                  Price
                </th>
                <td>$3.78</td>
              </tr>
              <tr className="p-2 bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="p-2 ">
                  Total Supply
                </th>
                <td>1000000 DDC</td>
              </tr>
              <tr className="p-2 bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="p-2 ">
                  Circulation Supply
                </th>
                <td>8382 DDC</td>
              </tr>
              <tr className="p-2 bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="p-2 ">
                  Total Staked
                </th>
                <td>6780 DDC</td>
              </tr>
              <tr className="p-2 bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="p-2 ">
                  Market Cap
                </th>
                <td>$324,343.314</td>
              </tr>
            </tbody>
          </table>
          <table className="w-full text-sm text-left mt-4">
            <caption className="bg-gray-800 px-6 py-3">
              <h1 className="text-white text-2xl font-extrabold text-left">Rewards</h1>
            </caption>
            <tbody>
              <tr className="p-2 bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="p-2">BNB</td>
                <td className="p-2">4.23 BNB</td>
                <td className="p-2">DDC</td>
                <td className="p-2">213.2 DDC</td>
                <td className="p-2">
                  <button className="p-2 bg-yellow-400 text-center font-bold">Claim All</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Earn;
