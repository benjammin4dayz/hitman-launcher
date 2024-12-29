export type DefaultState = {
  gamePath: string;
  peacockPath: string;
  game: boolean;
  gameLoading: boolean;
  server: boolean;
  serverLoading: boolean;
  patcher: boolean;
  patcherLoading: boolean;
};

export const initialState: DefaultState = {
  gamePath: '',
  peacockPath: '',
  game: false,
  gameLoading: false,
  server: false,
  serverLoading: false,
  patcher: false,
  patcherLoading: false,
};

export type Action =
  | { type: 'START_GAME' }
  | { type: 'GAME_STARTED' }
  | { type: 'STOP_GAME' }
  | { type: 'SET_GAME_PATH'; path: string }
  | { type: 'START_SERVER' }
  | { type: 'SERVER_STARTED' }
  | { type: 'STOP_SERVER' }
  | { type: 'START_PATCHER' }
  | { type: 'PATCHER_STARTED' }
  | { type: 'STOP_PATCHER' }
  | { type: 'SET_PEACOCK_PATH'; path: string }
  | { type: 'SHUTDOWN' };

export const reducer = (state: DefaultState, action: Action): DefaultState => {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, gameLoading: true };
    case 'GAME_STARTED':
      return { ...state, game: true, gameLoading: false };
    case 'STOP_GAME':
      return { ...state, game: false, gameLoading: false };
    case 'START_SERVER':
      return { ...state, serverLoading: true };
    case 'SERVER_STARTED':
      return { ...state, server: true, serverLoading: false };
    case 'STOP_SERVER':
      return { ...state, server: false, serverLoading: false };
    case 'START_PATCHER':
      return { ...state, patcherLoading: true };
    case 'PATCHER_STARTED':
      return { ...state, patcher: true, patcherLoading: false };
    case 'STOP_PATCHER':
      return { ...state, patcher: false, patcherLoading: false };
    case 'SET_GAME_PATH':
      return { ...state, gamePath: action.path };
    case 'SET_PEACOCK_PATH':
      return { ...state, peacockPath: action.path };
    case 'SHUTDOWN':
      return { ...state, game: false, server: false, patcher: false };
    default:
      return state;
  }
};

export default reducer;
