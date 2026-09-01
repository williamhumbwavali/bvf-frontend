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
    TRENDING: '/tracks/trending',
  },

  PLAYLISTS: {
    LIST: '/playlists',
    CREATE: '/playlists',
    BY_ID: (id: string) => `/playlists/${id}`,
    UPDATE: (id: string) => `/playlists/${id}`,
    DELETE: (id: string) => `/playlists/${id}`,
    TRACKS: (id: string) => `/playlists/${id}/tracks`,
    TRACK: (id: string, trackId: string) =>
      `/playlists/${id}/tracks/${trackId}`,
  },

  ALBUMS: {
    LIST: '/albums',
    CREATE: '/albums',
    BY_ID: (id: string) => `/albums/${id}`,
  },

  USERS: {
    HISTORY: '/users/me/history',
    CLEAR_HISTORY: '/users/me/history',
    LIKED_TRACKS: '/users/me/liked-tracks',
    DOWNLOADS: '/users/me/downloads',
    FOLLOWING: '/users/me/following',
    UPDATE_PROFILE: '/users/me/me'
  },
  Genres: {
    LIST: '/genres',
    BY_ID: (id: string) => `/genres/${id}`,
    SLUG: (slug: string) => `/genres/slugs/${slug}`
  },
  ARTISTS: {
    LIST: '/artists',

    ME: '/artists/me',

    BY_ID: (id: string) =>
      `/artists/${id}`,

    BY_USERNAME: (username: string) =>
      `/artists/username/${username}`,
  },
} as const;
