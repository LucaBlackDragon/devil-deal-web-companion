"use client";

import { useSessionStorage } from "@uidotdev/usehooks";
import React, { useState } from "react";
import { GAME_STATE } from "../models";
import { PlayersContext, GameStateContext } from "../context";
import GameSetup from "./GameSetup";
import GamePlay from "./GamePlay";

export default function Game() {
  const [players, setPlayers] = useSessionStorage("players", []);
  const [gameState, setGameState] = useState<GAME_STATE>(GAME_STATE.SETUP);

  const stateCtx = { value: gameState, setter: setGameState };
  const playersCtx = { value: players, setter: setPlayers };

  return (
    <main className="prose pt-2 px-2 flex flex-col items-center justify-start">
      <h1>Deal with the Devil</h1>
      <GameStateContext.Provider value={stateCtx}>
        <PlayersContext.Provider value={playersCtx}>
          {gameState === GAME_STATE.SETUP && <GameSetup />}
          {gameState === GAME_STATE.PLAYING && <GamePlay />}
        </PlayersContext.Provider>
      </GameStateContext.Provider>
    </main>
  );
}
