import { createUpdatableContext } from "./customHooks";
import { Player, GAME_STATE } from "./models";

export const GameStateContext = createUpdatableContext<GAME_STATE>([GAME_STATE.SETUP, () => {}]);
export const PlayersContext = createUpdatableContext<Player[]>([[], () => {}]);