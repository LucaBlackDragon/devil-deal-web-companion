import { createContext, useContext } from "react";
import { createSettableContext } from "./customHooks";
import { Player, GAME_STATE } from "./models";

export interface IScanner {
  render(success: (result: string) => void, error: (error: any) => void): void;
}

export const GameStateContext = createSettableContext<GAME_STATE>([GAME_STATE.SETUP, () => {}]);
export const PlayersContext = createSettableContext<Player[]>([[], () => {}]);
export const ScannerContext = createContext<IScanner | null>(null);