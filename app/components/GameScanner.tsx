import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from "html5-qrcode";
import { GAME_STATE } from "../models";
import { GameStateContext, PlayersContext, ScannerContext } from "../context";

const USE_FAKE_SCANNER = false;

const config: Html5QrcodeCameraScanConfig = {
  fps: 10,
  qrbox: { width: 250, height: 250 },
};

export default function GameScanner({ children }) {
  const { value: players } = useContext(PlayersContext);
  const { value: gameState } = useContext(GameStateContext);
  const [isScanning, setIsScanning] = useState(false);
  const scannerScreen = useRef<HTMLDivElement>(null);
  const scannerInstance = useRef<Html5Qrcode>(null);

  useEffect(() => {
    scannerInstance.current = new Html5Qrcode(scannerScreen.current.id);
  }, []);

  const [scanCount, setScanCount] = useState(0);
  const render = useCallback(
    (success: (code: string) => void, _: (error: any) => void) => {
      const wrappedSuccess = (code: string) => {
        scannerInstance.current?.stop();
        setIsScanning(false);
        success(code);
      };

      // const wrappedError = (error: any) => {
      //   // setIsScanning(false);
      //   error(error);
      // };

      if (USE_FAKE_SCANNER) {
        setIsScanning(true);
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
      } else {
        if (!scannerInstance.current) return;
        setIsScanning(true);
        scannerInstance.current.start(
          { facingMode: "environment" },
          config,
          wrappedSuccess,
          console.error
        );
      }
    },
    [gameState, players, scanCount]
  );

  const scanScreenClassName = isScanning
    ? "fixed w-screen h-screen bg-white z-50"
    : "hidden";

  return (
    <ScannerContext.Provider value={{ render }}>
      <div className={scanScreenClassName}>
        <div
          id="scanner-screen"
          ref={scannerScreen}
          className={scanScreenClassName}
        ></div>
      </div>
      {children}
    </ScannerContext.Provider>
  );
}
