"use client";

import { useSessionStorage } from "@uidotdev/usehooks";
import React, { useCallback, useState } from "react";
import { GAME_STATE } from "../models";
import {
  PlayersContext,
  GameStateContext,
  ScannerContext,
  IScanner,
} from "../context";
import GameSetup from "./GameSetup";
import GamePlay from "./GamePlay";
import GameScanner from "./GameScanner";

export default function Game() {
  const [players, setPlayers] = useSessionStorage("players", []);
  const [gameState, setGameState] = useState<GAME_STATE>(GAME_STATE.SETUP);

  const stateCtx = { value: gameState, setter: setGameState };
  const playersCtx = { value: players, setter: setPlayers };

  return (
    <main className="prose flex flex-col items-center justify-start">
      <GameStateContext.Provider value={stateCtx}>
        <PlayersContext.Provider value={playersCtx}>
          <GameScanner>
            <h1 className="pt-4">Deal with the Devil</h1>
            {gameState === GAME_STATE.SETUP && <GameSetup />}
            {gameState === GAME_STATE.PLAYING && <GamePlay />}
          </GameScanner>
        </PlayersContext.Provider>
      </GameStateContext.Provider>
    </main>
  );
}
