import { getContract, useContract } from '..//hooks/useContract';
import ABI_NFT from '../abi/BDDCMint.json';
import { MINT_CONTRACT_ADDRESS, GAME_FEE, TREASURY_CONTRACT_ADDRESS } from '../constants/settings';
import { useAlert } from '../context/AlertContext';
import useWeb3Provider from '../hooks/useWeb3Provider';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useCallback, useEffect, useState } from 'react';

interface INft {
  name: string;
  image: string;
  edition: string;
  description: string;
  attributes: any[];
}

const NFT = () => {
  const { library } = useWeb3Provider();
  const { account } = useWeb3React();
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } = useAlert();
  const nftContract = useContract(MINT_CONTRACT_ADDRESS, ABI_NFT);
  const nftContractPublic = getContract(ABI_NFT, MINT_CONTRACT_ADDRESS);
  const nftInterface = new ethers.utils.Interface(ABI_NFT);

  const handleClickMint = async () => {
    try {
      if (account && library && nftContract) {
        const parsedAmount = ethers.utils.parseUnits(GAME_FEE);
        const amountToHexValue = ethers.utils.hexValue(parsedAmount);

        // //트랜잭션에 사용할 data를 위해 인코딩
        const data = nftInterface.encodeFunctionData('mintNFT');

        const gasLimit = await library.estimateGas({
          from: account,
          to: MINT_CONTRACT_ADDRESS,
          data,
          value: amountToHexValue,
        });
        const gasLimitToHexValue = ethers.utils.hexValue(gasLimit.add(100000));

        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: account,
              to: MINT_CONTRACT_ADDRESS,
              gas: gasLimitToHexValue,
              data,
              value: amountToHexValue,
            },
          ],
        });

        if (String(txHash)) {
          showSuccessAlert('Minted Successfully');
        }
      }
    } catch (error) {
      showErrorAlert('Failed');
      console.error(error);
    }
  };

  const [totalSupply, setTotalSupply] = useState('');
  const [floorPrice, setFloorPrice] = useState('');
  const [holders, setHolders] = useState(0);
  const [myNfts, setMyNfts] = useState([]);
  const [fetchNft, setFetchNft] = useState(false);

  useEffect(() => {
    const getNftInfo = async () => {
      try {
        if (nftContractPublic) {
          // const _totalNFT = await nftContract.TOTAL_NFT();
          const _totalSupply = await nftContractPublic.totalSupply();
          setTotalSupply(formatUnits(_totalSupply, 0));
          const _price = await nftContractPublic.Price();
          setFloorPrice(formatUnits(_price));
          const metadataURI = await nftContractPublic.metadataURI();
          localStorage.setItem('metadataURI', metadataURI);
          const holders = new Map();

          const totalSupplyArray = Array.from({ length: Number(formatUnits(_totalSupply, 0)) }, (v, i) => i + 1);

          for await (const el of totalSupplyArray) {
            const tokenOwner = await nftContractPublic.ownerOf(el);
            holders.set(tokenOwner, 1);
          }

          setHolders(holders.size);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getNftInfo();

    const getMyNFTs = async () => {
      try {
        if (account && library && nftContract) {
          const nftIdList = await nftContract.getNFTs(account);
          const formatNftIdList = nftIdList.map((id: any) => formatUnits(id, 0));
          setFetchNft(true);
          // setMyNfts(() => formatNftIdList);
          const LS_metadataURI = localStorage.getItem('metadataURI');

          const metadataList = [] as any;

          for await (const id of formatNftIdList) {
            const result = await fetch(`${LS_metadataURI}/${id}.json`).then((res) => res.json());
            metadataList.push(result);
          }

          setMyNfts(() => metadataList);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (account && !fetchNft) {
      getMyNFTs();
    }
  }, [account, library, nftContract, fetchNft, nftContractPublic]);

  return (
    <div className="px-5">
      <div className="flex justify-between mb-4">
        <h1 className="text-white text-2xl font-extrabold text-left">NFT Inventory</h1>
        {Boolean(account) && (
          <button onClick={handleClickMint} className="bg-amber-400 text-black rounded-sm	 px-4 py-1 font-bold">
            Mint NFT
          </button>
        )}
      </div>

      <div className="w-full bg-white border rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div id="fullWidthTabContent" className=" border-gray-200 dark:border-gray-600">
          <div className="bg-white rounded-lg  dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
            <dl className="grid max-w-screen-xl gap-8 mx-auto text-gray-900 grid-cols-2 md:grid-cols-4 dark:text-white p-4 lg:p-8">
              <div className="flex flex-col items-center justify-center">
                <dd className="font-light text-gray-500 dark:text-gray-400">Total Volume</dd>
                <dt className="mb-2 text-xl md:text-3xl font-extrabold">100 BNB</dt>
              </div>
              <div className="flex flex-col items-center justify-center">
                <dd className="font-light text-gray-500 dark:text-gray-400">Items</dd>
                <dt className="mb-2 text-xl md:text-3xl font-extrabold">{totalSupply ? totalSupply : 0}</dt>
              </div>
              <div className="flex flex-col items-center justify-center">
                <dd className="font-light text-gray-500 dark:text-gray-400">Owners</dd>
                <dt className="mb-2 text-xl md:text-3xl font-extrabold">{holders ? holders : 0}</dt>
              </div>
              <div className="flex flex-col items-center justify-center">
                <dd className="font-light text-gray-500 dark:text-gray-400">Floor price</dd>
                <dt className="mb-2 text-xl md:text-3xl font-extrabold">{floorPrice ? floorPrice : 0} BNB</dt>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <dl className="grid max-w-screen-xl gap-2 mx-auto text-gray-900 grid-cols-2 md:grid-cols-4 dark:text-white p-4 lg:p-8">
        {Boolean(myNfts.length) &&
          myNfts.map((nft: INft) => (
            <div
              key={nft.name}
              className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
            >
              <img className="rounded-t-lg" src={nft.image} alt="" />
              <div className="p-4">
                <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">{nft.name}</h5>
              </div>
            </div>
          ))}
      </dl>
    </div>
  );
};

export default NFT;
