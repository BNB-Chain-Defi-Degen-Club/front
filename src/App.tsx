import './App.css';
import prizeImg from './assets/money-bag.png';
import { Grid } from './components/grid/Grid';
import { Keyboard } from './components/keyboard/Keyboard';
import { DatePickerModal } from './components/modals/DatePickerModal';
import { InfoModal } from './components/modals/InfoModal';
import { MigrateStatsModal } from './components/modals/MigrateStatsModal';
import NeedFeeModal from './components/modals/NeedFeeModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { StatsModal } from './components/modals/StatsModal';
import { Navbar } from './components/navbar/Navbar';
import {
  DATE_LOCALE,
  DISCOURAGE_INAPP_BROWSERS,
  GAME_FEE,
  LONG_ALERT_TIME_MS,
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
  GAME_CONTRACT_ADDRESS,
  WELCOME_INFO_MODAL_MS,
  TREASURY_CONTRACT_ADDRESS,
} from './constants/settings';
import {
  TEAM,
  BNB_PAID_SUCCESSFULLY,
  CORRECT_WORD_MESSAGE,
  DISCOURAGE_INAPP_BROWSER_TEXT,
  GAME_COPIED_MESSAGE,
  HARD_MODE_ALERT_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  SHARE_FAILURE_TEXT,
  WIN_MESSAGES,
  WORD_NOT_FOUND_MESSAGE,
  GAME_TITLE,
} from './constants/strings';
import { useAlert } from './context/AlertContext';
import useInterval from './hooks/useInterval';
import useMetamaskAuth from './hooks/useMetamaskAuth';
import useWeb3Provider from './hooks/useWeb3Provider';
import { isInAppBrowser } from './lib/browser';
import {
  getStoredIsHighContrastMode,
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  setStoredIsHighContrastMode,
} from './lib/localStorage';
import { isMetamaskUnlocked } from './lib/metamaskOnboarding';
import { addStatsForCompletedGame, loadStats } from './lib/stats';
import {
  findFirstUnusedReveal,
  getGameDate,
  getIsLatestGame,
  isWinningWord,
  isWordInWordList,
  setGameDate,
  solution,
  solutionGameDate,
  unicodeLength,
} from './lib/words';
import { ClockIcon } from '@heroicons/react/outline';
import { useWeb3React } from '@web3-react/core';
import { format } from 'date-fns';
import { formatUnits } from 'ethers/lib/utils';
import { default as GraphemeSplitter } from 'grapheme-splitter';
import { useCallback, useEffect, useState } from 'react';
import Div100vh from 'react-div-100vh';
import { Outlet, useLocation } from 'react-router-dom';

