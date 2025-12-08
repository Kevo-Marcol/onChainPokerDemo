// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract OnChainPokerDemo {
    enum GameState {
        Waiting,
        Preflop,
        Flop,
        Turn,
        River,
        Showdown,
        Settled
    }

    // We keep a constant ID for explanation / UI if needed
    uint256 public constant GAME_ID = 1;

    struct Player {
        address addr;
        bool active;
        uint256 bet;
        uint8[2] cards;
    }

    struct Game {
        GameState state;
        uint256 pot;
        address[] players;
        mapping(address => Player) playerInfo;
        uint8[] community;
    }

    Game private game;

    constructor() {
        game.state = GameState.Waiting;
    }

    // One fixed game – just (re)initialise it if needed
    function createGame() external {
        require(game.players.length == 0, "Game already exists");
        game.state = GameState.Waiting;
    }

    // Join the single game, sending some test ETH as your stake
    function joinGame() external payable {
        require(game.state == GameState.Waiting, "Game already started");
        require(msg.value > 0, "Send some test ETH");

        Player storage p = game.playerInfo[msg.sender];
        require(p.addr == address(0), "Already joined");

        p.addr = msg.sender;
        p.active = true;
        p.bet = msg.value;

        game.players.push(msg.sender);
        game.pot += msg.value;
    }

    // Start game and deal simple demo “cards”
    function startAndDeal() external {
        require(game.state == GameState.Waiting, "Already started");
        game.state = GameState.Preflop;

        for (uint256 i = 0; i < game.players.length; i++) {
            game.playerInfo[game.players[i]].cards[0] = uint8(i + 1);
            game.playerInfo[game.players[i]].cards[1] = uint8(i + 10);
        }
    }

    // Reveal community cards step by step
    function revealCommunity() external {
        require(game.state != GameState.Settled, "Game over");

        if (game.state == GameState.Preflop) {
            game.community.push(1);
            game.community.push(2);
            game.community.push(3);
            game.state = GameState.Flop;
        } else if (game.state == GameState.Flop) {
            game.community.push(4);
            game.state = GameState.Turn;
        } else if (game.state == GameState.Turn) {
            game.community.push(5);
            game.state = GameState.River;
        } else if (game.state == GameState.River) {
            game.state = GameState.Showdown;
        }
    }

    // Very simple settle: first player gets the whole pot
    function settle() external {
        require(game.state == GameState.Showdown, "Not ready");
        require(game.players.length > 0, "No players");
        game.state = GameState.Settled;

        address winner = game.players[0];
        uint256 amount = game.pot;
        game.pot = 0;
        payable(winner).transfer(amount);
    }

    // --------- VIEW FUNCTIONS (for your UI) ---------

    function getGameState()
        external
        view
        returns (GameState, uint256, address[] memory)
    {
        return (game.state, game.pot, game.players);
    }

    function getCommunity() external view returns (uint8[] memory) {
        return game.community;
    }

    function getMyCards() external view returns (uint8, uint8) {
        Player storage p = game.playerInfo[msg.sender];
        return (p.cards[0], p.cards[1]);
    }
}