import { useCallback, useContext } from "react";
import { GameStateContext, PlayersContext } from "../context";
import { GAME_STATE } from "../models";

export default function StartGameButton() {
  const { value: players } = useContext(PlayersContext);
  const { setter: setGameState } = useContext(GameStateContext);

  const onButtonClick = useCallback(() => {
    if (players.length < 3) return;
    setGameState(GAME_STATE.PLAYING);
  }, [players.length, setGameState]);

  return (
    <button
      disabled={players.length < 3}
      className="btn btn-primary"
      onClick={onButtonClick}
    >
      Inizia
    </button>
  );
}
