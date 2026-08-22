export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },

  TRACKS: {
    LIST: '/tracks',
    BY_ID: (id: string) => `/tracks/${id}`,
    CREATE: '/tracks',
    UPDATE: (id: string) => `/tracks/${id}`,
    DELETE: (id: string) => `/tracks/${id}`,
    UPLOAD_URL: '/tracks/upload-url',

    PLAY: (id: string) => `/tracks/${id}/play`,

    LIKE: (id: string) => `/tracks/${id}/like`,
    UNLIKE: (id: string) => `/tracks/${id}/like`,
    LIKES_COUNT: (id: string) => `/tracks/${id}/likes`,
  },

  PLAYLISTS: {
    LIST: '/playlists',
    CREATE: '/playlists',
    BY_ID: (id: string) => `/playlists/${id}`,
    UPDATE: (id: string) => `/playlists/${id}`,
    DELETE: (id: string) => `/playlists/${id}`,
  },

  USERS: {
    HISTORY: '/users/me/history',
    CLEAR_HISTORY: '/users/me/history',
    LIKED_TRACKS: '/users/me/liked-tracks',
    DOWNLOADS: '/users/me/downloads',
    FOLLOWING: '/users/me/following',
  },
} as const;