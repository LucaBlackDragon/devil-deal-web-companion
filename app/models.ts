export enum GAME_STATE {
  SETUP,
  PLAYING,
};

export enum PLAYER_COLOR {
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  YELLOW = 'yellow',
};

export type Player = {
  code: string;
  color: string;
};
