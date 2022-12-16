import { useEffect, useLayoutEffect, useRef } from 'react';

type TCallback = any;
type TDelay = number | null;

const useInterval = (callback: TCallback, delay: TDelay) => {
  const savedCallback = useRef<TCallback>();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useLayoutEffect(() => {
    if (delay !== null) {
      const tick = () => {
        savedCallback.current();
      };

      const timerId = setInterval(tick, delay);
      return () => clearInterval(timerId);
    }
  }, [delay]);
};

export default useInterval;
