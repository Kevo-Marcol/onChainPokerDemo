On-Chain Poker Demo:

This project is a **single-round** on-chain poker demo built with:
- Solidity (smart contract)
- React + Vite (frontend)
- Ethers.js (blockchain interaction)
- MetaMask (wallet)
- Sepolia Test Network (Ethereum testnet, no real money)

The goal of the project is to demonstrate blockchain-based game logic, including:
- Wallet authentication
- Payable transactions
- On-chain game state
- Card dealing
- State transitions
- Automatic winner payout

**NOTE:** This is a demo / educational project, not a production casino system.

_**Key Features:**_
- MetaMask wallet connection
- Players join by sending test ETH
- On-chain pot accumulation
- On-chain game state machine
- Private player cards stored on-chain
- Public community cards stored on-chain
- Automatic payout using a smart contract
- Fully readable blockchain game state
- No real money involved (Sepolia test ETH only)

_**Game State Flow**_

The smart contract uses the following game states:

Waiting → Preflop → Flop → Turn → River → Showdown → Settled

_**State	Description:**_
1) Waiting	Game is open for players to join
2) Preflop	Players receive 2 cards (their respective whole cards)
3) Flop	(First 3 community cards) revealed
4) Turn (4th community card) revealed
5) River	(5th community card) revealed
6) Showdown	Final stage before settlement
7) Settled	Winner is paid and game ends

_**How the Game Works:**_
0) The contract is deployed on Sepolia → the table is in the _waiting_ stage.
1) Player clicks Join Game → sends test ETH as an ante into the pot.
2) Start & Deal assigns 2 cards to each player.
3) _Reveal / Advance_ is clicked multiple times: Reveals Flop → Turn → River
4) After _Showdown_, the game calculates the winning hand and the winner is paid in the _Settled_ stage.
5) The game ends in the Settled state.

For demo purposes, the winner is always the first player.

_**Project Structure:**_
poker-ui/
├── src/
│   ├── App.jsx              # Main React UI
│   ├── contractConfig.js   # Contract address & ABI
│   └── main.jsx
├── index.html
├── package.json
└── README.md

_**Smart Contract Overview:**_
The contract (OnChainPokerDemo) includes:
- joinGame() – Player joins by sending ETH
- startAndDeal() – Deals private player cards
- revealCommunity() – Reveals community cards and advances state
- settle() – Pays the winner and ends the game
- getGameState() – Reads state, pot and players
- getCommunity() – Reads community cards
- getMyCards() – Reads the connected player's cards

The contract stores data about:
- Players
- Bets
- Pot
- Community cards
- Game state

**Test Network (Important)**
This project uses the _Sepolia Test Network_ and test ETH in all transactions, so the games played will not be real-money


_**How to Run the Project:**_
1) Install dependencies:
npm install
2) Start development server:
npm run dev

Open in browser the local host generated

**IMPORTANT NOTE:** Make sure MetaMask is:
- Installed as a chrome extension to test this program
- Set to Sepolia Test Network

_**Demo Instructions:**_
1) Click Connect MetaMask
2) Enter a stake (e.g. 0.0001)
3) Click Join Game
4) Click Start & Deal
5) Click Reveal / Advance several times
6) Click Settle Game
7) Click Refresh Game Info



This project demonstrates:

✅ Smart contract deployment
✅ Payable transactions
✅ On-chain state machines
✅ Decentralized game logic
✅ Frontend → blockchain communication
✅ Trustless fund custody and payout

Authors:
Developed by Anahit Navoyan, Anahit Mkhitaryan, Kevin Markalian, Reza Azimifashi
using Solidity + React + Ethers.js + MetaMask + Sepolia Testnet.
