import { useCallback, useContext, useState } from "react";
import { GAME_STATE } from "../models";
import { GameStateContext, PlayersContext, ScannerContext } from "../context";

export default function GameScanner({ children }) {
  const { value: players } = useContext(PlayersContext);
  const { value: gameState } = useContext(GameStateContext);

  const [scanCount, setScanCount] = useState(0);
  const render = useCallback(
    (success: (code: string) => void, _: (code: string) => void) => {
      const newScanCount = scanCount + 1;
      setScanCount(newScanCount);
      const codes = ["A", "B", "C", "D"];
      if (gameState === GAME_STATE.SETUP) {
        const codesUsedByPlayers = codes.filter((code) =>
          players.some((player) => player.code === code)
        );
        const availableCodes = codes.filter(
          (code) => !codesUsedByPlayers.includes(code)
        );
        const randomIndex = Math.floor(Math.random() * availableCodes.length);
        success(availableCodes[randomIndex]);
        return;
      }
      success(players[newScanCount % players.length].code);
    },
    [gameState, players, scanCount]
  );

  return (
    <ScannerContext.Provider value={{ render }}>
      {children}
      {/* TODO: add scanner interface */}
    </ScannerContext.Provider>
  );
}
