import { useAlert } from '../context/AlertContext';
import { setupNetwork } from '../lib/wallet';
import { getErrorMessage, injected } from '../lib/web3React';
import MetaMaskOnboarding from '@metamask/onboarding';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import { useCallback, useEffect, useRef } from 'react';

const useMetamaskAuth = () => {
  const { activate, deactivate } = useWeb3React();
  const onboarding = useRef<MetaMaskOnboarding>();
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } = useAlert();

  const login = useCallback(() => {
    const connector = injected;

    if (connector) {
      activate(connector, async (error: Error) => {
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupNetwork();
          if (hasSetup) {
            activate(connector);
          }
        } else {
          if (error instanceof NoEthereumProviderError) {
            //메타마스크 설치 안된 케이스
            showErrorAlert(getErrorMessage(error));
            if (onboarding.current) onboarding.current.startOnboarding();
          } else if (error instanceof UserRejectedRequestErrorInjected) {
            // console.log('reject');
            //사용자가 지갑 연결 거부한 케이스

            showErrorAlert(getErrorMessage(error));
          } else {
            // console.log('unhandled');
            if ((error as any).code !== -32002) {
              //예상치 못한 기타 에러
              showErrorAlert(getErrorMessage(error));
            }
          }
        }
      });
    } else {
      //connector가 주입되지 않은 케이스
      showErrorAlert('Unable to find connector');
    }
  }, [activate, showErrorAlert]);

  const logout = useCallback(() => {
    deactivate();
  }, [deactivate]);

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  return { login, logout };
};

export default useMetamaskAuth;
