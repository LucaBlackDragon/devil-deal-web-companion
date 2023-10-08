import { useCallback, useContext, useState } from "react";
import { GAME_STATE } from "../models";
import { GameStateContext, PlayersContext, ScannerContext } from "../context";

export default function GameScanner({ children }) {
  const { value: players } = useContext(PlayersContext);
  const { value: gameState } = useContext(GameStateContext);
  const [isScanning, setIsScanning] = useState(false);

  const [scanCount, setScanCount] = useState(0);
  const render = useCallback(
    (success: (code: string) => void, _: (code: string) => void) => {
      setIsScanning(true);

      const wrappedSuccess = (code: string) => {
        const randomDelay = Math.floor(Math.random() * 800 + 200);
        setTimeout(() => {
          setIsScanning(false);
          success(code);
        }, randomDelay);
      };

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
        wrappedSuccess(availableCodes[randomIndex]);
        return;
      }
      wrappedSuccess(players[newScanCount % players.length].code);
    },
    [gameState, players, scanCount]
  );

  const scanScreenClassName = isScanning
    ? "fixed w-screen h-screen bg-[#00000088] z-50"
    : "hidden";

  return (
    <ScannerContext.Provider value={{ render }}>
      <div className={scanScreenClassName}></div>
      {children}
    </ScannerContext.Provider>
  );
}
