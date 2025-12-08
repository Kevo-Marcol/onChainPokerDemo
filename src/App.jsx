import { useEffect, useState } from "react";
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contractConfig";

const STATE_NAMES = [
  "Waiting",
  "Preflop",
  "Flop",
  "Turn",
  "River",
  "Showdown",
  "Settled",
];

function App() {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);

  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const [stakeEth, setStakeEth] = useState("0.01");
  const [gameInfo, setGameInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Detect MetaMask
  useEffect(() => {
    if (window.ethereum) {
      const prov = new BrowserProvider(window.ethereum);
      setProvider(prov);
    } else {
      setError("MetaMask not detected. Install MetaMask to use this demo.");
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!provider) {
        setError("No Ethereum provider found.");
        return;
      }

      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);

      const c = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(c);

      setError("");
      setStatus("Wallet connected and contract ready.");
      await refreshGame(c, addr);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to connect wallet: " + (err.shortMessage || err.message || "")
      );
    }
  };

  const requireReady = () => {
    if (!contract || !address) {
      setError("Connect your wallet first.");
      throw new Error("Not ready");
    }
  };

  const refreshGame = async (c = contract, addr = address) => {
    if (!c || !addr) return;
    try {
      const [stateRaw, potWei, players] = await c.getGameState();
      const community = await c.getCommunity();
      const [c1, c2] = await c.getMyCards();

      setGameInfo({
        state: Number(stateRaw),
        potEth: formatEther(potWei),
        players,
        community: community.map(Number),
        myCards: [Number(c1), Number(c2)],
      });
      setError("");
    } catch (err) {
      console.error("refreshGame error:", err);
      setError(
        "Failed to read game state: " +
          (err.shortMessage || err.reason || err.message || "")
      );
    }
  };

  const handleJoinGame = async () => {
    try {
      requireReady();
      setLoading(true);
      setError("");
      setStatus("Joining game...");

      const tx = await contract.joinGame({
        value: parseEther(stakeEth),
      });
      await tx.wait();

      setStatus("Joined game.");
      await refreshGame();
    } catch (err) {
      console.error("joinGame error:", err);
      setError(
        "Failed to join game: " +
          (err.shortMessage || err.reason || err.message || "")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartAndDeal = async () => {
    try {
      requireReady();
      setLoading(true);
      setError("");
      setStatus("Starting game and dealing cards...");

      const tx = await contract.startAndDeal();
      await tx.wait();

      setStatus("Game started, cards dealt.");
      await refreshGame();
    } catch (err) {
      console.error("startAndDeal error:", err);
      setError(
        "Failed to start/deal: " +
          (err.shortMessage || err.reason || err.message || "")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReveal = async () => {
    try {
      requireReady();
      setLoading(true);
      setError("");
      setStatus("Revealing community / advancing state...");

      const tx = await contract.revealCommunity();
      await tx.wait();

      setStatus("State advanced.");
      await refreshGame();
    } catch (err) {
      console.error("revealCommunity error:", err);
      setError(
        "Failed to reveal community: " +
          (err.shortMessage || err.reason || err.message || "")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSettle = async () => {
    try {
      requireReady();
      setLoading(true);
      setError("");
      setStatus("Settling game...");

      const tx = await contract.settle();
      await tx.wait();

      setStatus("Game settled.");
      await refreshGame();
    } catch (err) {
      console.error("settle error:", err);
      setError(
        "Failed to settle: " +
          (err.shortMessage || err.reason || err.message || "")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <h1>On-Chain Poker Demo (Single Game)</h1>
      <p style={{ marginBottom: "1rem" }}>
        This demo uses one fixed game on the Sepolia testnet. All ETH is test ETH.
      </p>

      {/* Wallet */}
      <section
        style={{
          border: "1px solid #444",
          padding: "1rem",
          borderRadius: 8,
          marginBottom: "1.5rem",
        }}
      >
        <h2>Wallet</h2>
        {address ? (
          <p>
            Connected as: <b>{address}</b>
          </p>
        ) : (
          <>
            <p>Wallet not connected.</p>
            <button onClick={connectWallet}>Connect MetaMask</button>
          </>
        )}
        {error && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
        )}
        {status && !error && (
          <p style={{ color: "lightgreen", marginTop: "0.5rem" }}>{status}</p>
        )}
      </section>

      {/* Actions */}
      <section
        style={{
          border: "1px solid #444",
          padding: "1rem",
          borderRadius: 8,
          marginBottom: "1.5rem",
        }}
      >
        <h2>Game Actions (Single Game)</h2>

        <div style={{ marginBottom: "0.75rem" }}>
          <h3>Join Game</h3>
          <label>
            Stake (test ETH):{" "}
            <input
              type="text"
              value={stakeEth}
              onChange={(e) => setStakeEth(e.target.value)}
              style={{ width: 80 }}
            />
          </label>
          <button
            onClick={handleJoinGame}
            disabled={loading || !address}
            style={{ marginLeft: "1rem" }}
          >
            Join
          </button>
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <h3>Start & Deal</h3>
          <button
            onClick={handleStartAndDeal}
            disabled={loading || !address}
          >
            Start & Deal
          </button>
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <h3>Reveal Community / Advance</h3>
          <button onClick={handleReveal} disabled={loading || !address}>
            Reveal / Advance
          </button>
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <h3>Settle</h3>
          <button onClick={handleSettle} disabled={loading || !address}>
            Settle Game
          </button>
        </div>

        <button onClick={() => refreshGame()} disabled={loading || !address}>
          Refresh Game Info
        </button>
      </section>

      {/* Game Info */}
      <section
        style={{
          border: "1px solid #444",
          padding: "1rem",
          borderRadius: 8,
        }}
      >
        <h2>Game Info (Fixed GAME_ID = 1)</h2>
        {gameInfo ? (
          <>
            <p>
              State:{" "}
              <b>{STATE_NAMES[gameInfo.state] ?? gameInfo.state}</b>
            </p>
            <p>
              Pot: <b>{gameInfo.potEth} test ETH</b>
            </p>
            <p>
              Players:
              <br />
              {gameInfo.players.length === 0
                ? "No players yet."
                : gameInfo.players.map((p) => <div key={p}>{p}</div>)}
            </p>

            <h3>Community Cards (raw IDs)</h3>
            <p>
              {gameInfo.community.length
                ? gameInfo.community.join(", ")
                : "No community cards yet."}
            </p>

            <h3>Your Cards (raw IDs)</h3>
            <p>
              {gameInfo.myCards &&
              (gameInfo.myCards[0] !== 0 || gameInfo.myCards[1] !== 0)
                ? `${gameInfo.myCards[0]} , ${gameInfo.myCards[1]}`
                : "You have no cards yet."}
            </p>
          </>
        ) : (
          <p>No game info yet. Connect wallet and click Refresh.</p>
        )}
      </section>
    </div>
  );
}

export default App;