const avatars = [
    '🎮', '🎨', '🎯', '🚀', '⭐', '🌟', '🎪', '🎭', '🎵', '🏆', 
    '👑', '💎', '🔥', '⚡', '🌈', '🦄', '🐲', '🤖', '👾', '🎸',
    '🎺', '🎷', '🥳', '😎', '🤩', '🥰', '😍', '🤗', '😁', '🎊'
  ];
export const MAX_AVATARS = 30;


  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' }
  ];
export const GAME_MODES = {
  CLASSIC: 'classic',
  QUICK: 'quick',
  CREATIVE: 'creative',
  COMPETITIVE: 'competitive'
} as const
export const GAME_SETTINGS = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 8,
  DRAW_TIME_CLASSIC: 60,
  DRAW_TIME_QUICK: 30,
  QUICK_GAME_DURATION: 5 * 60 // 5 minutes
} as const


///////
export const GAME_CONFIG = {
  TIMER_DURATION: 75,
  MAX_PLAYERS: 8,
  ROUNDS_TOTAL: 3,
  CURRENT_ROUND: 2
} as const;

export const DRAWING_CONFIG = {
  CANVAS_WIDTH: 600,
  CANVAS_HEIGHT: 400,
  DEFAULT_BRUSH_SIZE: 5,
  DEFAULT_COLOR: '#000000',
  ERASER_MULTIPLIER: 2
} as const;

export const BRUSH_SIZES = [2, 5, 10, 15, 20] as const;

export const COLOR_PALETTE = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
  '#808080', '#90EE90', '#FFB6C1', '#20B2AA', '#DDA0DD', '#F0E68C'
] as const;

export type GameState = 'waiting' | 'drawing' | 'guessing' | 'results';
export type DrawingTool = 'brush' | 'eraser';

export interface Player {
  id: number;
  name: string;
  score: number;
  isDrawing: boolean;
  avatar: string;
  rank: number;
}

export interface ChatMessage {
  id: number;
  player: string;
  message: string;
  type: 'chat' | 'guess';
}

//////

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 1, player: 'ArtMaster', message: 'Salut tout le monde! 👋', type: 'chat' },
  { id: 2, player: 'SketchKing', message: 'Est-ce que c\'est un animal?', type: 'guess' },
  { id: 3, player: 'DoodleQueen', message: 'Chat?', type: 'guess' },
  { id: 4, player: 'PaintPro', message: 'Non, c\'est plus gros!', type: 'chat' },
  { id: 5, player: 'ColorWiz', message: 'Éléphant!', type: 'guess' }
];

export const CURRENT_WORD = '_ _ _ _ _ _';
export const WORD_CATEGORY = 'Animals';

////

export const MOCK_PLAYERS: Player[] = [
  { id: 1, name: 'Vous', score: 1250, isDrawing: true, avatar: '🎨', rank: 1 },
  { id: 2, name: 'ArtMaster', score: 980, isDrawing: false, avatar: '👑', rank: 2 },
  { id: 3, name: 'SketchKing', score: 750, isDrawing: false, avatar: '⭐', rank: 3 },
  { id: 4, name: 'DoodleQueen', score: 620, isDrawing: false, avatar: '💎', rank: 4 },
  { id: 5, name: 'PaintPro', score: 480, isDrawing: false, avatar: '🏆', rank: 5 },
  { id: 6, name: 'ColorWiz', score: 320, isDrawing: false, avatar: '🎯', rank: 6 }
];