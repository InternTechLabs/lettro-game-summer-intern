// src/constants/enums.ts

export enum RoomStatus {
  WAITING = 'WAITING',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED',
  CLOSED = 'CLOSED',
}

export enum GameStatus {
  WAITING = 'WAITING',
  STARTING = 'STARTING',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum MessageType {
  CHAT = 'CHAT',
  SYSTEM = 'SYSTEM',
  GUESS = 'GUESS',
  CORRECT_GUESS = 'CORRECT_GUESS',
  GAME_EVENT = 'GAME_EVENT',
}