function App() {
  const isLatestGame = getIsLatestGame();
  const gameDate = getGameDate();
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } = useAlert();
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameWon, setIsGameWon] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isDatePickerModalOpen, setIsDatePickerModalOpen] = useState(false);
  const [isMigrateStatsModalOpen, setIsMigrateStatsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isNeedFeeModalOpen, setIsNeedFeeModalOpen] = useState(false);
  const [currentRowClass, setCurrentRowClass] = useState('');
  const [isGameLost, setIsGameLost] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') ? localStorage.getItem('theme') === 'dark' : prefersDarkMode ? true : false,
  );
  const [isHighContrastMode, setIsHighContrastMode] = useState(getStoredIsHighContrastMode());
  const [isRevealing, setIsRevealing] = useState(false);
  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage(isLatestGame);
    if (loaded?.solution !== solution) {
      return [];
    }
    const gameWasWon = loaded.guesses.includes(solution);
    if (gameWasWon) {
      setIsGameWon(true);
    }
    if (loaded.guesses.length === MAX_CHALLENGES && !gameWasWon) {
      setIsGameLost(true);
      // showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
      //   persist: true,
      // });
    }
    return loaded.guesses;
  });

  const [stats, setStats] = useState(() => loadStats());

  const [isHardMode, setIsHardMode] = useState(
    localStorage.getItem('gameMode') ? localStorage.getItem('gameMode') === 'hard' : false,
  );

  const location = useLocation();

  const { account } = useWeb3React();
  const { login: connectWallet } = useMetamaskAuth();
  const { library } = useWeb3Provider();
  const [bnbMode, setBnbMode] = useState(0); //0:false, 1:true
  const [totalPrize, setTotalPrize] = useState('');

  const handelToggleMode = () => {
    if (!bnbMode) {
      setBnbMode(1);
    } else setBnbMode(0);
  };

  const renderTotalPrizes = useCallback(async () => {
    if (library) {
      const balance = await library.getBalance(TREASURY_CONTRACT_ADDRESS);
      setTotalPrize(formatUnits(balance));
    }
  }, [library]);

  useEffect(() => {
    renderTotalPrizes();
  }, [renderTotalPrizes]);

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    if (!loadGameStateFromLocalStorage(true)) {
      setTimeout(() => {
        setIsInfoModalOpen(true);
      }, WELCOME_INFO_MODAL_MS);
    }
  });

  useEffect(() => {
    DISCOURAGE_INAPP_BROWSERS &&
      isInAppBrowser() &&
      showErrorAlert(DISCOURAGE_INAPP_BROWSER_TEXT, {
        persist: false,
        durationMs: 7000,
      });
  }, [showErrorAlert]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isDarkMode, isHighContrastMode]);

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const handleHardMode = (isHard: boolean) => {
    if (guesses.length === 0 || localStorage.getItem('gameMode') === 'hard') {
      setIsHardMode(isHard);
      localStorage.setItem('gameMode', isHard ? 'hard' : 'normal');
    } else {
      showErrorAlert(HARD_MODE_ALERT_MESSAGE);
    }
  };

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast);
    setStoredIsHighContrastMode(isHighContrast);
  };

  const clearCurrentRowClass = () => {
    setCurrentRowClass('');
  };

  useEffect(() => {
    saveGameStateToLocalStorage(getIsLatestGame(), { guesses, solution });
  }, [guesses]);

  useEffect(() => {
    if (isGameWon) {
      const winMessage = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
      const delayMs = REVEAL_TIME_MS * solution.length;

      showSuccessAlert(winMessage, {
        delayMs,
        onClose: () => setIsStatsModalOpen(true),
      });
    }

    if (isGameLost) {
      setTimeout(() => {
        setIsStatsModalOpen(true);
      }, (solution.length + 1) * REVEAL_TIME_MS);
    }
  }, [isGameWon, isGameLost, showSuccessAlert]);

  const [isPaid, setIsPaid] = useState(false);
  const handleSetPaid = () => {
    setIsPaid(true);
  };

  useEffect(() => {
    // 🚧 게임에 대한 비용을 지불했는지 안했는지 체크방법 필요
    // 우선 로컬스토리지에 txhash 저장하고 저장된 해쉬가 최근 트랜잭션 리스트에 있는지 체크하고 게임 시작 => 추후 DB 저장 등으로 변경 필요

    if (account) {
      const checkIsPaid = async () => {
        const LS_PAID_TX_HASH = localStorage.getItem('paidTxHash') || '';
        const getMyTransactionList = async () => {
          const result = await fetch(
            `https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${account}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc`,
          ).then((res) => res.json());

          return result?.result;
        };
        const myTransactions = await getMyTransactionList();
        const isPaid = Boolean(
          myTransactions.filter(
            (data: any) =>
              data.hash.toLowerCase() === LS_PAID_TX_HASH.toLowerCase() &&
              data.from.toLowerCase() === account.toLowerCase() &&
              data.to.toLowerCase() === GAME_CONTRACT_ADDRESS.toLowerCase(),
          )?.length,
        );

        setIsPaid(isPaid);
      };

      checkIsPaid();
    }
  }, [account]);

  const onChar = async (value: string) => {
    try {
      if (!bnbMode) {
        if (
          unicodeLength(`${currentGuess}${value}`) <= solution.length &&
          guesses.length < MAX_CHALLENGES &&
          !isGameWon
        ) {
          setCurrentGuess(`${currentGuess}${value}`);
        }
      } else {
        if (!account) {
          await connectWallet();
          return;
        }
        if (!(await isMetamaskUnlocked())) {
          showErrorAlert('Please check out Metamask wallet extension.');
          return;
        }

        if (isPaid) {
          if (
            unicodeLength(`${currentGuess}${value}`) <= solution.length &&
            guesses.length < MAX_CHALLENGES &&
            !isGameWon
          ) {
            setCurrentGuess(`${currentGuess}${value}`);
          }
        } else {
          setIsNeedFeeModalOpen(true);
        }
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const onDelete = () => {
    setCurrentGuess(new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join(''));
  };

  const onEnter = () => {
    if (isGameWon || isGameLost) {
      return;
    }

    if (!(unicodeLength(currentGuess) === solution.length)) {
      setCurrentRowClass('jiggle');
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      });
    }

    if (!isWordInWordList(currentGuess)) {
      setCurrentRowClass('jiggle');
      return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
        onClose: clearCurrentRowClass,
      });
    }

    // enforce hard mode - all guesses must contain all previously revealed letters
    if (isHardMode) {
      const firstMissingReveal = findFirstUnusedReveal(currentGuess, guesses);
      if (firstMissingReveal) {
        setCurrentRowClass('jiggle');
        return showErrorAlert(firstMissingReveal, {
          onClose: clearCurrentRowClass,
        });
      }
    }

    setIsRevealing(true);
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false);
    }, REVEAL_TIME_MS * solution.length);

    const winningWord = isWinningWord(currentGuess);

    if (unicodeLength(currentGuess) === solution.length && guesses.length < MAX_CHALLENGES && !isGameWon) {
      setGuesses([...guesses, currentGuess]);
      setCurrentGuess('');

      if (winningWord) {
        if (isLatestGame) {
          setStats(addStatsForCompletedGame(stats, guesses.length));
        }
        localStorage.removeItem('paidTxHash');
        return setIsGameWon(true);
      }

      if (guesses.length === MAX_CHALLENGES - 1) {
        if (isLatestGame) {
          setStats(addStatsForCompletedGame(stats, guesses.length + 1));
        }
        setIsGameLost(true);
        showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
          persist: true,
          delayMs: REVEAL_TIME_MS * solution.length + 1,
        });
      }
    }
  };

  useEffect(() => {
    const isDark = true;
    setIsDarkMode(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, []);

  useInterval(
    async () => {
      await renderTotalPrizes();
    },
    location.pathname === '/' ? 5000 : null,
  );

  return (
    <Div100vh>
      <div className="flex h-full flex-col">
        <Navbar
          setIsInfoModalOpen={setIsInfoModalOpen}
          setIsStatsModalOpen={setIsStatsModalOpen}
          setIsDatePickerModalOpen={setIsDatePickerModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
          handelToggleMode={handelToggleMode}
          bnbMode={bnbMode}
        />
        {location.pathname !== '/' ? (
          <Outlet />
        ) : (
          <>
            {!isLatestGame && (
              <div className="flex items-center justify-center">
                <ClockIcon className="h-6 w-6 stroke-gray-600 dark:stroke-gray-300" />
                <p className="text-base text-gray-600 dark:text-gray-300">
                  {format(gameDate, 'd MMMM yyyy', { locale: DATE_LOCALE })}
                </p>
              </div>
            )}
            <div className="w-full">
              <div className="text-yellow-400 text-2xl font-bold text-center">{GAME_TITLE}</div>
            </div>

            <div className="w-full text-xl text-white font-bold">
              <div className="flex items-center justify-center">
                <img src={prizeImg} width={40} alt="" className="mx-4 animate-bounce" />
                Total Prizes
                <img src={prizeImg} width={40} alt="" className="mx-4 animate-bounce" />
              </div>

              <div className="text-center">{totalPrize && totalPrize + ' BNB'}</div>
            </div>

            <div className="mx-auto flex w-full grow flex-col px-1 pt-2 pb-8 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 short:pt-2">
              <div className="flex grow flex-col justify-center pb-6 short:pb-2">
                <Grid
                  solution={solution}
                  guesses={guesses}
                  currentGuess={currentGuess}
                  isRevealing={isRevealing}
                  currentRowClassName={currentRowClass}
                />
              </div>
              <Keyboard
                onChar={onChar}
                onDelete={onDelete}
                onEnter={onEnter}
                solution={solution}
                guesses={guesses}
                isRevealing={isRevealing}
              />
              <InfoModal isOpen={isInfoModalOpen} handleClose={() => setIsInfoModalOpen(false)} />
              <StatsModal
                isOpen={isStatsModalOpen}
                handleClose={() => setIsStatsModalOpen(false)}
                solution={solution}
                guesses={guesses}
                gameStats={stats}
                isLatestGame={isLatestGame}
                isGameLost={isGameLost}
                isGameWon={isGameWon}
                handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
                handleShareFailure={() =>
                  showErrorAlert(SHARE_FAILURE_TEXT, {
                    durationMs: LONG_ALERT_TIME_MS,
                  })
                }
                handleMigrateStatsButton={() => {
                  setIsStatsModalOpen(false);
                  setIsMigrateStatsModalOpen(true);
                }}
                isHardMode={isHardMode}
                isDarkMode={isDarkMode}
                isHighContrastMode={isHighContrastMode}
                numberOfGuessesMade={guesses.length}
              />
              <DatePickerModal
                isOpen={isDatePickerModalOpen}
                initialDate={solutionGameDate}
                handleSelectDate={(d) => {
                  setIsDatePickerModalOpen(false);
                  setGameDate(d);
                }}
                handleClose={() => setIsDatePickerModalOpen(false)}
              />
              <MigrateStatsModal
                isOpen={isMigrateStatsModalOpen}
                handleClose={() => setIsMigrateStatsModalOpen(false)}
              />
              <SettingsModal
                isOpen={isSettingsModalOpen}
                handleClose={() => setIsSettingsModalOpen(false)}
                isHardMode={isHardMode}
                handleHardMode={handleHardMode}
                isDarkMode={isDarkMode}
                handleDarkMode={handleDarkMode}
                isHighContrastMode={isHighContrastMode}
                handleHighContrastMode={handleHighContrastMode}
              />
              <NeedFeeModal
                isOpen={isNeedFeeModalOpen}
                handleClose={() => setIsNeedFeeModalOpen(false)}
                handleSetPaid={handleSetPaid}
              />
            </div>
          </>
        )}
      </div>
    </Div100vh>
  );
}

export default App;
