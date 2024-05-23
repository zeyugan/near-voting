require('dotenv').config();

// React
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// NEAR
import { Wallet } from './near-wallet';

const CONTRACT_ADDRESS = process.env.CONTRACT_NAME;
console.log(CONTRACT_ADDRESS);

// user wallet login
const wallet = new Wallet({ createAccessKeyFor: CONTRACT_ADDRESS });
console.log(wallet);
const container = document.getElementById('root');
const root = createRoot(container);

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp();

  root.render(
    <App isSignedIn={isSignedIn} contractId={CONTRACT_ADDRESS} wallet={wallet} />
  );
};
