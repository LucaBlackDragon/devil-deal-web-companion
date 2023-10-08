import { useCallback, useContext } from "react";
import { GameStateContext, PlayersContext } from "../context";
import { GAME_STATE } from "../models";

export default function ClearGameButton() {
  const { setter: setPlayers } = useContext(PlayersContext);
  const { setter: setGameState } = useContext(GameStateContext);

  const onButtonClick = useCallback(() => {
    setGameState(GAME_STATE.SETUP);
    setPlayers([]);
  }, [setPlayers, setGameState]);

  return (
    <button className="btn btn-secondary" onClick={onButtonClick}>
      Nuova partita
    </button>
  );
}
