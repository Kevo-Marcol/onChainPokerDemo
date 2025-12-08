On-Chain Poker Demo (Sepolia Testnet)

This project is a single-round on-chain poker demo built with:

Solidity (smart contract)

React + Vite (frontend)

Ethers.js (blockchain interaction)

MetaMask (wallet)

Sepolia Test Network (Ethereum testnet, no real money)

The goal of the project is to demonstrate blockchain-based game logic, including:

Wallet authentication

Payable transactions

On-chain game state

Card dealing

State transitions

Automatic winner payout

This is a demo / educational project, not a production casino system.

🚀 Features

✅ MetaMask wallet connection
✅ Players join by sending test ETH
✅ On-chain pot accumulation
✅ On-chain game state machine
✅ Private player cards stored on-chain
✅ Public community cards stored on-chain
✅ Automatic payout using a smart contract
✅ Fully readable blockchain game state
✅ No real money involved (Sepolia test ETH only)

🎮 Game State Flow

The smart contract uses the following game states:

Waiting → Preflop → Flop → Turn → River → Showdown → Settled

State	Description
Waiting	Game is open for players to join
Preflop	Players receive 2 cards
Flop	First 3 community cards revealed
Turn	4th community card revealed
River	5th community card revealed
Showdown	Final stage before settlement
Settled	Winner is paid and game ends
🧠 How the Game Works

The contract is deployed on Sepolia → game starts in Waiting.

Player clicks Join Game → sends test ETH into the pot.

Start & Deal assigns 2 cards to each player.

Reveal / Advance is clicked multiple times:

Reveals Flop → Turn → River

After Showdown, Settle Game pays the winner.

The game ends in the Settled state.

For demo purposes, the winner is always the first player.

📂 Project Structure
poker-ui/
├── src/
│   ├── App.jsx              # Main React UI
│   ├── contractConfig.js   # Contract address & ABI
│   └── main.jsx
├── index.html
├── package.json
└── README.md

⚙️ Smart Contract Overview

The contract (OnChainPokerDemo) includes:

joinGame() – Player joins by sending ETH

startAndDeal() – Deals private player cards

revealCommunity() – Reveals community cards and advances state

settle() – Pays the winner and ends the game

getGameState() – Reads state, pot and players

getCommunity() – Reads community cards

getMyCards() – Reads the connected player's cards

The contract stores:

Players

Bets

Pot

Community cards

Game state

🧪 Test Network (Important)

This project uses:

✅ Sepolia Test Network
✅ Test ETH (free from faucets)
❌ NO real ETH used

▶️ How to Run the Project

Install dependencies:

npm install


Start development server:

npm run dev


Open in browser the local host generated


Make sure MetaMask is:

Installed as a chrome extension to test this program

Set to Sepolia Test Network

🎯 Demo Instructions

Click Connect MetaMask

Enter a stake (e.g. 0.0001)

Click Join Game

Click Start & Deal

Click Reveal / Advance several times

Click Settle Game

Click Refresh Game Info



This project demonstrates:

✅ Smart contract deployment
✅ Payable transactions
✅ On-chain state machines
✅ Decentralized game logic
✅ Frontend → blockchain communication
✅ Trustless fund custody and payout

👨‍🎓 Author

Developed by Anahit Navoyan, Anahit Mkhitaryan, Kevin Markalian, Reza Azimifashi
using Solidity + React + Ethers.js + MetaMask + Sepolia Testnet.