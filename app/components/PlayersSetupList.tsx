import { useCallback, useContext } from "react";
import { PlayersContext } from "../context";
import { Player, PLAYER_COLOR } from "../models";

const playerColorsArray = Object.values(PLAYER_COLOR);

const generateUuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    // eslint-disable-next-line no-mixed-operators
    const r = (Math.random() * 16) | 0,
      // eslint-disable-next-line no-mixed-operators
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const coloredPlayerExists = (players: Player[], color: PLAYER_COLOR) => {
  return players.some((player) => player.color === color);
};

const buttonClassNames = (players: Player[], color: PLAYER_COLOR) => {
  const colorVariants = {
    [`${PLAYER_COLOR.BLUE}-exists`]:
      "text-2xl btn btn-circle btn-lg bg-blue-500 text-primary-content hover:bg-blue-600 hover:text-primary-content ring-2 ring-offset-primary-content ring-blue-600",
    [`${PLAYER_COLOR.BLUE}-missing`]:
      "text-2xl btn btn-circle btn-lg ring-2 ring-offset-primary-content ring-blue-600 text-blue-500",
    [`${PLAYER_COLOR.GREEN}-exists`]:
      "text-2xl btn btn-circle btn-lg bg-green-500 text-primary-content hover:bg-green-600 hover:text-primary-content ring-2 ring-offset-primary-content ring-green-600",
    [`${PLAYER_COLOR.GREEN}-missing`]:
      "text-2xl btn btn-circle btn-lg ring-2 ring-offset-primary-content ring-green-600 text-green-500",
    [`${PLAYER_COLOR.RED}-exists`]:
      "text-2xl btn btn-circle btn-lg bg-red-500 text-primary-content hover:bg-red-600 hover:text-primary-content ring-2 ring-offset-primary-content ring-red-600",
    [`${PLAYER_COLOR.RED}-missing`]:
      "text-2xl btn btn-circle btn-lg ring-2 ring-offset-primary-content ring-red-600 text-red-500",
    [`${PLAYER_COLOR.YELLOW}-exists`]:
      "text-2xl btn btn-circle btn-lg bg-yellow-500 text-primary-content hover:bg-yellow-600 hover:text-primary-content ring-2 ring-offset-primary-content ring-yellow-600",
    [`${PLAYER_COLOR.YELLOW}-missing`]:
      "text-2xl btn btn-circle btn-lg ring-2 ring-offset-primary-content ring-yellow-600 text-yellow-500",
  };

  return coloredPlayerExists(players, color)
    ? colorVariants[`${color}-exists`]
    : colorVariants[`${color}-missing`];
};

export default function PlayersSetupList() {
  const { value: players, setter: updatePlayers } = useContext(PlayersContext);
  const handleClick = useCallback(
    (color: PLAYER_COLOR) => {
      if (coloredPlayerExists(players, color)) {
        updatePlayers((players) => {
          return players.filter((player) => player.color !== color);
        });
        return;
      }
      updatePlayers((players) => {
        return [
          ...players,
          {
            code: generateUuid(),
            color: color.toString(),
          },
        ];
      });
    },
    [players]
  );

  return (
    <ul className="flex flex-wrap px-0 justify-around w-screen">
      {playerColorsArray.map((color) => (
        <button
          key={color}
          className={buttonClassNames(players, color)}
          onClick={() => handleClick(color)}
        >
          {coloredPlayerExists(players, color) ? "×" : "+"}
        </button>
      ))}
    </ul>
  );
}
