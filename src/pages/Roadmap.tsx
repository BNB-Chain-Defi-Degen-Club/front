const Roadmap = () => {
  return (
    <div className="px-5">
      <div className="flex flex-col items-center">
        <h1 className="text-white text-2xl font-extrabold text-left mb-4">Roadmap</h1>
        <ol className="relative border-l border-gray-200 dark:border-gray-700">
          <li className="mb-10 ml-6">
            <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              <svg
                aria-hidden="true"
                className="w-3 h-3 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              Phase 1. NFT and BNB Wordle
            </h3>

            <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
              Early NFT minting and BNB Wordle operation for the NFT community
            </p>
          </li>
          <li className="mb-10 ml-6">
            <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              <svg
                aria-hidden="true"
                className="w-3 h-3 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              Phase 2. Connect BNB DeFi protocol
            </h3>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              BNB chain node delegation based on cumulative rewards and token staking to underlying protocols
            </p>
          </li>
          <li className="mb-10 ml-6">
            <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              <svg
                aria-hidden="true"
                className="w-3 h-3 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              Phase 3. NFT Staking Service and issue DDC tokens
            </h3>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              Launch NFT Staking Service and issue DDC tokens to holder targets
            </p>
          </li>
          <li className="ml-6">
            <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              <svg
                aria-hidden="true"
                className="w-3 h-3 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              Phase 4. Synthetic Asset DeFi and Governance System
            </h3>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              Release DeFi Service in BNB Ecosystem and Buildi a Synthetic asset-based rendering protocol
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Roadmap;
