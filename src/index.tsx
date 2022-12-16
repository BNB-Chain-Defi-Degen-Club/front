import App from './App';
import { AlertProvider } from './context/AlertContext';
import './index.css';
import { getLibrary } from './lib/web3React';
import Dashboard from './pages/Dashboard';
import NFT from './pages/Nft';
import Roadmap from './pages/Roadmap';
import { Web3ReactProvider } from '@web3-react/core';
import ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/nft', element: <NFT /> },
      { path: '/roadmap', element: <Roadmap /> },
    ],
  },
]);

ReactDOM.render(
  <AlertProvider>
    <Web3ReactProvider getLibrary={getLibrary}>
      <RouterProvider router={router} />
    </Web3ReactProvider>
  </AlertProvider>,
  document.getElementById('root'),
);
