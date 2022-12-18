import { ENABLE_ARCHIVED_GAMES } from '../../constants/settings';
import { TEAM } from '../../constants/strings';
import ConnectWallet from '../connectWallet';
import { CalendarIcon, ChartBarIcon, CogIcon, InformationCircleIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Props {
  setIsInfoModalOpen: (value: boolean) => void;
  setIsStatsModalOpen: (value: boolean) => void;
  setIsDatePickerModalOpen: (value: boolean) => void;
  setIsSettingsModalOpen: (value: boolean) => void;
  handelToggleMode: () => void;
  bnbMode: number;
}

export const Navbar = ({
  setIsInfoModalOpen,
  setIsStatsModalOpen,
  setIsDatePickerModalOpen,
  setIsSettingsModalOpen,
  handelToggleMode,
  bnbMode,
}: Props) => {
  const location = useLocation();

  return (
    <div className="navbar">
      <div className="navbar-content px-5 short:h-auto">
        <div className="flex items-center">
          <Link to="/">
            <p className="text-xl font-bold text-yellow-400">{TEAM}</p>
          </Link>

          <ul className="hidden items-center ml-4 sm:flex">
            <li className="mx-2">
              <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'text-yellow-500' : 'text-white'}>
                Dashboard
              </Link>
            </li>
            <li className="mx-2">
              <Link to="/nft" className={location.pathname === '/nft' ? 'text-yellow-500' : 'text-white'}>
                NFT
              </Link>
            </li>
            <li className="mx-2">
              <Link to="/roadmap" className={location.pathname === '/roadmap' ? 'text-yellow-500' : 'text-white'}>
                Roadmap
              </Link>
            </li>
            <li className="mx-2">
              <Link to="/pool" className={location.pathname === '/pool' ? 'text-yellow-500' : 'text-white'}>
                Pool
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center	">
          {/* <span className="text-white text-xs">{bnbMode ? 'Blockchain' : 'Non-Blockchain'}</span> */}
          <div className="flex mr-2">
            <label className="inline-flex relative items-center cursor-pointer mr-2">
              <input type="checkbox" value={bnbMode} className="sr-only peer" onClick={handelToggleMode} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
            </label>

            <InformationCircleIcon
              className="h-6 w-6 cursor-pointer dark:stroke-white"
              onClick={() => setIsInfoModalOpen(true)}
            />
            {/* {ENABLE_ARCHIVED_GAMES && (
              <CalendarIcon
                className="ml-3 h-6 w-6 cursor-pointer dark:stroke-white"
                onClick={() => setIsDatePickerModalOpen(true)}
              />
            )} */}
          </div>
          <ChartBarIcon
            className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white"
            onClick={() => setIsStatsModalOpen(true)}
          />
          {/* <CogIcon className="h-6 w-6 cursor-pointer dark:stroke-white" onClick={() => setIsSettingsModalOpen(true)} /> */}

          {Boolean(bnbMode) && <ConnectWallet />}
        </div>
      </div>
      <hr></hr>
    </div>
  );
};
