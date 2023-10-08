export enum GAME_STATE {
  SETUP,
  PLAYING,
};

export enum PLAYER_COLOR {
  RED = 'ROSSO',
  BLUE = 'BLU',
  GREEN = 'VERDE',
  YELLOW = 'GIALLO',
};

export type Player = {
  code: string;
  color: string;
};
